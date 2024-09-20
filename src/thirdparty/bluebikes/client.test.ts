import Client from "./client.js";
import {describe, it} from "node:test";
import assert from "node:assert/strict";
import axios from "axios";

describe("Client", () => {
    describe("getStations", () => {
        it('returns stations', async () => {
            const client = new Client(axios.create());
            const stationsData = await client.getStations();
            assert.ok(stationsData)
            assert.ok(stationsData.data)
            assert.ok(stationsData.data.stations)
            assert.ok(stationsData.data.stations.length)
        });
    });
});