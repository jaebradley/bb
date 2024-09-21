class NonEmptyString {
    protected readonly _value: string;


    constructor(value: string) {
        if (value.trim()) {
            this._value = value;
        } else {
            throw new Error(`value is an empty string: ${value}`)
        }
    }


    get value(): string {
        return this._value;
    }
}

class UUID extends NonEmptyString {
    // From https://stackoverflow.com/a/77644040/5225575
    static readonly REGEX: RegExp = /^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89AB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$/

    protected readonly _value: string;


    constructor(value: string) {
        super(value);

        if (UUID.REGEX.test(value)) {
            this._value = value;
        } else {
            throw new Error(`value is not a valid UUID string: ${value}`)
        }
    }


    get value(): string {
        return this._value;
    }
}

export {
    NonEmptyString,
    UUID
}