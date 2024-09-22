import {beforeEach, describe, it} from "node:test";
import {StationService} from "../../services/bluebikes";
import Client from "../../../../thirdparty/bluebikes/client";
import axios from "axios";
import {NonEmptyString, UUID} from "../strings";
import assert from "node:assert";

describe('StationsService', () => {
    let client: Client;
    let service: StationService;
    beforeEach(
        () => {
            client = new Client(axios.create());
            service = new StationService(client, client);
        }
    )
    describe('getStation', () => {
        it('returns station information for id', async () => {
            const station = await service.getStation(new UUID("f83473ea-0de8-11e7-991c-3863bb43a7d0"));
            assert.ok(station)
            assert.equal("f83473ea-0de8-11e7-991c-3863bb43a7d0", station.station_id)
        })

        it('returns station information for name', async () => {
            const station = await service.getStation(new NonEmptyString("Roxbury Crossing T Stop - Columbus Ave at Tremont St"));
            assert.ok(station);
            assert.equal("Roxbury Crossing T Stop - Columbus Ave at Tremont St", station.name)
        })

        // TODO: @jaebradley test error cases
    })

    describe('getEbikes', () => {
        it('returns station ebikes', async () => {
            const ebikes = await service.getEbikes(new UUID("f83473ea-0de8-11e7-991c-3863bb43a7d0"));
            assert.ok(Array.isArray(ebikes));
            assert.ok(0 <= ebikes.length)
        });

        // TODO: @jaebradley test error cases
    });
});