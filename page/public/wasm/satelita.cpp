#include "helperFunctions.cpp"
#include <iostream>
#include <cstdint>
#include "DataFrames.h"
#include "GPS.cpp"

// byte bytesBuffer[sizeof(PositionFrame) + 4 + 1]; // bufor do gromadzenia bajtów przesłanych ze stacji naziemnej
// int bytesInBuffer = 0;
// byte nextMessage = 0;


GPS gps;

extern "C" 
{      
  void loop()
  {    
    gps.readData();

    DataFrame df;
    df.heading = getHeading();
    df.pressure = getPressure();
    df.temperature = getTemperature();
    df.latitude = gps.latitude;
    df.longitude = gps.longitude;
    df.height = gps.altitude;
    df.time = milis();        
    df.messageCode = MessageCode::nothing;

    transmit(&df);

    // uint8_t avaliableBytes = radio.available();
    // if (avaliableBytes > 0)
    // {
    //   // sprawdzić, czy radio.available() zwraca liczbę bajtów razem z bajtem kończącym odbiór
    //   uint8_t temp[avaliableBytes];
    //   radio.receive(temp, avaliableBytes);

    //   // Nie dodawaj nowych bajtów do bufora po opróżnieniu go jeśli nie jest to na pewno początek nowej ramki
    //   if ((bytesInBuffer == 0 && temp[0] == 65) || bytesInBuffer > 0)
    //   {
    //     memcpy(&bytesBuffer[bytesInBuffer], &temp, avaliableBytes);
    //     bytesInBuffer += avaliableBytes;
    //   }

    //   if (bytesInBuffer > sizeof(PositionFrame) + 4)
    //   {
    //     bytesInBuffer = 0;
    //   }
    //   else if (bytesInBuffer >= sizeof(EmergencyFrame) + 4)
    //   {
    //     if (bytesInBuffer == sizeof(PositionFrame) + 4 && bytesBuffer[2] == 1)
    //     {
    //       // dodaj nową lokalizację
    //       SerialUSB.println();
    //       SerialUSB.println("!!!!!!!!!RECEIVED NEW POSITION!!!!!!!!!!!!!");
    //       PositionFrame pozycja;
    //       uint8_t dataFrameBytes[sizeof(pozycja) + 5];
    //       uint8_t arraylength = sizeof(pozycja) + 5;
    //       //        SerialUSB.println(validateMessage(dataFrameBytes, sizeof(pozycja)));
    //       if (validateMessage(bytesBuffer, sizeof(pozycja)))
    //       {
    //         decodeMesage(bytesBuffer, &pozycja, sizeof(pozycja));

    //         SerialUSB.println("New lat position: " + String(pozycja.latitude).substring(0, 2) + "." + String(pozycja.latitude).substring(2) + "0");
    //         SerialUSB.println("New long position: " + String(pozycja.longitude).substring(0, 2) + "." + String(pozycja.longitude).substring(2) + "0");
    //         SerialUSB.println();
    //         //           currentmode = positionMode;
    //         //           if(totalPointsNumber < 5){
    //         //             positionTable[totalPointsNumber].latitude = pozycja.latitude;
    //         //             positionTable[totalPointsNumber].longitude = pozycja.longitude;
    //         //             SerialUSB.println(positionTable[totalPointsNumber].latitude);
    //         //             SerialUSB.println(positionTable[totalPointsNumber].longitude);
    //         //             totalPointsNumber++;
    //         //             nextMessage = 1;
    //         //           }else{
    //         //             nextMessage = -1;
    //         //           }
    //       }
    //       bytesInBuffer = 0;
    //     }
    //     else if (bytesInBuffer == sizeof(AzimuthFrame) + 4 && bytesBuffer[2] == 2)
    //     {
    //       // ustaw azymut lotu
    //       SerialUSB.println();
    //       SerialUSB.println("!!!!!!!!!RECEIVED NEW AZIMUTH!!!!!!!!!!!!!");

    //       AzimuthFrame azymut;
    //       uint8_t dataFrameBytes[sizeof(azymut) + 5];
    //       uint8_t arraylength = sizeof(azymut) + 5;

    //       if (validateMessage(bytesBuffer, sizeof(azymut)))
    //       {
    //         //          totalPointsNumber = 0;
    //         decodeMesage(bytesBuffer, &azymut, sizeof(azymut) + 4);
    //         SerialUSB.println("New azimuth: " + String(azymut.azimuth));
    //         SerialUSB.println();
    //         //          currentmode = azimuthMode;
    //         //          newAzimuth = azymut.azimuth;
    //         //          SerialUSB.println(newAzimuth);
    //         nextMessage = 2;
    //       }
    //       bytesInBuffer = 0;
    //     }
    //     else if (bytesInBuffer == sizeof(EmergencyFrame) + 4 && bytesBuffer[2] == 3)
    //     {
    //       // tryb awaryjny
    //       SerialUSB.println();
    //       SerialUSB.println("!!!!!!!!!RECEIVED EMERGENCY FRAME!!!!!!!!!!!!!");
    //       SerialUSB.println();
    //       if (validateMessage(bytesBuffer, sizeof(EmergencyFrame)))
    //       {
    //         //          totalPointsNumber = 0;
    //         //          currentmode = emergencyMode;
    //         nextMessage = 3;
    //       }
    //       bytesInBuffer = 0;
    //     }
    //   }
    // }
  }
}
