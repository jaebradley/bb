import {EBikeInformation, Station} from "../../../thirdparty/bluebikes/types";
import {Id, Name} from "../types/bluebikes/stations";
import {
    IStationEbikesAccessor as IClientStationEbikesAccessor,
    IStationsAccessor
} from "../../../thirdparty/bluebikes/interfaces";

interface IStationAccessor {
    getStation(identifier: Id | Name): Promise<Station | undefined>;
}

interface IStationEbikesAccessor {
    getEbikes(identifier: Id): Promise<EBikeInformation[] | undefined>;
}

class StationService implements IStationAccessor, IStationEbikesAccessor {
    private readonly stationsAccessor: IStationsAccessor;
    private readonly ebikesAccessor: IClientStationEbikesAccessor;


    constructor(stationsAccessor: IStationsAccessor, ebikesAccessor: IClientStationEbikesAccessor) {
        this.stationsAccessor = stationsAccessor;
        this.ebikesAccessor = ebikesAccessor;
    }

    async getStation(identifier: Id | Name): Promise<Station | undefined> {
        const stations = await this.stationsAccessor.getStations();
        return stations.data.stations.find(station => station.station_id === identifier.value || station.name === identifier.value);
    }

    async getEbikes(identifier: Id): Promise<EBikeInformation[] | undefined> {
        const ebikes = await this.ebikesAccessor.getStationEbikes();
        return ebikes.data.stations.filter(v => v.station_id === `motivate_BOS_${identifier.value}`).flatMap(v => v.ebikes);
    }
}

export {
    IStationAccessor,
    IStationEbikesAccessor,
    StationService
}