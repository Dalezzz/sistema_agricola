import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.weatherData.create({
      data,
    });
  }

  async findAll(limit = 50) {
    return this.prisma.weatherData.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findOne(id: string) {
    return this.prisma.weatherData.findUnique({
      where: { id },
    });
  }

  async findLatest() {
    return this.prisma.weatherData.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.weatherData.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.weatherData.delete({
      where: { id },
    });
  }
}
