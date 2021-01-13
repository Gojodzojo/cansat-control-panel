#define WASM_EXPORT __attribute__((visibility("default")))
#include <math.h>

enum sateliteModes{
  positionMode,
  azimuthMode,
  emergencyMode
};

struct Position {
  int longitude, latitude;
};

struct Vector {
  double x, y, z;
};

extern void Log(double number);
extern void sendDataFrame(
  double positionX, double positionY, double positionZ,
  double velocityX, double velocityY, double velocityZ,
  double accelerationX, double accelerationY, double accelerationZ,
  double azimuth, int message
);

float AIR_DENSITY = 1.225;
int currentAzimuth, targetAzimuth, nextMessage;
double canSatMass, deltaTime, descentSpeed, forwardSpeed, angularSpeed;
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
void setVariables(double newDescentSpeed, double newForwardSpeed, double newAngularSpeed, double newCanSatMass, double windSpeed, double windAzimuth, double canSatSurfaceArea, double initialHeight, double frameRate) {
  descentSpeed = newDescentSpeed;
  forwardSpeed = newForwardSpeed;
  angularSpeed = newAngularSpeed;  
  canSatMass = newCanSatMass;
  deltaTime = 1/frameRate;

  double rad = deg2rad(windAzimuth);
  struct Vector windForce = {cos(rad) * -1, 0, sin(rad) * -1};
  if (windAzimuth <= 180) {
    windForce = multiplyByScalar(&windForce, -1);
  }

  /* https://www.engineeringtoolbox.com/wind-load-d_1775.html */
	double windForceVal = 0.5 * canSatSurfaceArea * AIR_DENSITY * pow(windSpeed, 2);
	windForce = multiplyByScalar(&windForce, windForceVal);
	struct Vector windAcceleration = multiplyByScalar(&windForce, 1 / canSatMass);

  acceleration = windAcceleration;
  //acceleration.y = gravityForceVal * -1;

  velocity.x = 0;
  velocity.y = newDescentSpeed;
  velocity.z = 0;

  position.x = 0;
  position.y = initialHeight;
  position.z = 0;
}

WASM_EXPORT
void doPhysics() {      
  velocity = addVectors(&velocity, &acceleration);
  position = addVectors(&position, &velocity);  
}

void steeringAlgorithm() {
  sendDataFrame(
    position.x, position.y, position.z,
    velocity.x, velocity.y, velocity.z,
    acceleration.x, acceleration.y, acceleration.z,
    currentAzimuth, nextMessage
  );
}