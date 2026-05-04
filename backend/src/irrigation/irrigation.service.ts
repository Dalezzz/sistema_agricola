import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class IrrigationService {
  constructor(private prisma: PrismaService) {}

  async recordEvent(plotId: string, duration: number, waterUsed: number) {
    return this.prisma.irrigationEvent.create({
      data: {
        plotId,
        duration,
        waterUsed,
      },
    });
  }

  async getEventsByPlot(plotId: string) {
    return this.prisma.irrigationEvent.findMany({
      where: { plotId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(limit = 100) {
    return this.prisma.irrigationEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findOne(id: string) {
    return this.prisma.irrigationEvent.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.irrigationEvent.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.irrigationEvent.delete({
      where: { id },
    });
  }

  async calculateTotalWaterUsage(plotId: string, startDate: Date, endDate: Date) {
    const events = await this.prisma.irrigationEvent.findMany({
      where: {
        plotId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return events.reduce(
      (sum: number, event: { waterUsed: number }) => sum + event.waterUsed,
      0,
    );
  }
}
