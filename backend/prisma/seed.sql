-- Seed data for Sistema Agricola

INSERT INTO "User" (id, email, password, "firstName", "lastName", "createdAt", "updatedAt")
VALUES
  ('user-1', 'admin@sisag.local', 'admin123', 'Admin', 'Principal', now(), now()),
  ('user-2', 'tecnico@sisag.local', 'tecnico123', 'Maria', 'Rojas', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Farm" (id, name, location, area, "ownerId", "createdAt", "updatedAt")
VALUES
  ('farm-1', 'Finca El Sol', 'Cordoba', 120.5, 'user-1', now(), now()),
  ('farm-2', 'Predio Norte', 'Santa Fe', 86.2, 'user-1', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Crop" (id, name, type, "createdAt", "updatedAt")
VALUES
  ('crop-1', 'Maiz', 'Cereal', now(), now()),
  ('crop-2', 'Soja', 'Oleaginosa', now(), now()),
  ('crop-3', 'Trigo', 'Cereal', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Plot" (id, name, area, "farmId", "cropId", "createdAt", "updatedAt")
VALUES
  ('plot-1', 'Lote A', 32.5, 'farm-1', 'crop-1', now(), now()),
  ('plot-2', 'Lote B', 28.0, 'farm-1', 'crop-2', now(), now()),
  ('plot-3', 'Lote C', 25.4, 'farm-2', 'crop-3', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Sensor" (id, name, type, "farmId", "plotId", "createdAt", "updatedAt")
VALUES
  ('sensor-1', 'Sensor Humedad 01', 'Humedad', 'farm-1', 'plot-1', now(), now()),
  ('sensor-2', 'Sensor Temp 01', 'Temperatura', 'farm-1', 'plot-2', now(), now()),
  ('sensor-3', 'Sensor Viento 01', 'Viento', 'farm-2', 'plot-3', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SensorReading" (id, "sensorId", value, unit, "createdAt")
VALUES
  ('reading-1', 'sensor-1', 41.2, '%', now() - interval '2 hours'),
  ('reading-2', 'sensor-1', 38.6, '%', now()),
  ('reading-3', 'sensor-2', 25.4, 'C', now() - interval '1 hours'),
  ('reading-4', 'sensor-2', 26.1, 'C', now()),
  ('reading-5', 'sensor-3', 14.2, 'km/h', now() - interval '3 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "IrrigationEvent" (id, "plotId", duration, "waterUsed", "createdAt")
VALUES
  ('irrigation-1', 'plot-1', 45, 1500, now() - interval '1 days'),
  ('irrigation-2', 'plot-2', 30, 900, now() - interval '12 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "WeatherData" (id, temperature, humidity, precipitation, "windSpeed", "createdAt")
VALUES
  ('weather-1', 24.3, 62.5, 0.2, 12.4, now() - interval '6 hours'),
  ('weather-2', 26.1, 58.9, 0.0, 9.7, now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Report" (id, title, content, type, "createdAt")
VALUES
  ('report-1', 'Rendimiento semanal', 'Resumen de rendimiento y riego semanal.', 'Semanal', now() - interval '3 days'),
  ('report-2', 'Analisis de suelo', 'Resultados de muestras de suelo por lote.', 'Especial', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Prediction" (id, "plotId", "cropYield", confidence, "createdAt")
VALUES
  ('prediction-1', 'plot-1', 82.4, 0.78, now() - interval '1 days'),
  ('prediction-2', 'plot-2', 88.1, 0.83, now() - interval '8 hours')
ON CONFLICT (id) DO NOTHING;
