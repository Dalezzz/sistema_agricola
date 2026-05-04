import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CropsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.crop.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.crop.findMany({
      include: { plots: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.crop.findUnique({
      where: { id },
      include: { plots: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.crop.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.crop.delete({
      where: { id },
    });
  }
}
