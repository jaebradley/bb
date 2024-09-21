import {StationsResponse, StationStatusResponse} from "./types.js";

interface IStationsAccessor {
    getStations(): Promise<StationsResponse>;
}

interface IStationStatusesAccessor {
    getStationStatuses(): Promise<StationStatusResponse>;
}

export {
    IStationsAccessor,
    IStationStatusesAccessor
}