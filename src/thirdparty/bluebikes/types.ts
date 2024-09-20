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

type StationResponse = {
    data: {
        stations: Station[]
    };
    last_updated: number;
    ttl: number;
    version: string;
}

export {
    Station,
    StationResponse
}