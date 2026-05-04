import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';
import type { AuthService } from '../auth/auth.service';
import type { CropsService } from '../crops/crops.service';
import type { FarmsService } from '../farms/farms.service';
import type { IrrigationService } from '../irrigation/irrigation.service';
import type { PlotsService } from '../plots/plots.service';
import type { PredictionsService } from '../predictions/predictions.service';
import type { ReportsService } from '../reports/reports.service';
import type { SensorsService } from '../sensors/sensors.service';
import type { UsersService } from '../users/users.service';
import type { WeatherService } from '../weather/weather.service';

export const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;

// Input schemas
const idSchema = z.object({ id: z.string() });
const emailPasswordSchema = z.object({ email: z.string().email(), password: z.string() });
const userIdSchema = z.object({ userId: z.string() });
const farmIdSchema = z.object({ farmId: z.string() });
const plotIdSchema = z.object({ plotId: z.string() });
const sensorIdSchema = z.object({ sensorId: z.string() });
const sensorReadingSchema = z.object({ sensorId: z.string(), value: z.number(), unit: z.string() });
const irrigationSchema = z.object({ plotId: z.string(), duration: z.number(), waterUsed: z.number() });
const dateRangeSchema = z.object({ plotId: z.string(), startDate: z.string(), endDate: z.string() });
const reportIdSchema = z.object({ reportId: z.string() });
const irrigationIdSchema = z.object({ irrigationId: z.string() });
const predictionIdSchema = z.object({ predictionId: z.string() });
const weatherIdSchema = z.object({ weatherId: z.string() });
const limitSchema = z.object({ limit: z.number().int().min(1).max(200).optional() });

export interface RouterDependencies {
  authService: AuthService;
  usersService: UsersService;
  farmsService: FarmsService;
  plotsService: PlotsService;
  cropsService: CropsService;
  sensorsService: SensorsService;
  irrigationService: IrrigationService;
  predictionsService: PredictionsService;
  reportsService: ReportsService;
  weatherService: WeatherService;
}

export function createAppRouter(deps: RouterDependencies) {
  return t.router({
    health: publicProcedure.query(() => ({ status: 'ok' })),

    auth: t.router({
      login: publicProcedure.input(emailPasswordSchema).mutation(async ({ input }) => {
        const user = await deps.authService.validateUser(input.email, input.password);
        if (!user) {
          return { access_token: null, user: null };
        }
        const token = await deps.authService.login(user);
        return { access_token: token.access_token, user };
      }),
    }),

    users: t.router({
      list: publicProcedure.query(() => deps.usersService.findAll()),
      byId: publicProcedure.input(idSchema).query(({ input }) => deps.usersService.findOne(input.id)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.usersService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.usersService.update(id, data);
      }),
      remove: publicProcedure.input(idSchema).mutation(({ input }) => deps.usersService.remove(input.id)),
    }),

    farms: t.router({
      list: publicProcedure.input(userIdSchema).query(({ input }) => deps.farmsService.findAll(input.userId)),
      listAll: publicProcedure.query(() => deps.farmsService.findAll()),
      byId: publicProcedure.input(idSchema).query(({ input }) => deps.farmsService.findOne(input.id)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.farmsService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.farmsService.update(id, data);
      }),
      remove: publicProcedure.input(idSchema).mutation(({ input }) => deps.farmsService.remove(input.id)),
    }),

    plots: t.router({
      list: publicProcedure.input(farmIdSchema).query(({ input }) => deps.plotsService.findAll(input.farmId)),
      listAll: publicProcedure.query(() => deps.plotsService.findAll()),
      byId: publicProcedure.input(idSchema).query(({ input }) => deps.plotsService.findOne(input.id)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.plotsService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.plotsService.update(id, data);
      }),
      remove: publicProcedure.input(idSchema).mutation(({ input }) => deps.plotsService.remove(input.id)),
    }),

    crops: t.router({
      list: publicProcedure.query(() => deps.cropsService.findAll()),
      byId: publicProcedure.input(idSchema).query(({ input }) => deps.cropsService.findOne(input.id)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.cropsService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.cropsService.update(id, data);
      }),
      remove: publicProcedure.input(idSchema).mutation(({ input }) => deps.cropsService.remove(input.id)),
    }),

    sensors: t.router({
      list: publicProcedure.input(farmIdSchema).query(({ input }) => deps.sensorsService.findAll(input.farmId)),
      listAll: publicProcedure.query(() => deps.sensorsService.findAll()),
      byId: publicProcedure.input(idSchema).query(({ input }) => deps.sensorsService.findOne(input.id)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.sensorsService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.sensorsService.update(id, data);
      }),
      remove: publicProcedure.input(idSchema).mutation(({ input }) => deps.sensorsService.remove(input.id)),
      addReading: publicProcedure.input(sensorReadingSchema).mutation(({ input }) => {
        return deps.sensorsService.addReading(input.sensorId, input.value, input.unit);
      }),
      readings: publicProcedure.input(sensorIdSchema).query(({ input }) => deps.sensorsService.getLatestReadings(input.sensorId)),
    }),

    irrigation: t.router({
      record: publicProcedure.input(irrigationSchema).mutation(({ input }) => {
        return deps.irrigationService.recordEvent(input.plotId, input.duration, input.waterUsed);
      }),
      list: publicProcedure.input(plotIdSchema).query(({ input }) => deps.irrigationService.getEventsByPlot(input.plotId)),
      listAll: publicProcedure.input(limitSchema.optional()).query(({ input }) => deps.irrigationService.findAll(input?.limit)),
      byId: publicProcedure.input(irrigationIdSchema).query(({ input }) => deps.irrigationService.findOne(input.irrigationId)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.irrigationService.update(id, data);
      }),
      remove: publicProcedure.input(irrigationIdSchema).mutation(({ input }) => deps.irrigationService.remove(input.irrigationId)),
      totalWaterUsage: publicProcedure.input(dateRangeSchema).query(({ input }) => {
        return deps.irrigationService.calculateTotalWaterUsage(input.plotId, new Date(input.startDate), new Date(input.endDate));
      }),
    }),

    predictions: t.router({
      listByPlot: publicProcedure.input(plotIdSchema).query(({ input }) => deps.predictionsService.findByPlot(input.plotId)),
      list: publicProcedure.input(limitSchema.optional()).query(({ input }) => deps.predictionsService.findAll(input?.limit)),
      latest: publicProcedure.input(plotIdSchema).query(({ input }) => deps.predictionsService.getLatest(input.plotId)),
      byId: publicProcedure.input(predictionIdSchema).query(({ input }) => deps.predictionsService.findOne(input.predictionId)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.predictionsService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.predictionsService.update(id, data);
      }),
      remove: publicProcedure.input(predictionIdSchema).mutation(({ input }) => deps.predictionsService.remove(input.predictionId)),
    }),

    reports: t.router({
      list: publicProcedure.query(() => deps.reportsService.findAll()),
      byId: publicProcedure.input(idSchema).query(({ input }) => deps.reportsService.findOne(input.id)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.reportsService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.reportsService.update(id, data);
      }),
      remove: publicProcedure.input(idSchema).mutation(({ input }) => deps.reportsService.remove(input.id)),
      generatePdf: publicProcedure.input(reportIdSchema).query(({ input }) => deps.reportsService.generatePDF(input.reportId)),
    }),

    weather: t.router({
      list: publicProcedure.input(limitSchema.optional()).query(({ input }) => deps.weatherService.findAll(input?.limit)),
      latest: publicProcedure.query(() => deps.weatherService.findLatest()),
      byId: publicProcedure.input(weatherIdSchema).query(({ input }) => deps.weatherService.findOne(input.weatherId)),
      create: publicProcedure.input(z.any()).mutation(({ input }) => deps.weatherService.create(input)),
      update: publicProcedure.input(z.any()).mutation(({ input }) => {
        const { id, ...data } = input;
        return deps.weatherService.update(id, data);
      }),
      remove: publicProcedure.input(weatherIdSchema).mutation(({ input }) => deps.weatherService.remove(input.weatherId)),
    }),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
