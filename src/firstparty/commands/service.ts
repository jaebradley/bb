import {IStationEbikesAccessor, IStationsAccessor} from "../data/services/bluebikes.js";
import {ITableGenerator} from "../data/services/tables.js";
import {EBikeInformation, Station} from "../../thirdparty/bluebikes/types.js";
import console from "node:console";
import {IDeserializer} from "../data/serializers/strings.js";
import {Id, Name} from "../data/types/bluebikes/stations.js";

interface IStationCommandProcessor {
    processStationInformationCommand(stationIdentifier: string): Promise<undefined>

    processStationEbikesInformationCommand(stationIdentifier: string): Promise<undefined>

    // TODO: @jaebradley create a range class
    processStationSearchCommand(stationIdentifier: string, limit: number, minimumEbikesRange: number): Promise<undefined>;
}

class StationCommandProcessor implements IStationCommandProcessor {
    private readonly stationsAccessor: IStationsAccessor;
    private readonly ebikesAccessor: IStationEbikesAccessor;
    private readonly tableGenerator: ITableGenerator;
    private readonly stationIdDeserializer: IDeserializer<Id>;
    private readonly stationNameDeserializer: IDeserializer<Name>;


    constructor(stationAccessor: IStationsAccessor,
                ebikesAccessor: IStationEbikesAccessor,
                tableGenerator: ITableGenerator,
                stationIdDeserializer: IDeserializer<Id>,
                stationNameDeserializer: IDeserializer<Name>) {
        this.stationsAccessor = stationAccessor;
        this.ebikesAccessor = ebikesAccessor;
        this.tableGenerator = tableGenerator;
        this.stationIdDeserializer = stationIdDeserializer;
        this.stationNameDeserializer = stationNameDeserializer;
    }

    async processStationInformationCommand(stationIdentifier: string): Promise<undefined> {
        const deserializedIdentifier = this.stationIdDeserializer.deserialize(stationIdentifier) || this.stationNameDeserializer.deserialize(stationIdentifier);

        if (deserializedIdentifier) {
            let station: Station | undefined;
            try {
                station = await this.stationsAccessor.getStation(deserializedIdentifier);
            } catch (error) {
                console.error("An error occurred", error);
                return;
            }

            if (station) {
                console.log(this.tableGenerator.generateStationsTable([station]).toString())
            } else {
                console.error("Could not find matching station for", stationIdentifier);
            }
        } else {
            console.error("Invalid station id or station name", stationIdentifier);
        }
    }

    async processStationEbikesInformationCommand(stationIdentifier: string): Promise<undefined> {
        const deserializedIdentifier = this.stationIdDeserializer.deserialize(stationIdentifier);
        if (deserializedIdentifier) {
            let ebikes: EBikeInformation[] | undefined;

            try {
                ebikes = await this.ebikesAccessor.getEbikes(deserializedIdentifier);
            } catch (error) {
                console.error("An error occurred", error);
                return;
            }

            if (undefined === ebikes) {
                console.error("Could not find ebikes information", stationIdentifier);
            } else if (0 >= ebikes.length) {
                console.log("No ebikes at station", stationIdentifier);
            } else {
                console.log(this.tableGenerator.generateEbikesTable(ebikes).toString());
            }
        } else {
            console.error("Invalid station id", stationIdentifier);
        }
    }

    async processStationSearchCommand(stationIdentifier: string, limit: number, minimumEbikesRange: number): Promise<undefined> {
        const deserializedIdentifier = this.stationNameDeserializer.deserialize(stationIdentifier);
        if (deserializedIdentifier) {
            const stations = await this.stationsAccessor.searchStations(deserializedIdentifier, minimumEbikesRange, limit);
            console.log(this.tableGenerator.generateSearchResultsTable(stations).toString());
            console.log("\n");
        }
    }
}

export {
    IStationCommandProcessor,
    StationCommandProcessor
}