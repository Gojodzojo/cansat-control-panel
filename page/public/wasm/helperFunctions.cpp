#ifndef __INTELLISENSE__
#include <emscripten.h>
#endif
#include <cstdint>
#include "DataFrames.h"

void transmit(DataFrame *df) {
    EM_ASM({
        postMessage({
            heading: $0,
            pressure: $1,
            temperature: $2,
            latitude: $3 / 10000000,
            longitude: $4 / 10000000,
            time: $5 / 1000,
            height: $6,            
            messageCode: $7,
            rssi: 0
        })
    }, df->heading, df->pressure, df->temperature, df->latitude, df->longitude, df->time, df->height, (MessageCode)(df->messageCode));
}

int getTemperature() {
    return EM_ASM_INT({        
        return getTemperature();
    });    
}

int getPressure() {
    return EM_ASM_INT({        
        return getPressure();
    });    
}

int milis() {
    return EM_ASM_INT({        
        return milis();
    });    
}

int getHeading() {
    return EM_ASM_INT({        
        return heading;
    });    
}