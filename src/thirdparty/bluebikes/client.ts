import {IStationsAccessor} from "./interfaces.js";
import {StationResponse} from "./types.js";
import {type AxiosInstance, AxiosResponse} from "axios";

class Client implements IStationsAccessor {
    private readonly axiosInstance: AxiosInstance;


    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getStations(): Promise<StationResponse> {

        let response: AxiosResponse<StationResponse>;
        try {
            response = await this.axiosInstance.get<StationResponse>(
                "https://gbfs.lyft.com/gbfs/1.1/bos/en/station_information.json"
            );
        } catch (error) {
            throw new Error("Could not get stations");
        }

        return response.data;
    }
}

export default Client;