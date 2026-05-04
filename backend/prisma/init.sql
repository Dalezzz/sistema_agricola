CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farms table
CREATE TABLE IF NOT EXISTS "Farm" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  area FLOAT NOT NULL,
  "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crops table
CREATE TABLE IF NOT EXISTS "Crop" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plots table
CREATE TABLE IF NOT EXISTS "Plot" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  area FLOAT NOT NULL,
  "farmId" TEXT NOT NULL REFERENCES "Farm"(id) ON DELETE CASCADE,
  "cropId" TEXT REFERENCES "Crop"(id),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensors table
CREATE TABLE IF NOT EXISTS "Sensor" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  "farmId" TEXT NOT NULL REFERENCES "Farm"(id) ON DELETE CASCADE,
  "plotId" TEXT REFERENCES "Plot"(id),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor readings table
CREATE TABLE IF NOT EXISTS "SensorReading" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sensorId" TEXT NOT NULL REFERENCES "Sensor"(id) ON DELETE CASCADE,
  value FLOAT NOT NULL,
  unit TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_farm_owner" ON "Farm"("ownerId");
CREATE INDEX IF NOT EXISTS "idx_plot_farm" ON "Plot"("farmId");
CREATE INDEX IF NOT EXISTS "idx_sensor_farm" ON "Sensor"("farmId");
CREATE INDEX IF NOT EXISTS "idx_sensor_reading_sensor" ON "SensorReading"("sensorId");
