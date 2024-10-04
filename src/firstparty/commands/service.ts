import {IStationsAccessor} from "../data/services/bluebikes.js";
import {ITableGenerator} from "../data/services/tables.js";
import console from "node:console";
import {IDeserializer} from "../data/serializers/strings.js";
import {Name} from "../data/types/bluebikes/stations.js";

interface IStationCommandProcessor {
    // TODO: @jaebradley create a range class
    processStationSearchCommand(stationIdentifier: string, limit: number): Promise<undefined>;

    processStationEbikesSearchCommand(stationIdentifier: string, limit: number, minimumEbikesRange: number, minimumEbikesCount: number): Promise<undefined>;
}

class StationCommandProcessor implements IStationCommandProcessor {
    private readonly stationsAccessor: IStationsAccessor;
    private readonly tableGenerator: ITableGenerator;
    private readonly stationNameDeserializer: IDeserializer<Name>;


    constructor(stationAccessor: IStationsAccessor,
                tableGenerator: ITableGenerator,
                stationNameDeserializer: IDeserializer<Name>) {
        this.stationsAccessor = stationAccessor;
        this.tableGenerator = tableGenerator;
        this.stationNameDeserializer = stationNameDeserializer;
    }

    async processStationSearchCommand(stationIdentifier: string, limit: number): Promise<undefined> {
        const deserializedIdentifier = this.stationNameDeserializer.deserialize(stationIdentifier);
        if (deserializedIdentifier) {
            const stations = await this.stationsAccessor.searchStations(deserializedIdentifier, limit);
            console.log(this.tableGenerator.generateSearchResultsTable(stations).toString());
            console.log("\n");
        }
    }

    async processStationEbikesSearchCommand(stationIdentifier: string, limit: number, minimumEbikesRange: number, minimumEbikesCount: number): Promise<undefined> {
        const deserializedIdentifier = this.stationNameDeserializer.deserialize(stationIdentifier);
        if (deserializedIdentifier) {
            const stations = await this.stationsAccessor.searchStationsByEbikeFilters(deserializedIdentifier, minimumEbikesRange, minimumEbikesCount, limit);
            console.log(this.tableGenerator.generateEbikesSearchResultsTable(stations).toString());
            console.log("\n");
        }
    }
}

export {
    IStationCommandProcessor,
    StationCommandProcessor
}