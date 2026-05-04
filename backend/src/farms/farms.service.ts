import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.farm.create({
      data,
    });
  }

  async findAll(userId?: string) {
    return this.prisma.farm.findMany({
      where: userId ? { ownerId: userId } : undefined,
      include: { plots: true, sensors: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.farm.findUnique({
      where: { id },
      include: { plots: true, sensors: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.farm.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.farm.delete({
      where: { id },
    });
  }
}
