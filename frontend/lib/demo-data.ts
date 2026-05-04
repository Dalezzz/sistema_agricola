export type DemoFarmRow = {
  id: string
  name: string
  location: string
  area: number
  plots: number
  sensors: number
  createdAt: string
}

export type DemoPlotRow = {
  id: string
  name: string
  crop: string
  area: number
  state: string
}

export type DemoCropRow = {
  id: string
  name: string
  type: string
  plots: number
  createdAt: string
}

export type DemoSensorRow = {
  id: string
  name: string
  type: string
  farm: string
  plot: string
  latestReading: string
}

export type DemoUserRow = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type DemoIrrigationRow = {
  id: string
  plotId: string
  duration: number
  waterUsed: number
  createdAt: string
}

export type DemoWeatherRow = {
  id: string
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  createdAt: string
}

export type DemoPredictionRow = {
  id: string
  plotId: string
  cropYield: number
  confidence: number
  createdAt: string
}

export type DemoReportRow = {
  id: string
  titulo: string
  tipo: string
  fecha: string
}

export const demoFarmRows: DemoFarmRow[] = [
  {
    id: 'farm-1',
    name: 'Predio San Miguel',
    location: 'Tuluá, Valle del Cauca',
    area: 48,
    plots: 6,
    sensors: 11,
    createdAt: '2026-04-12T08:30:00.000Z',
  },
  {
    id: 'farm-2',
    name: 'Finca El Oasis',
    location: 'Palmira, Valle del Cauca',
    area: 31,
    plots: 4,
    sensors: 8,
    createdAt: '2026-04-16T10:00:00.000Z',
  },
]

export const demoPlotRows: DemoPlotRow[] = [
  { id: 'plot-1', name: 'Lote Norte', crop: 'Maíz', area: 7.5, state: 'Activo' },
  { id: 'plot-2', name: 'Lote Centro', crop: 'Aguacate', area: 5.1, state: 'En monitoreo' },
  { id: 'plot-3', name: 'Lote Sur', crop: 'Café', area: 4.3, state: 'Activo' },
]

export const demoCropRows: DemoCropRow[] = [
  { id: 'crop-1', name: 'Maíz amarillo', type: 'Grano', plots: 3, createdAt: '2026-03-08T09:15:00.000Z' },
  { id: 'crop-2', name: 'Aguacate Hass', type: 'Frutal', plots: 2, createdAt: '2026-03-15T11:10:00.000Z' },
  { id: 'crop-3', name: 'Café castillo', type: 'Bebida', plots: 4, createdAt: '2026-04-01T08:45:00.000Z' },
]

export const demoSensorRows: DemoSensorRow[] = [
  {
    id: 'sensor-1',
    name: 'Sensor humedad Norte',
    type: 'Humedad',
    farm: 'Predio San Miguel',
    plot: 'Lote Norte',
    latestReading: '63% · 2026-05-02',
  },
  {
    id: 'sensor-2',
    name: 'Estacion clima Central',
    type: 'Clima',
    farm: 'Finca El Oasis',
    plot: 'Lote Centro',
    latestReading: '27 °C · 2026-05-02',
  },
]

export const demoUserRows: DemoUserRow[] = [
  { id: 'user-1', name: 'Laura Torres', email: 'laura.torres@demo.com', createdAt: '2026-03-22T14:10:00.000Z' },
  { id: 'user-2', name: 'Carlos Gómez', email: 'carlos.gomez@demo.com', createdAt: '2026-04-03T12:00:00.000Z' },
]

export const demoIrrigationRows: DemoIrrigationRow[] = [
  { id: 'ir-1', plotId: 'Lote Norte', duration: 45, waterUsed: 1200, createdAt: '2026-05-01T07:00:00.000Z' },
  { id: 'ir-2', plotId: 'Lote Centro', duration: 30, waterUsed: 860, createdAt: '2026-05-02T06:15:00.000Z' },
]

export const demoWeatherRows: DemoWeatherRow[] = [
  { id: 'weather-1', temperature: 27, humidity: 61, precipitation: 4, windSpeed: 11, createdAt: '2026-05-02T05:30:00.000Z' },
  { id: 'weather-2', temperature: 29, humidity: 55, precipitation: 0, windSpeed: 8, createdAt: '2026-05-02T11:30:00.000Z' },
]

export const demoPredictionRows: DemoPredictionRow[] = [
  { id: 'pred-1', plotId: 'Lote Norte', cropYield: 87.4, confidence: 0.91, createdAt: '2026-05-02T09:00:00.000Z' },
  { id: 'pred-2', plotId: 'Lote Centro', cropYield: 82.8, confidence: 0.86, createdAt: '2026-05-02T09:30:00.000Z' },
]

export const demoReportRows: DemoReportRow[] = [
  { id: 'report-1', titulo: 'Reporte semanal de clima', tipo: 'Ambiental', fecha: '2026-05-01' },
  { id: 'report-2', titulo: 'Reporte de rendimiento', tipo: 'Analitica', fecha: '2026-05-02' },
]