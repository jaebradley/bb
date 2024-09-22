import {Command} from "commander";
import Client from "../../thirdparty/bluebikes/client.js";
import axios from "axios";
import * as console from "node:console";
import {StationStatusResponse} from "../../thirdparty/bluebikes/types.js";
import {StationService} from "../data/services/bluebikes";
import {TableGenerator} from "../data/services/tables";
import {StationCommandProcessor} from "./service";
import {NonEmptyStringSerializationUtility, UUIDSerializationUtility} from "../data/serializers/strings";

const stationService = new StationService(new Client(axios.create()), new Client(axios.create()));

const commandProcessor = new StationCommandProcessor(
    stationService,
    stationService,
    new TableGenerator(),
    UUIDSerializationUtility.DEFAULT_INSTANCE,
    NonEmptyStringSerializationUtility.DEFAULT_INSTANCE
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
    .alias("e")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action(async (identifier) => {
        commandProcessor.processStationEbikesInformationCommand(identifier);
    });

export default stationsCommand;