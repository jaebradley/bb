import {Command} from "commander";
import Client from "../../thirdparty/bluebikes/client.js";
import axios from "axios";
import * as console from "node:console";
import {StationEBikesResponse, StationStatusResponse} from "../../thirdparty/bluebikes/types.js";
import {StationService} from "../data/services/bluebikes";
import {TableGenerator} from "../data/services/tables";
import {StationCommandProcessor} from "./service";


const commandProcessor = new StationCommandProcessor(
    new StationService(new Client(axios.create())),
    new TableGenerator()
);

const stationsCommand = new Command("stations");

stationsCommand.alias("s");

stationsCommand
    .command("info")
    .alias("i")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action((specifiedIdentifier: string) => {
        commandProcessor.processStationInformationCommand(specifiedIdentifier);
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