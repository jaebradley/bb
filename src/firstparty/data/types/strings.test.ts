import {describe, it} from "node:test";
import {NonEmptyString, UUID} from "./strings";
import assert from "node:assert";

describe("strings", () => {
    describe("NonEmptyString", () => {
        it('is invalid for an empty string', () => {
            assert.throws(() => new NonEmptyString(""), new Error("value is an empty string: "))
        })

        it('is invalid for a whitespace string', () => {
            assert.throws(() => new NonEmptyString("   "), new Error("value is an empty string:    "))
        })

        it('is valid for a non-whitespace string', () => {
            const value = new NonEmptyString("foobar");
            assert.equal("foobar", value.value);
        })
    });

    describe('UUID', () => {
       it('is valid for an upper-case UUID', () => {
           const uuid = new UUID("909D42B1-32B8-41D9-809B-CC61E38E33AF");
           assert.equal("909D42B1-32B8-41D9-809B-CC61E38E33AF", uuid.value)
       })
    });
})