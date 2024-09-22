import {IStationAccessor, IStationEbikesAccessor} from "../data/services/bluebikes";
import {ITableGenerator} from "../data/services/tables";
import {EBikeInformation, Station} from "../../thirdparty/bluebikes/types";
import console from "node:console";
import {IDeserializer} from "../data/serializers/strings";
import {Id, Name} from "../data/types/bluebikes/stations";

interface IStationCommandProcessor {
    processStationInformationCommand(stationIdentifier: string): Promise<undefined>
    processStationEbikesInformationCommand(stationIdentifier: string): Promise<undefined>
}

class StationCommandProcessor implements IStationCommandProcessor {
    private readonly stationAccessor: IStationAccessor;
    private readonly ebikesAccessor: IStationEbikesAccessor;
    private readonly tableGenerator: ITableGenerator;
    private readonly stationIdDeserializer: IDeserializer<Id>;
    private readonly stationNameDeserializer: IDeserializer<Name>;


    constructor(stationAccessor: IStationAccessor,
                ebikesAccessor: IStationEbikesAccessor,
                tableGenerator: ITableGenerator,
                stationIdDeserializer: IDeserializer<Id>,
                stationNameDeserializer: IDeserializer<Name>) {
        this.stationAccessor = stationAccessor;
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
                station = await this.stationAccessor.getStation(deserializedIdentifier);
            } catch (error) {
                console.error("An error occurred", error);
                return;
            }

            if (station) {
                console.log(this.tableGenerator.generateStationTable(station).toString())
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
}

export {
    IStationCommandProcessor,
    StationCommandProcessor
}