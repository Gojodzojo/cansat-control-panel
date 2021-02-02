#ifndef DataFrames
#define DataFrames
#include <cstdint>

enum class MessageCode: int8_t {
  error = -1,
  nothing = 0,
  position = 1,
  azimuth = 2,
  emergency = 3,
  calibration = 4,
  wait = 5
};

struct DataFrame {
  uint32_t pressure;
  int32_t temperature;
  int32_t heading;
  uint32_t height;
  int32_t latitude;
  int32_t longitude;
  MessageCode messageCode;
  uint32_t time;
};


struct PositionFrame {
  const MessageCode messageCode = MessageCode::position;
  int32_t longitude;
  int32_t latitude;
};


struct AzimuthFrame {
  const MessageCode messageCode = MessageCode::azimuth;
  int32_t azimuth;
};


struct EmergencyFrame {
  const MessageCode messageCode = MessageCode::emergency;
};


struct CalibrationFrame {
  const MessageCode messageCode = MessageCode::calibration;
};
#endif