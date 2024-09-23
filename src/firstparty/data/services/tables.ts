// @ts-ignore
import Table from "cli-table3";
import {EBikeInformation, Station} from "../../../thirdparty/bluebikes/types.js";

interface ITableGenerator {
    generateStationsTable(station: Station[]): Table;

    generateEbikesTable(ebikes: EBikeInformation[]): Table;
}

class TableGenerator implements ITableGenerator {

    generateEbikesTable(ebikes: EBikeInformation[]): Table {
        const table = new Table({
            head: ['Battery', 'Range'],
        });
        ebikes.forEach(ebike => table.push([ebike.battery_charge_percentage, ebike.range_estimate.estimated_range_miles]))
        return table;
    }

    generateStationsTable(station: Station[]): Table {
        const table = new Table({
            head: ['Name', 'ID', 'Capacity', 'Latitude', 'Longitude'],
        });

        station.forEach(station => {
            table.push([
                station.name,
                station.station_id,
                station.capacity,
                station.lat,
                station.lon,
                // // @ts-ignore
                // station.ebikes.map(ebike => ebike.range_estimate.estimated_range_miles).join(' | '),
            ]);
        })

        return table;
    }
}

export {
    ITableGenerator,
    TableGenerator
}