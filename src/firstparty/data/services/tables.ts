// @ts-ignore
import Table from "cli-table3";
import {Station} from "../../../thirdparty/bluebikes/types";

interface ITableGenerator {
    generateStationTable(station: Station): Table;
}

class TableGenerator implements ITableGenerator {
    generateStationTable(station: Station) {
        const table = new Table({
            head: ['Name', 'Id', 'Capacity', 'Latitude', 'Longitude'],
        });
        table.push([
            station.name,
            station.station_id,
            station.capacity,
            station.lat,
            station.lon
        ]);
        return table;
    }
}

export {
    ITableGenerator,
    TableGenerator
}