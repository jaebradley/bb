// @ts-ignore
import Table from "cli-table3";
import {SearchResult} from "./search.js";
import {ISerializer} from "../serializers/strings.js";
import {DockingStatus, EbikeData} from "../serializers/ebikes.js";

interface ITableGenerator {
    generateSearchResultsTable(results: SearchResult[]): Table;

    generateEbikesSearchResultsTable(results: SearchResult[]): Table;
}

class TableGenerator implements ITableGenerator {
    readonly ebikesRangeSerializer: ISerializer<number[]>;
    readonly ebikesAvailabilitySerializer: ISerializer<EbikeData[]>;


    constructor(ebikesRangeSerializer: ISerializer<number[]>, ebikesAvailabilitySerializer: ISerializer<EbikeData[]>) {
        this.ebikesRangeSerializer = ebikesRangeSerializer;
        this.ebikesAvailabilitySerializer = ebikesAvailabilitySerializer;
    }

    generateSearchResultsTable(results: SearchResult[]) {
        const table = new Table({
            head: ['Name', 'eBikes', 'Docks'],
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
        results.forEach(result => {
            table.push([
                result.name,
                this.ebikesAvailabilitySerializer.serialize(
                    result
                        .ebikes
                        .map(v =>
                            ({
                                range: v.range_estimate.estimated_range_miles,
                                dockingStatus: v.docking_capability === 1 ? DockingStatus.DOCKABLE : DockingStatus.NOT_DOCKABLE
                            })
                        )),
                this.ebikesRangeSerializer.serialize(result.ebikes.map(v => v.range_estimate.estimated_range_miles))
            ]);
        })

        return table;
    }
}

export {
    ITableGenerator,
    TableGenerator
}