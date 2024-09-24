import {NonEmptyString} from "../types/strings.js";
import {EBikeInformation, Station, StationStatus} from "../../../thirdparty/bluebikes/types.js";
import MiniSearch from "minisearch";
import {
    IStationEbikesAccessor,
    IStationsAccessor,
    IStationStatusesAccessor
} from "../../../thirdparty/bluebikes/interfaces.js";

type SearchResult = {
    ebikes: EBikeInformation[];
    status: StationStatus;
} & Station;

interface ISearch {
    getResults(term: NonEmptyString, minimumEbikesRange: number, limit: number): Promise<SearchResult[]>;
}

class SearchService implements ISearch {
    private readonly database;
    private readonly stationsAccessor: IStationsAccessor;
    private readonly ebikesAccessor: IStationEbikesAccessor;
    private readonly stationStatusesAccessor: IStationStatusesAccessor;

    constructor(stationsAccessor: IStationsAccessor,
                ebikesAccessor: IStationEbikesAccessor,
                stationStatusesAccessor: IStationStatusesAccessor) {
        this.database = new MiniSearch<SearchResult>({
            // TODO: @jaebradley flatten the status data fields
            fields: ['station_id', 'name', 'ebikes', 'status'],
            // TODO: @jaebradley make these field names types to be used by the table generation logic
            storeFields: ['station_id', 'name', 'lon', 'lat', 'capacity', 'ebikes', 'status'],
        });
        this.stationsAccessor = stationsAccessor;
        this.ebikesAccessor = ebikesAccessor;
        this.stationStatusesAccessor = stationStatusesAccessor;
    }

    // TODO: @jaebradley handle TTL and refreshing data
    async getResults(term: NonEmptyString, minimumEbikesRange: number, limit: number): Promise<SearchResult[]> {
        if (0 >= this.database.documentCount) {
            // TODO: @jaebradley error handling and initialization
            const data = await this.stationsAccessor.getStations();
            const stationEbikes = await this.ebikesAccessor.getStationEbikes();
            const stationStatuses = await this.stationStatusesAccessor.getStationStatuses();
            // TODO: @jaebradley fix this prefix hacking
            const bikesByStationId = new Map<string, EBikeInformation[]>(stationEbikes.data.stations.map(v => ([v.station_id.replace("motivate_BOS_", ""), v.ebikes])));
            const statusesByStationId = new Map<string, StationStatus>(stationStatuses.data.stations.map(status => ([status.station_id, status])));
            // TODO: @jaebradley make this status lookup more robust
            // @ts-ignore
            await this.database.addAllAsync(data.data.stations.map(station => ({
                ...station,
                id: station.station_id,
                ebikes: bikesByStationId.get(station.station_id) || [],
                status: statusesByStationId.get(station.station_id),
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
    SearchService,
    SearchResult,
}