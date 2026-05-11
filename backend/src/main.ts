import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { AuthService } from './auth/auth.service';
import { CropsService } from './crops/crops.service';
import { FarmsService } from './farms/farms.service';
import { IrrigationService } from './irrigation/irrigation.service';
import { PlotsService } from './plots/plots.service';
import { PredictionsService } from './predictions/predictions.service';
import { ReportsService } from './reports/reports.service';
import { SensorsService } from './sensors/sensors.service';
import { UsersService } from './users/users.service';
import { PrismaService } from './common/prisma.service';
import { createContext } from './trpc/context';
import { createAppRouter } from './trpc/root.router';
import { WeatherService } from './weather/weather.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3030',
    credentials: true,
  });

  const appRouter = createAppRouter({
    authService: app.get(AuthService),
    usersService: app.get(UsersService),
    farmsService: app.get(FarmsService),
    plotsService: app.get(PlotsService),
    cropsService: app.get(CropsService),
    sensorsService: app.get(SensorsService),
    irrigationService: app.get(IrrigationService),
    predictionsService: app.get(PredictionsService),
    reportsService: app.get(ReportsService),
    weatherService: app.get(WeatherService),
  });

  app.use(
    '/api/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }) => createContext({ req, res }),
    }),
  );

  void app.get(PrismaService);

  const port = process.env.PORT || 3031;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
