export interface Vector {
    x: number,
    y: number,
    z: number
}

interface GeolocationCoordinates {
    readonly accuracy: number;
    readonly altitude: number | null;
    readonly altitudeAccuracy: number | null;
    readonly heading: number | null;
    readonly latitude: number;
    readonly longitude: number;
    readonly speed: number | null;
}

declare var GeolocationCoordinates: {
    prototype: GeolocationCoordinates;
    new(): GeolocationCoordinates;
};

interface GeolocationPosition {
    readonly coords: GeolocationCoordinates;
    readonly timestamp: number;
}

declare var GeolocationPosition: {
    prototype: GeolocationPosition;
    new(): GeolocationPosition;
};

export const getPosition = () => new Promise<GeolocationPosition>((resolve, reject) => {        
    navigator.geolocation.getCurrentPosition(resolve, reject);    
})

interface WeatherResp {
    baro_pressure: {
        units: string,
        value: number
    },
    wind_direction: {
        units: string,
        value: number
    },
    wind_speed: {
        units: string,
        value: number
    },
    message?: string
}

export const getWeather = async (latitude: number, longitude: number) => {
    try {
        console.log("Fetching weather")
        const resp = await fetch(`https://climacell-microweather-v1.p.rapidapi.com/weather/realtime?unit_system=si&fields=wind_speed,wind_direction,baro_pressure&lat=${latitude}&lon=${longitude}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "climacell-microweather-v1.p.rapidapi.com",
                "x-rapidapi-key": "2d1f8c67f6msh9352c048b60f48ap1bd0b5jsn06b13115e239"
            }
        })
        const json = await resp.json() as WeatherResp
        if(json.message) {
            console.log(json.message)
            return null
        }
        return {
                windAzimuth: json.wind_direction.value,
                windSpeed: json.wind_speed.value
            }
    }
    catch(error) {
        console.log("Can't connect to weather api")
        console.error(error)
        return null
    }
}


