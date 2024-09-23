import {NonEmptyString} from "../types/strings.js";
import {EBikeInformation, Station} from "../../../thirdparty/bluebikes/types.js";
import MiniSearch from "minisearch";
import {IStationEbikesAccessor, IStationsAccessor} from "../../../thirdparty/bluebikes/interfaces.js";

interface ISearch {
    getResults(term: NonEmptyString, minimumEbikesRange: number, limit: number): Promise<Station[]>;
}

class SearchService implements ISearch {
    private readonly database;
    private readonly stationsAccessor: IStationsAccessor;
    private readonly ebikesAccessor: IStationEbikesAccessor;

    constructor(stationsAccessor: IStationsAccessor, ebikesAccessor: IStationEbikesAccessor) {
        this.database = new MiniSearch({
            fields: ['station_id', 'name', 'ebikes'],
            // TODO: @jaebradley make these field names types to be used by the table generation logic
            storeFields: ['station_id', 'name', 'lon', 'lat', 'capacity', 'ebikes']
        });
        this.stationsAccessor = stationsAccessor;
        this.ebikesAccessor = ebikesAccessor;
    }

    // TODO: @jaebradley handle TTL and refreshing data
    async getResults(term: NonEmptyString, minimumEbikesRange: number, limit: number): Promise<Station[]> {
        if (0 >= this.database.documentCount) {
            const data = await this.stationsAccessor.getStations();
            const stationEbikes = await this.ebikesAccessor.getStationEbikes();
            // TODO: @jaebradley fix this prefix hacking
            const bikesByStationId = new Map<string, EBikeInformation[]>(stationEbikes.data.stations.map(v => ([v.station_id.replace("motivate_BOS_", ""), v.ebikes])));
            await this.database.addAllAsync(data.data.stations.map(station => ({
                ...station,
                id: station.station_id,
                ebikes: bikesByStationId.get(station.station_id) || []
            })));
        }
        // @ts-ignore
        return Promise.resolve(this.database.search(term.value, {
            filter: (result) => {
                if (minimumEbikesRange > 0) {
                    return result.ebikes.some((ebike: EBikeInformation) => ebike.range_estimate.estimated_range_miles >= minimumEbikesRange)
                }
                return true;
            }
        }).slice(0, limit));
    }
}

export {
    ISearch,
    SearchService
}