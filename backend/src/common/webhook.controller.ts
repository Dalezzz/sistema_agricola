import { Body, Controller, Post } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { SensorsService } from '../sensors/sensors.service';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private weatherService: WeatherService,
    private sensorsService: SensorsService,
  ) {}

  @Post('climate')
  async handleClimateWebhook(@Body() data: any) {
    const payload = this.normalizeClimatePayload(data);
    if (payload) {
      await this.weatherService.create(payload);
    }

    return { status: 'success' };
  }

  @Post('sensor')
  async handleSensorWebhook(@Body() data: any) {
    const payload = this.normalizeSensorPayload(data);
    if (payload) {
      await this.sensorsService.addReading(payload.sensorId, payload.value, payload.unit);
    }

    return { status: 'success' };
  }

  @Post('n8n')
  handleN8nWebhook(@Body() data: any) {
    console.log('N8n webhook received:', data);
    return { status: 'success' };
  }

  private normalizeClimatePayload(data: any) {
    const temperature = Number(data?.temperature ?? data?.temp ?? data?.t);
    const humidity = Number(data?.humidity ?? data?.hum ?? data?.h);
    const precipitation = Number(data?.precipitation ?? data?.rain ?? 0);
    const windSpeed = Number(data?.windSpeed ?? data?.wind ?? 0);

    if (!Number.isFinite(temperature) || !Number.isFinite(humidity)) {
      return null;
    }

    return {
      temperature,
      humidity,
      precipitation: Number.isFinite(precipitation) ? precipitation : 0,
      windSpeed: Number.isFinite(windSpeed) ? windSpeed : 0,
    };
  }

  private normalizeSensorPayload(data: any) {
    const sensorId = String(data?.sensorId ?? data?.sensor_id ?? '');
    const value = Number(data?.value ?? data?.reading ?? data?.val);
    const unit = String(data?.unit ?? data?.u ?? '');

    if (!sensorId || !Number.isFinite(value) || !unit) {
      return null;
    }

    return { sensorId, value, unit };
  }
}
