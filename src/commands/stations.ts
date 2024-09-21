import {Command} from "commander";
import Client from "../thirdparty/bluebikes/client.js";
import axios from "axios";
import * as console from "node:console";
import {StationEBikesResponse, StationsResponse, StationStatusResponse} from "../thirdparty/bluebikes/types.js";

const stationsCommand = new Command("stations");

stationsCommand
    .command("info")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action(async (identifier) => {
        const client = new Client(axios.create());
        let stationResponse: StationsResponse;
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
    });

stationsCommand
    .command("status")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action(async (identifier) => {
        const client = new Client(axios.create());
        let stationStatusResponse: StationStatusResponse;
        try {
            stationStatusResponse = await client.getStationStatuses();
        } catch (error) {
            console.error("An error occurred", error);
            return;
        }

        const matchingStation = stationStatusResponse
            .data
            .stations
            .find(station => station.station_id === identifier);

        if (matchingStation) {
            console.log(matchingStation);
        } else {
            console.log("Could not find matching station for", identifier);
        }
    });

stationsCommand
    .command("ebikes")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action(async (identifier) => {
        const client = new Client(axios.create());
        let ebikesResponse: StationEBikesResponse;
        try {
            ebikesResponse = await client.getStationEbikes();
        } catch (error) {
            console.error("An error occurred", error);
            return;
        }

        const matchingStationEbikes = ebikesResponse
            .data
            .stations
            .filter(station => station.station_id === `motivate_BOS_${identifier}`)
            .flatMap(v => v.ebikes);

        if (matchingStationEbikes) {
            console.log(matchingStationEbikes);
        } else {
            console.log("Could not find any ebikes at the specified station", identifier);
        }
    });

export default stationsCommand;