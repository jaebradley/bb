import {NonEmptyString, UUID} from "../types/strings";

interface ISerializer<T> {
    serialize(value: T): string;
}

interface IDeserializer<T> {
    deserialize(value: string): T | undefined;
}


class NonEmptyStringSerializationUtility implements ISerializer<NonEmptyString>, IDeserializer<NonEmptyString> {
    private static readonly _DEFAULT_INSTANCE: NonEmptyStringSerializationUtility = new NonEmptyStringSerializationUtility();

    private constructor() {
    }

    deserialize(value: string): NonEmptyString | undefined {
        try {
            return new NonEmptyString(value)
        } catch (error) {
            return undefined;
        }
    }

    serialize(value: NonEmptyString): string {
        return value.value;
    }


    static get DEFAULT_INSTANCE(): NonEmptyStringSerializationUtility {
        return this._DEFAULT_INSTANCE;
    }
}

class UUIDSerializationUtility implements ISerializer<UUID>, IDeserializer<UUID> {
    private static readonly _DEFAULT_INSTANCE: UUIDSerializationUtility = new UUIDSerializationUtility();

    private constructor() {
    }


    deserialize(value: string): UUID | undefined {
        try {
            return new UUID(value)
        } catch (error) {
            return undefined;
        }
    }

    serialize(value: UUID): string {
        return value.value;
    }


    static get DEFAULT_INSTANCE(): UUIDSerializationUtility {
        return this._DEFAULT_INSTANCE;
    }
}

export {
    IDeserializer,
    ISerializer,
    NonEmptyStringSerializationUtility,
    UUIDSerializationUtility
}