#ifndef GPS_H
#define GPS_H

#ifndef __INTELLISENSE__
#include <emscripten.h>
#endif

class GPS {
  public:
  int latitude;
  int longitude;
  int altitude;
  
  void readData() {
    latitude = EM_ASM_DOUBLE({ return getLatitude() }) * 10000000;
    longitude = EM_ASM_DOUBLE({ return getLongitude() }) * 10000000;
    altitude = EM_ASM_DOUBLE({ return position._y });
  }
  
};
#endif