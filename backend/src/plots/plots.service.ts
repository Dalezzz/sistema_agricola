import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PlotsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.plot.create({
      data,
    });
  }

  async findAll(farmId?: string) {
    return this.prisma.plot.findMany({
      where: farmId ? { farmId } : undefined,
      include: { crop: true, sensors: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.plot.findUnique({
      where: { id },
      include: { crop: true, sensors: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.plot.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.plot.delete({
      where: { id },
    });
  }
}
