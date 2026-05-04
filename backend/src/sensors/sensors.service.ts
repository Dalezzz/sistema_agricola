import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.sensor.create({
      data,
    });
  }

  async findAll(farmId?: string) {
    return this.prisma.sensor.findMany({
      where: farmId ? { farmId } : undefined,
      include: { readings: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.sensor.findUnique({
      where: { id },
      include: { readings: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.sensor.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.sensor.delete({
      where: { id },
    });
  }

  async addReading(sensorId: string, value: number, unit: string) {
    return this.prisma.sensorReading.create({
      data: {
        sensorId,
        value,
        unit,
      },
    });
  }

  async getLatestReadings(sensorId: string, limit = 10) {
    return this.prisma.sensorReading.findMany({
      where: { sensorId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
