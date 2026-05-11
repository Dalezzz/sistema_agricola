import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  await prisma.user.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.sensorReading.deleteMany();
  await prisma.irrigationEvent.deleteMany();
  await prisma.weatherData.deleteMany();
  await prisma.report.deleteMany();
  await prisma.prediction.deleteMany();

  console.log('Creando usuarios...');
  await prisma.user.createMany({
    data: [
      { id: 'user-1', email: 'admin@sisag.local', password: 'admin123', firstName: 'Admin', lastName: 'Principal' },
      { id: 'user-2', email: 'tecnico@sisag.local', password: 'tecnico123', firstName: 'Maria', lastName: 'Rojas' },
    ],
  });

  console.log('Creando fincas...');
  await prisma.farm.createMany({
    data: [
      { id: 'farm-1', name: 'Finca El Sol', location: 'Cordoba', area: 120.5, ownerId: 'user-1' },
      { id: 'farm-2', name: 'Predio Norte', location: 'Santa Fe', area: 86.2, ownerId: 'user-1' },
    ],
  });

  console.log('Creando cultivos...');
  await prisma.crop.createMany({
    data: [
      { id: 'crop-1', name: 'Maiz', type: 'Cereal' },
      { id: 'crop-2', name: 'Soja', type: 'Oleaginosa' },
      { id: 'crop-3', name: 'Trigo', type: 'Cereal' },
    ],
  });

  console.log('Creando lotes...');
  await prisma.plot.createMany({
    data: [
      { id: 'plot-1', name: 'Lote A', area: 32.5, farmId: 'farm-1', cropId: 'crop-1' },
      { id: 'plot-2', name: 'Lote B', area: 28.0, farmId: 'farm-1', cropId: 'crop-2' },
      { id: 'plot-3', name: 'Lote C', area: 25.4, farmId: 'farm-2', cropId: 'crop-3' },
    ],
  });

  console.log('Creando sensores...');
  await prisma.sensor.createMany({
    data: [
      { id: 'sensor-1', name: 'Sensor Humedad 01', type: 'Humedad', farmId: 'farm-1', plotId: 'plot-1' },
      { id: 'sensor-2', name: 'Sensor Temp 01', type: 'Temperatura', farmId: 'farm-1', plotId: 'plot-2' },
      { id: 'sensor-3', name: 'Sensor Viento 01', type: 'Viento', farmId: 'farm-2', plotId: 'plot-3' },
      { id: 'sensor-4', name: 'Sensor Lluvia 01', type: 'Precipitacion', farmId: 'farm-1', plotId: null },
    ],
  });

  console.log('Creando lecturas de sensores...');
  const now = new Date();
  await prisma.sensorReading.createMany({
    data: [
      { id: 'reading-1', sensorId: 'sensor-1', value: 41.2, unit: '%', createdAt: new Date(now.getTime() - 7200000) },
      { id: 'reading-2', sensorId: 'sensor-1', value: 38.6, unit: '%', createdAt: now },
      { id: 'reading-3', sensorId: 'sensor-2', value: 25.4, unit: 'C', createdAt: new Date(now.getTime() - 3600000) },
      { id: 'reading-4', sensorId: 'sensor-2', value: 26.1, unit: 'C', createdAt: now },
      { id: 'reading-5', sensorId: 'sensor-3', value: 14.2, unit: 'km/h', createdAt: new Date(now.getTime() - 10800000) },
      { id: 'reading-6', sensorId: 'sensor-1', value: 45.0, unit: '%', createdAt: new Date(now.getTime() - 86400000) },
      { id: 'reading-7', sensorId: 'sensor-1', value: 42.3, unit: '%', createdAt: new Date(now.getTime() - 43200000) },
      { id: 'reading-8', sensorId: 'sensor-2', value: 28.5, unit: 'C', createdAt: new Date(now.getTime() - 86400000) },
      { id: 'reading-9', sensorId: 'sensor-2', value: 22.0, unit: 'C', createdAt: new Date(now.getTime() - 172800000) },
      { id: 'reading-10', sensorId: 'sensor-4', value: 5.2, unit: 'mm', createdAt: new Date(now.getTime() - 21600000) },
    ],
  });

  console.log('Creando eventos de riego...');
  await prisma.irrigationEvent.createMany({
    data: [
      { id: 'irrigation-1', plotId: 'plot-1', duration: 45, waterUsed: 1500, createdAt: new Date(now.getTime() - 86400000) },
      { id: 'irrigation-2', plotId: 'plot-2', duration: 30, waterUsed: 900, createdAt: new Date(now.getTime() - 43200000) },
      { id: 'irrigation-3', plotId: 'plot-1', duration: 60, waterUsed: 2000, createdAt: new Date(now.getTime() - 172800000) },
      { id: 'irrigation-4', plotId: 'plot-3', duration: 35, waterUsed: 1100, createdAt: now },
    ],
  });

  console.log('Creando datos de clima...');
  await prisma.weatherData.createMany({
    data: [
      { id: 'weather-1', temperature: 24.3, humidity: 62.5, precipitation: 0.2, windSpeed: 12.4, createdAt: new Date(now.getTime() - 21600000) },
      { id: 'weather-2', temperature: 26.1, humidity: 58.9, precipitation: 0.0, windSpeed: 9.7, createdAt: new Date(now.getTime() - 7200000) },
      { id: 'weather-3', temperature: 22.5, humidity: 70.2, precipitation: 2.5, windSpeed: 15.3, createdAt: new Date(now.getTime() - 86400000) },
      { id: 'weather-4', temperature: 28.0, humidity: 55.0, precipitation: 0.0, windSpeed: 8.2, createdAt: new Date(now.getTime() - 172800000) },
    ],
  });

  console.log('Creando predicciones...');
  await prisma.prediction.createMany({
    data: [
      { id: 'prediction-1', plotId: 'plot-1', cropYield: 82.4, confidence: 0.78, createdAt: new Date(now.getTime() - 86400000) },
      { id: 'prediction-2', plotId: 'plot-2', cropYield: 88.1, confidence: 0.83, createdAt: new Date(now.getTime() - 28800000) },
      { id: 'prediction-3', plotId: 'plot-3', cropYield: 75.3, confidence: 0.71, createdAt: new Date(now.getTime() - 172800000) },
    ],
  });

  console.log('Creando reportes predefinidos complejos...');
  
  await prisma.report.createMany({
    data: [
      {
        id: 'report-1',
        title: 'Resumen Ejecutivo de Rendimiento',
        type: 'Ejecutivo',
        content: 'Este reporte presenta un analisis completo del rendimiento de cultivos durante el ultimo mes. Se evaluaron 3 lotes principales con un area total de 85.9 hectareas. El analisis incluye metricas de produccion, comparativas historicas y pronosticos de rendimiento basados en datos de sensores y condiciones climaticas.',
        summary: 'Rendimiento general positivo con incremento del 12% respecto al mes anterior. Lote A presenta el mejor desempeño con 82.4% de rendimiento proyectado.',
        metrics: JSON.stringify({
          totalHectareas: 85.9,
          lotesActivos: 3,
          rendimientoPromedio: '78.6%',
          incrementoMensual: '12%',
          consumoAguaPromedio: '1350 L/lote',
          eficienciaRiego: '87%',
        }),
        recommendations: JSON.stringify([
          'Aumentar frecuencia de riego en Lote C durante las proximas 2 semanas',
          'Revisar sensores de humedad en Lote B - lecturas inconsistentes detectadas',
          'Considerar aplicacion de fertilizante nitrogenado en Lote A antes del dia 15',
        ]),
      },
      {
        id: 'report-2',
        title: 'Analisis Detallado de Riego',
        type: 'Riego',
        content: 'Reporte especializado que analiza en profundidad los patrones de consumo de agua, eficiencia de sistemas de irrigacion y recomendaciones de optimizacion. Incluye datos de los ultimos 30 eventos de riego capturados por los sensores de humedad y flujo.',
        summary: 'El consumo total de agua fue de 5500 litros en el periodo analisis. La eficiencia promedio del sistema de riego es del 87%, ligeramente por debajo del objetivo del 90%.',
        metrics: JSON.stringify({
          totalEventosRiego: 4,
          consumoTotalLitros: 5500,
          duracionPromedioMin: 42.5,
          eficienciaSistema: '87%',
          costoEstimadoAgua: '$127.50 USD',
          ahorroPotencial: '15%',
        }),
        recommendations: JSON.stringify([
          'Instalar sensores de flujo adicionales en Lote A para monitoreo preciso',
          'Reducir duracion de riego en Lote B de 45 a 35 minutos - suelo mantiene humedad excesivo',
          'Programar riego automatico para horas de la madrugada (2-4 AM) para minimizar evaporacion',
        ]),
      },
      {
        id: 'report-3',
        title: 'Reporte de Condiciones Climaticas',
        type: 'Clima',
        content: 'Analisis meteorologico completo basado en datos de 4 estaciones de medicion. Se evaluaron variables de temperatura, humedad, precipitacion y velocidad del viento. El reporte incluye proyecciones climaticas a 7 dias y su impacto esperado en las operaciones agricolas.',
        summary: 'Condiciones climaticas favorables para la mayoria de cultivos. Se esperan lluvias moderadas el proximo fin de semana que beneficiaran los lotes con deficit de humedad.',
        metrics: JSON.stringify({
          temperaturaPromedio: '25.2°C',
          humedadRelativa: '61.6%',
          precipitacionTotal: '2.7 mm',
          velocidadVientoPromedio: '11.4 km/h',
          horasSolEstimadas: 8.5,
          indiceUV: '7 (Alto)',
        }),
        recommendations: JSON.stringify([
          'Preparar sistemas de drenaje en Finca El Sol ante posibles lluvias abundantes',
          'Aplicar protecteur solar en cultivos sensibles durante horas pico (10AM-4PM)',
          'Posponer aplicaciones de agroquimicos hasta confirmacion de estabilidad climatica',
        ]),
      },
      {
        id: 'report-4',
        title: 'Estado de Sensores y Equipos IoT',
        type: 'Tecnico',
        content: 'Informe de diagnostico del estado actual de todos los dispositivos IoT conectados al sistema. Incluye inventario de sensores, niveles de bateria, frecuencia de transmision de datos y alertas de mantenimiento preventivo. Total de 4 sensores activos monitoreando diferentes variables ambientales.',
        summary: 'Estado general: OPERATIVO. 4 de 4 sensores funcionando correctamente. Baterias en niveles aceptables (promedio 78%). No se detectaron anomalias en la transmision de datos.',
        metrics: JSON.stringify({
          sensoresTotales: 4,
          sensoresActivos: 4,
          sensoresInactivos: 0,
          bateriaPromedio: '78%',
          tiempoActivoPromedio: '99.2%',
          datosTransmitidos: 2847,
          alertasPendientes: 0,
        }),
        recommendations: JSON.stringify([
          'Reemplazar baterias del Sensor Viento 01 en proximas 2 semanas (nivel actual 45%)',
          'Actualizar firmware del Sensor Humedad 01 - version 2.1.3 disponible',
          'Realizar calibracion anual de Sensor Temp 01 programarla para proximo mes',
        ]),
      },
      {
        id: 'report-5',
        title: 'Proyeccion de Cosecha y Rendimiento',
        type: 'Proyeccion',
        content: 'Reporte predictivo generado por modelos de machine learning que analizan datos historicos, condiciones climaticas actuales y metricas de sensores para proyectar el rendimiento de cosecha. Incluye 3 escenarios (optimista, base y conservador) con intervalos de confianza.',
        summary: 'Proyeccion base: 81.9% de rendimiento esperado con confianza del 77%. Escenario conservador indica 75.3% en condiciones adversas. Escenario optimista alcanza 88.5% si se mantienen condiciones optimas.',
        metrics: JSON.stringify({
          rendimientoProyectado: '81.9%',
          confianzaModelo: '77%',
          escenarioOptimista: '88.5%',
          escenarioConservador: '75.3%',
          fechaCosechaEstimada: '15-20 dias',
          produccionEstimadaTons: 42.5,
          margenError: '+/- 5.2%',
        }),
        recommendations: JSON.stringify([
          'Mantener monitoreo intensivo de sensores durante proximas 2 semanas para ajuste de predicciones',
          'Preparar almacenamiento para produccion estimada de 40-45 toneladas',
          'Consultar con especialistas en caso de desviaciones mayores al 10% de las proyecciones',
        ]),
      },
    ],
  });

  console.log('Seed completado!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });