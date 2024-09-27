import {Command} from "commander";
import Client from "../../thirdparty/bluebikes/client.js";
import axios from "axios";
import * as console from "node:console";
import {StationStatusResponse} from "../../thirdparty/bluebikes/types.js";
import {StationService} from "../data/services/bluebikes.js";
import {TableGenerator} from "../data/services/tables.js";
import {StationCommandProcessor} from "./service.js";
import {NonEmptyStringSerializationUtility, UUIDSerializationUtility} from "../data/serializers/strings.js";
import {SearchService} from "../data/services/search.js";
// @ts-ignore
import yoctoSpinner from "yocto-spinner";

const client = new Client(axios.create());
const stationService = new StationService(client, client, new SearchService(client, client, client));

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
        await commandProcessor.processStationEbikesInformationCommand(identifier);
    });

const searchCommand = stationsCommand
    .command("search")
    .alias("s");

searchCommand
    .argument("<name>", "Station name")
    .option("-l, --limit [limit]", "Value is a positive number for the maximum inclusive number of results to return", parseInt, 5)
    .action(async (name, {limit}) => {
        const spinner = yoctoSpinner({text: 'Searching stations\n'}).start();
        try {
            await commandProcessor.processStationSearchCommand(name, limit);
        } finally {
            spinner.stop();
            spinner.clear();
        }
    })

searchCommand
    .command("ebikes")
    .alias("e")
    .argument("<name>", "Station name")
    .option("-l, --limit [limit]", "Value is a positive number for the maximum inclusive number of results to return", parseInt, 5)
    .option("-r, --min-range [range]", "Value is a non-negative number for the minimum (inclusive) desired range for ebikes in miles", parseFloat, 0)
    .option("-c, --min-count [count]", "Value is a positive integer for the minimum (inclusive) desired ebikes at station", parseFloat, 1)
    .action(async (name, {limit, minRange, minCount}) => {
        const spinner = yoctoSpinner({text: 'Searching stations\n'}).start();
        try {
            await commandProcessor.processStationEbikesSearchCommand(name, limit, minRange, minCount);
        } finally {
            spinner.stop();
            spinner.clear();
        }
    })


export default stationsCommand;