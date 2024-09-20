import {Command} from "commander";
import Client from "../thirdparty/bluebikes/client.js";
import axios from "axios";
import * as console from "node:console";
import {StationResponse} from "../thirdparty/bluebikes/types.js";

const stationsCommand = new Command("stations");

stationsCommand
    .command("info")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action(async (identifier) => {
        const client = new Client(axios.create());
        let stationResponse: StationResponse;
        try {
            stationResponse = await client.getStations();
        } catch (error) {
            console.error("An error occurred", error);
            return;
        }

        const matchingStation = stationResponse
            .data
            .stations
            .find(station => station.station_id === identifier);

        if (matchingStation) {
            console.log(matchingStation);
        } else {
            console.log("Could not find matching station for", identifier);
        }
    })

export default stationsCommand;