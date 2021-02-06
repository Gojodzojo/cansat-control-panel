#include <emscripten.h>
#include <iostream>
#include <cstdint>
#include "helperFunctions.cpp"
#include "Lm35.cpp"
#include "DataFrames.h"
#include "GPS.cpp"
#include "encodingFunctions.cpp"
#include "Position.h"

using namespace std;

GPS gps;
Lm35 lm35;

const int maximalPointsCount = 5;
unsigned int pointsCount = 0;
Position positions[maximalPointsCount];
int32_t targetAzimuth = 0;
MessageCode currentMode = MessageCode::azimuth;

MessageCode nextMessageCode = MessageCode::nothing;
uint8_t bytesBuffer[sizeof(PositionMessageFrame)];
unsigned int bytesInBuffer = 0;

extern "C" 
{      
  void loop()
  {        
    gps.readData();

    DataFrame df;
    df.heading = getHeading();
    df.pressure = getPressure();
    df.temperature = lm35.readTemperature();
    df.latitude = gps.latitude;
    df.longitude = gps.longitude;
    df.height = gps.altitude;
    df.time = millis();        
    df.messageCode = nextMessageCode;
    nextMessageCode = MessageCode::nothing;

    radio_transmit(&df);

    uint8_t avaliableBytes = radio_available();
    if (avaliableBytes > 0)
    {
      uint8_t temp[avaliableBytes];
      radio_receive(temp, avaliableBytes);       

      memcpy(&bytesBuffer[bytesInBuffer], &temp, avaliableBytes);
      bytesInBuffer += avaliableBytes;      

      if (bytesInBuffer > sizeof(PositionMessageFrame))
      {
        bytesInBuffer = 0;
      }
      else if (bytesInBuffer >= sizeof(MessageFrame))
      {
        if (bytesInBuffer == sizeof(PositionMessageFrame) && (MessageCode)bytesBuffer[0] == MessageCode::position) // dodaj nową lokalizację
        {                    
          SerialUSB_println("!!!!!!!!!RECEIVED NEW POSITION!!!!!!!!!!!!!");

          PositionMessageFrame pf = decodeFrame<PositionMessageFrame>(bytesBuffer);
          string latStr = String(pf.latitude);
          latStr = latStr.substring(0, latStr.length() - 6) + "." + latStr.substring(latStr.length() - 6);
          string lonStr = String(pf.longitude);          
          lonStr = lonStr.substring(0, lonStr.length() - 6) + "." + lonStr.substring(lonStr.length() - 6);

          SerialUSB_println("Latitude: " + latStr);
          SerialUSB_println("Longitude: " + lonStr);          
          
          currentMode = (MessageCode)bytesBuffer[0];
          if (pointsCount < maximalPointsCount)
          {
            positions[pointsCount].latitude = pf.latitude;
            positions[pointsCount].longitude = pf.longitude;
            pointsCount++;
            nextMessageCode = MessageCode::position;
          }
          else
          {
            nextMessageCode = MessageCode::error;
          }
          bytesInBuffer = 0;
        }
        else if (bytesInBuffer == sizeof(AzimuthMessageFrame) && (MessageCode)bytesBuffer[0] == MessageCode::azimuth) // ustaw azymut lotu
        {
          SerialUSB_println("!!!!!!!!!RECEIVED NEW AZIMUTH!!!!!!!!!!!!!");
          AzimuthMessageFrame af = decodeFrame<AzimuthMessageFrame>(bytesBuffer);      
          SerialUSB_println(String(af.azimuth));

          targetAzimuth = af.azimuth;
          pointsCount = 0;          
          currentMode = (MessageCode)bytesBuffer[0];
          nextMessageCode = (MessageCode)bytesBuffer[0];
          bytesInBuffer = 0;
        }
        else if (bytesInBuffer == sizeof(MessageFrame) && bytesBuffer[0] >= 3 && bytesBuffer[0] <= 5) // tryb awaryjny
        {                    
          SerialUSB_println("!!!!!!!!!Message FRAME!!!!!!!!!!!!!");
          
          pointsCount = 0;
          currentMode = (MessageCode)bytesBuffer[0];
          nextMessageCode = (MessageCode)bytesBuffer[0];
          bytesInBuffer = 0;
        }
      }
    }
  }
}