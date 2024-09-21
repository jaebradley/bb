import {IStationAccessor} from "../data/services/bluebikes";
import {ITableGenerator} from "../data/services/tables";
import {NonEmptyString, UUID} from "../data/types/strings";
import {Station} from "../../thirdparty/bluebikes/types";
import console from "node:console";

interface IStationCommandProcessor {
    processStationInformationCommand(stationIdentifier: string): Promise<undefined>
}

class StationCommandProcessor implements IStationCommandProcessor {
    private readonly stationAccessor: IStationAccessor;
    private readonly tableGenerator: ITableGenerator;


    constructor(stationAccessor: IStationAccessor, tableGenerator: ITableGenerator) {
        this.stationAccessor = stationAccessor;
        this.tableGenerator = tableGenerator;
    }

    async processStationInformationCommand(stationIdentifier: string): Promise<undefined> {
        let deserializedIdentifier;
        try {
            deserializedIdentifier = new UUID(stationIdentifier);
        } catch (e) {
            try {
                deserializedIdentifier = new NonEmptyString(stationIdentifier);
            } catch (e) {
            }
        }

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
}

export {
    IStationCommandProcessor,
    StationCommandProcessor
}