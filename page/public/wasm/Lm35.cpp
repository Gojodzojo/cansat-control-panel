#include <emscripten.h>

class Lm35 {
    public:

    float readTemperature()
    {
        return EM_ASM_DOUBLE({        
            return getTemperature();
        });
    }
};