// @ts-ignore
import Table from "cli-table3";
import {EBikeInformation, Station} from "../../../thirdparty/bluebikes/types";

interface ITableGenerator {
    generateStationTable(station: Station): Table;

    generateEbikesTable(ebikes: EBikeInformation[]): Table;
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

    generateEbikesTable(ebikes: EBikeInformation[]): Table {
        const table = new Table({
            head: ['Battery', 'Range'],
        });
        ebikes.forEach(ebike => table.push([ebike.battery_charge_percentage, ebike.range_estimate.estimated_range_miles]))
        return table;
    }
}

export {
    ITableGenerator,
    TableGenerator
}