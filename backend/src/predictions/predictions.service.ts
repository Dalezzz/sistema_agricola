import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PredictionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.prediction.create({
      data,
    });
  }

  async findByPlot(plotId: string) {
    return this.prisma.prediction.findMany({
      where: { plotId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(limit = 100) {
    return this.prisma.prediction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findOne(id: string) {
    return this.prisma.prediction.findUnique({
      where: { id },
    });
  }

  async getLatest(plotId: string) {
    return this.prisma.prediction.findFirst({
      where: { plotId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.prediction.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.prediction.delete({
      where: { id },
    });
  }
}
