#include <emscripten.h>
#include <cstdint>
#include <string>
#include <iostream>
#include "DataFrames.h"

#define String std::to_string
#define substring substr

void radio_transmit(DataFrame *df) {
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

int getPressure() {
    return EM_ASM_INT({        
        return getPressure();
    });    
}

int millis() {
    return EM_ASM_INT({        
        return millis();
    });    
}

int getHeading() {
    return EM_ASM_INT({        
        return heading;
    });    
}

unsigned int radio_available() {
    return EM_ASM_INT({
        return radio_available();
    });
}

void SerialUSB_println(std::string text)
{
    emscripten_run_script( (std::string("console.log('") + text + "')").c_str() );
}

void radio_receive(uint8_t temp[], unsigned int avaliableBytes) {
    for(int i = 0; i < avaliableBytes; i++) {
        temp[i] = EM_ASM_INT({
            return messageBytes.shift();
        });        
    }       
}