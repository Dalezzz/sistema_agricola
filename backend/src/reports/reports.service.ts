import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.report.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.report.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.report.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.report.delete({
      where: { id },
    });
  }

  async generatePDF(reportId: string) {
    const report = await this.findOne(reportId);

    if (!report) {
      throw new NotFoundException(`Reporte ${reportId} no encontrado`);
    }

    const pdfBody = this.buildMinimalPdf(report.title, report.content);

    return {
      reportId: report.id,
      fileName: `${this.slugify(report.title)}.pdf`,
      mimeType: 'application/pdf',
      base64: Buffer.from(pdfBody, 'utf8').toString('base64'),
    };
  }

  private buildMinimalPdf(title: string, content: string) {
    const escapedTitle = this.escapePdfText(title);
    const escapedContent = this.escapePdfText(content);
    const textLines = `${escapedTitle}\n\n${escapedContent}`;

    return [
      '%PDF-1.4',
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
      `4 0 obj << /Length ${textLines.length + 82} >> stream`,
      'BT /F1 18 Tf 50 740 Td (Sistema Agrícola) Tj ET',
      `BT /F1 12 Tf 50 710 Td (${escapedTitle}) Tj ET`,
      `BT /F1 11 Tf 50 685 Td (${escapedContent}) Tj ET`,
      'endstream endobj',
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      'xref',
      '0 6',
      '0000000000 65535 f ',
      'trailer << /Root 1 0 R /Size 6 >>',
      'startxref',
      '0',
      '%%EOF',
    ].join('\n');
  }

  private escapePdfText(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
