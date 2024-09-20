import {StationResponse} from "./types.js";

interface IStationsAccessor {
    getStations(): Promise<StationResponse>;
}

export {
    IStationsAccessor
}