import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { PlotsModule } from './plots/plots.module';
import { CropsModule } from './crops/crops.module';
import { SensorsModule } from './sensors/sensors.module';
import { IrrigationModule } from './irrigation/irrigation.module';
import { PredictionsModule } from './predictions/predictions.module';
import { ReportsModule } from './reports/reports.module';
import { CommonModule } from './common/common.module';
import { WebhookController } from './common/webhook.controller';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    TrpcModule,
    AuthModule,
    UsersModule,
    FarmsModule,
    PlotsModule,
    CropsModule,
    SensorsModule,
    IrrigationModule,
    PredictionsModule,
    ReportsModule,
    WeatherModule,
  ],
  controllers: [WebhookController],
  providers: [],
})
export class AppModule {}
