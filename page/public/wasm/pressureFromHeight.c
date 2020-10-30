#define WASM_EXPORT __attribute__((visibility("default")))
#include <math.h>

WASM_EXPORT
float pressureFromHeight(float height) {
	return 101325 * pow(1-2.25577 * pow(10, -5) * height, 5.25588) / 100;
}