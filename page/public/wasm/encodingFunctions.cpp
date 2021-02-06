#include <cstdint>

template <typename T>
T decodeFrame(uint8_t *frameBytes) {  
  T targetObject;
  memcpy(&targetObject, frameBytes, sizeof(T));   
  return targetObject;
}