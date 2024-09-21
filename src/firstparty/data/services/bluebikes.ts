import {Station} from "../../../thirdparty/bluebikes/types";
import {Id, Name} from "../types/bluebikes/stations";
import {IStationsAccessor} from "../../../thirdparty/bluebikes/interfaces";

interface IStationAccessor {
    getStation(identifier: Id | Name): Promise<Station | undefined>;
}

class StationService implements IStationAccessor {
    private readonly stationsAccessor: IStationsAccessor;


    constructor(stationsAccessor: IStationsAccessor) {
        this.stationsAccessor = stationsAccessor;
    }

    async getStation(identifier: Id | Name): Promise<Station | undefined> {
        const stations = await this.stationsAccessor.getStations();
        return stations.data.stations.find(station => station.station_id === identifier.value || station.name === identifier.value);
    }
}

export {
    IStationAccessor,
    StationService
}