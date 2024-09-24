import {EBikeInformation, Station} from "../../../thirdparty/bluebikes/types.js";
import {Id, Name} from "../types/bluebikes/stations.js";
import {
    IStationEbikesAccessor as IClientStationEbikesAccessor,
    IStationsAccessor as IClientStationsAccessor,
} from "../../../thirdparty/bluebikes/interfaces.js";
import {ISearch, SearchResult} from "./search.js";
import {NonEmptyString} from "../types/strings.js";

interface IStationsAccessor {
    getStation(identifier: Id | Name): Promise<Station | undefined>;

    searchStations(searchTerm: NonEmptyString, minimumEbikesRange: number, limit: number): Promise<SearchResult[]>;
}

interface IStationEbikesAccessor {
    getEbikes(identifier: Id): Promise<EBikeInformation[] | undefined>;
}

class StationService implements IStationsAccessor, IStationEbikesAccessor {
    private readonly stationsAccessor: IClientStationsAccessor;
    private readonly ebikesAccessor: IClientStationEbikesAccessor;
    private readonly searchService: ISearch;


    constructor(stationsAccessor: IClientStationsAccessor, ebikesAccessor: IClientStationEbikesAccessor, searchService: ISearch) {
        this.stationsAccessor = stationsAccessor;
        this.ebikesAccessor = ebikesAccessor;
        this.searchService = searchService;
    }

    async getStation(identifier: Id | Name): Promise<Station | undefined> {
        const stations = await this.stationsAccessor.getStations();
        return stations.data.stations.find(station => station.station_id === identifier.value || station.name === identifier.value);
    }

    async getEbikes(identifier: Id): Promise<EBikeInformation[] | undefined> {
        const ebikes = await this.ebikesAccessor.getStationEbikes();
        return ebikes.data.stations.filter(v => v.station_id === `motivate_BOS_${identifier.value}`).flatMap(v => v.ebikes);
    }

    async searchStations(searchTerm: NonEmptyString,  minimumEbikesRange: number, limit: number): Promise<SearchResult[]> {
        return this.searchService.getResults(searchTerm, minimumEbikesRange, limit)
    }
}

export {
    IStationsAccessor,
    IStationEbikesAccessor,
    StationService
}