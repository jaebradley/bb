import {StationEBikesResponse, StationsResponse, StationStatusResponse} from "./types.js";

interface IStationsAccessor {
    getStations(): Promise<StationsResponse>;
}

interface IStationStatusesAccessor {
    getStationStatuses(): Promise<StationStatusResponse>;
}

interface IStationEbikesAccessor {
    getStationEbikes(): Promise<StationEBikesResponse>
}

export {
    IStationsAccessor,
    IStationStatusesAccessor,
    IStationEbikesAccessor,
}