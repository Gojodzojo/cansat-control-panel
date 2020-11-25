#define WASM_EXPORT __attribute__((visibility("default")))
#include <math.h>

struct Vector {
  double x, y, z;
};

extern void Log(double number);
extern void setFlightProperties(
  double positionX, double positionY, double positionZ,
  double velocityX, double velocityY, double velocityZ,
  double accelerationX, double accelerationY, double accelerationZ
);

float airDensity = 1.225;
float gravityForceVal = 9.80665;

double canSatMass, airCS, deltaTime;
struct Vector position, velocity, acceleration;

struct Vector addVectors(struct Vector *v1, struct Vector *v2) {
  struct Vector result = {
    v1->x + (v2->x * deltaTime),
    v1->y + (v2->y * deltaTime),
    v1->z + (v2->z * deltaTime)
  };  
  return result;
}

struct Vector multiplyByScalar(struct Vector *v, double scalar) {
  struct Vector result = {
    v->x * scalar,
    v->y * scalar,
    v->z * scalar
  };
  return result;
}

double deg2rad(double deg) {
  return M_PI * 2 * (deg / 360);
}

WASM_EXPORT
void setVariables(double newCanSatMass, double newAirCS, double windSpeed, double windAzimuth, double canSatSurfaceArea, double initialHeight, double frameRate) {
  deltaTime = 1/frameRate;
  canSatMass = newCanSatMass;
  airCS = newAirCS;

  /*double rad = deg2rad(windAzimuth);
  struct Vector windForce = {cos(rad) * -1, 0, sin(rad) * -1};
  if (windAzimuth <= 180) {
    windForce = multiplyByScalar(&windForce, -1);
  }

   https://www.engineeringtoolbox.com/wind-load-d_1775.html */
	/*double windForceVal = 0.5 * airCS * airDensity * pow(windSpeed, 2);
	windForce = multiplyByScalar(&windForce, windForceVal);
	struct Vector windAcceleration = multiplyByScalar(&windForce, 1 / canSatMass);*/

  //acceleration = windAcceleration;
  acceleration.y = gravityForceVal * -1;

  velocity.x = 0;
  velocity.y = 0;
  velocity.z = 0;

  position.x = 0;
  position.y = initialHeight;
  position.z = 0;
}

WASM_EXPORT
void doPhysics() {
  // Do it as first to set properties in zero second  
  setFlightProperties(
    position.x, position.y, position.z,
    velocity.x, velocity.y, velocity.z,
    acceleration.x, acceleration.y, acceleration.z
  );   

  velocity = addVectors(&velocity, &acceleration);
  position = addVectors(&position, &velocity);  

  // https://cnx.org/contents/TqqPA4io@2.43:olSre6jy@4/6-4-Si%C5%82a-oporu-i-pr%C4%99dko%C5%9B%C4%87-graniczna
  double dragForceVal = 0.5 * airDensity * airCS * pow(velocity.y, 2);   
  acceleration.y = (dragForceVal - gravityForceVal);
}

