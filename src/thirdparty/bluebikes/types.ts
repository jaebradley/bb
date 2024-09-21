type Station = {
    short_name: string;
    rental_methods: string[];
    rental_urls: {
        ios: string;
        android: string;
    },
    capacity: number;
    legacy_id: string;
    region_id: string;
    external_id: string;
    electric_bike_surcharge_waiver: boolean;
    lon: number;
    eightd_station_services: string[];
    eightd_has_key_dispenser: boolean;
    has_kiosk: boolean;
    name: string;
    station_type: string;
    lat: number,
    station_id: string;
}

type StationsResponse = {
    data: {
        stations: Station[]
    };
    last_updated: number;
    ttl: number;
    version: string;
}

type StationStatus = {
    num_bikes_disabled: number;
    last_reported: number;
    is_returning: number;
    num_ebikes_available: number;
    num_docks_disabled: number;
    legacy_id: string;
    is_installed: number;
    eightd_has_available_keys: boolean;
    num_bikes_available: number;
    num_docks_available: number;
    station_id: string;
    is_renting: number;
}

type StationStatusResponse = {
    data: {
        stations: StationStatus[]
    },
    last_updated: number;
    ttl: number;
    version: string;
}

export {
    Station,
    StationsResponse,
    StationStatus,
    StationStatusResponse,
}