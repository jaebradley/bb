import {IStationsAccessor, IStationStatusesAccessor} from "./interfaces.js";
import {StationsResponse, StationStatusResponse} from "./types.js";
import {type AxiosInstance, AxiosResponse} from "axios";

class Client implements IStationsAccessor, IStationStatusesAccessor {
    private readonly axiosInstance: AxiosInstance;
    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }


    async getStations(): Promise<StationsResponse> {

        let response: AxiosResponse<StationsResponse>;
        try {
            response = await this.axiosInstance.get<StationsResponse>(
                "https://gbfs.lyft.com/gbfs/1.1/bos/en/station_information.json"
            );
        } catch (error) {
            throw new Error("Could not get stations");
        }

        if (200 != response.status) {
            throw new Error("Unsuccessful station information request");
        }

        return response.data;
    }

    async getStationStatuses(): Promise<StationStatusResponse> {
        let response: AxiosResponse<StationStatusResponse>;
        try {
            response = await this.axiosInstance.get<StationStatusResponse>(
                "https://gbfs.lyft.com/gbfs/1.1/bos/en/station_status.json"
            );
        } catch (error) {
            throw new Error("Could not get station statuses");
        }

        if (200 != response.status) {
            throw new Error("Unsuccessful station statuses request");
        }

        return response.data;
    }
}

export default Client;