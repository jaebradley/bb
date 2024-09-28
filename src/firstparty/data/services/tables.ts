// @ts-ignore
import Table from "cli-table3";
import {EBikeInformation, Station} from "../../../thirdparty/bluebikes/types.js";
import {SearchResult} from "./search.js";

interface ITableGenerator {
    generateStationsTable(station: Station[]): Table;

    generateEbikesTable(ebikes: EBikeInformation[]): Table;

    generateSearchResultsTable(results: SearchResult[]): Table;
    generateEbikesSearchResultsTable(results: SearchResult[]): Table;
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

    generateSearchResultsTable(results: SearchResult[]) {
        const table = new Table({
            head: ['Name', 'Latitude', 'Longitude', 'eBikes', 'Docks'],
        });

        const serializeEbikeData = (result: SearchResult) => {
            if (result.status.num_ebikes_available) {

                const allRangeEstimates = result.ebikes.map(ebike => ebike.range_estimate).map(estimate => estimate.estimated_range_miles);
                const maxRangeEstimate = Math.max(...allRangeEstimates);
                const minRangeEstimate = Math.min(...allRangeEstimates);

                if (1 === result.status.num_ebikes_available) {
                    return `one e-bike with range ${minRangeEstimate}`;
                }

                return `${result.status.num_ebikes_available} e-bikes with range ${minRangeEstimate}-${maxRangeEstimate}`;
            }
        }

        const serializeDocksData = (result: SearchResult) => {
            return `Available: ${result.status.num_docks_available} | Disabled: ${result.status.num_docks_disabled}`;
        }

        results.forEach(result => {
            table.push([
                result.name,
                result.lat,
                result.lon,
                `Available: ${result.status.num_bikes_available} | Disabled: ${result.status.num_bikes_disabled} | ${serializeEbikeData(result)}`,
                serializeDocksData(result),

            ]);
        })

        return table;
    }

    generateEbikesSearchResultsTable(results: SearchResult[]) {
        const table = new Table({
            head: ['Name', 'eBikes', 'Range Available'],
        });

        /**
         * TODO: @jaebradley make this type require at least one ebike
         * @param result
         */
        const serializeEbikeData = (result: SearchResult) => {
            const allRangeEstimates = result.ebikes.map(ebike => ebike.range_estimate).map(estimate => estimate.estimated_range_miles);
            const maxRangeEstimate = Math.max(...allRangeEstimates);
            const minRangeEstimate = Math.min(...allRangeEstimates);

            if (1 === result.status.num_ebikes_available) {
                return `${minRangeEstimate}`;
            }

            return `${minRangeEstimate}-${maxRangeEstimate}`;
        }
        results.forEach(result => {
            table.push([
                result.name,
                result.ebikes.length,
                serializeEbikeData(result),
            ]);
        })

        return table;
    }
}

export {
    ITableGenerator,
    TableGenerator
}