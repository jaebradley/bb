import {NonEmptyString} from "../types/strings.js";
import {Station} from "../../../thirdparty/bluebikes/types.js";
import MiniSearch from "minisearch";
import {IStationsAccessor} from "../../../thirdparty/bluebikes/interfaces.js";

interface ISearch {
    getResults(term: NonEmptyString, limit: number): Promise<Station[]>;
}

class SearchService implements ISearch {
    private readonly database;
    private readonly stationsAccessor: IStationsAccessor;

    constructor(stationsAccessor: IStationsAccessor) {
        this.database = new MiniSearch({
            fields: ['station_id', 'name'],
            // TODO: @jaebradley make these field names types to be used by the table generation logic
            storeFields: ['station_id', 'name', 'lon', 'lat', 'capacity']
        });
        this.stationsAccessor = stationsAccessor;
    }

    // TODO: @jaebradley handle TTL and refreshing data
    async getResults(term: NonEmptyString, limit: number): Promise<Station[]> {
        if (0 >= this.database.documentCount) {
            const data = await this.stationsAccessor.getStations();
            await this.database.addAllAsync(data.data.stations.map(station => ({
                id: station.station_id,
                ...station
            })));
        }
        // @ts-ignore
        return Promise.resolve(this.database.search(term.value).slice(0, limit));
    }
}

export {
    ISearch,
    SearchService
}