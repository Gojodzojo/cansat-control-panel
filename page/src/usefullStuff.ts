export interface Vector {
    x: number,
    y: number,
    z: number
}

export const getPosition = () => new Promise<Position>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
})

interface weatherResp {
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
    }
}

export const getWeather = async (latitude: number, longitude: number): Promise<weatherResp> => {
    try {
        const resp = await fetch(`https://climacell-microweather-v1.p.rapidapi.com/weather/realtime?unit_system=si&fields=wind_speed,wind_direction,baro_pressure&lat=${latitude}&lon=${longitude}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "climacell-microweather-v1.p.rapidapi.com",
                "x-rapidapi-key": "2d1f8c67f6msh9352c048b60f48ap1bd0b5jsn06b13115e239"
            }
        })
        return resp.json()
    }
    catch(error) {
        console.error(error)
    }
}
    

