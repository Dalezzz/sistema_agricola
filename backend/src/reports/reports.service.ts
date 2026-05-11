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

    const pdfBody = this.buildStyledPdf(report);

    return {
      reportId: report.id,
      fileName: `${this.slugify(report.title)}.pdf`,
      mimeType: 'application/pdf',
      base64: Buffer.from(pdfBody, 'utf8').toString('base64'),
    };
  }

  private buildStyledPdf(report: any) {
    const title = this.escapePdfText(report.title);
    const content = this.escapePdfText(report.content);
    const summary = report.summary ? this.escapePdfText(report.summary) : '';
    const type = this.escapePdfText(report.type || 'General');
    const date = new Date(report.createdAt).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const generatedAt = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const metrics = report.metrics ? this.parseMetricsJson(report.metrics) : [];
    const recommendations = report.recommendations ? this.parseRecommendationsJson(report.recommendations) : [];

    const primaryGreen = '0.2 0.6 0.3';
    const darkGreen = '0.1 0.4 0.2';
    const lightGray = '0.95 0.95 0.95';
    const textGray = '0.3 0.3 0.3';
    const blueAccent = '0.2 0.4 0.7';
    const amberBg = '0.98 0.95 0.85';
    const amberAccent = '0.8 0.5 0.1';

    let yPos = 640;
    const leftMargin = 50;
    const contentWidth = 512;

    const lines: string[] = [];

    lines.push(`BT /F3 11 Tf ${textGray} rg ${leftMargin} ${yPos} Td (${content}) Tj ET`);
    yPos -= 25;

    if (summary) {
      lines.push(`q ${amberBg} rg ${leftMargin} ${yPos - 50} ${contentWidth} 55 re f Q`);
      lines.push(`q ${amberAccent} rg ${leftMargin} ${yPos - 50} 4 55 re f Q`);
      lines.push(`BT /F2 12 Tf ${darkGreen} rg ${leftMargin + 15} ${yPos - 20} Td (RESUMEN EJECUTIVO) Tj ET`);
      lines.push(`BT /F3 10 Tf 0 0 0 rg ${leftMargin + 15} ${yPos - 38} Td (${this.truncateText(summary, 80)}) Tj ET`);
      yPos -= 70;
    }

    if (metrics.length > 0) {
      lines.push(`BT /F1 14 Tf ${darkGreen} rg ${leftMargin} ${yPos} Td (METRICAS CLAVE) Tj ET`);
      yPos -= 25;
      
      const colWidth = contentWidth / 3;
      metrics.forEach((metric: { key: string; value: string }, idx: number) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const xPos = leftMargin + (col * colWidth);
        const yMetric = yPos - (row * 45);
        
        lines.push(`q ${lightGray} rg ${xPos} ${yMetric - 40} ${colWidth - 10} 42 re f Q`);
        lines.push(`q ${primaryGreen} rg ${xPos} ${yMetric - 40} ${colWidth - 10} 3 re f Q`);
        lines.push(`BT /F3 8 Tf ${textGray} rg ${xPos + 8} ${yMetric - 15} Td (${metric.key}) Tj ET`);
        lines.push(`BT /F1 14 Tf ${darkGreen} rg ${xPos + 8} ${yMetric - 32} Td (${metric.value}) Tj ET`);
      });
      
      yPos -= (Math.ceil(metrics.length / 3) * 45) + 20;
    }

    if (recommendations.length > 0) {
      if (yPos < 200) {
        lines.push('Q');
        lines.push('endstream endobj');
        const streamLength = lines.join('\n').length;
        return this.buildPdfHeader(streamLength, lines, generatedAt);
      }
      
      lines.push(`BT /F1 14 Tf ${darkGreen} rg ${leftMargin} ${yPos} Td (RECOMENDACIONES) Tj ET`);
      yPos -= 25;
      
      recommendations.forEach((rec: string, idx: number) => {
        lines.push(`BT /F3 10 Tf 0 0 0 rg ${leftMargin + 15} ${yPos} Td (  ${idx + 1}. ${this.truncateText(rec, 75)}) Tj ET`);
        yPos -= 18;
      });
    }

    const streamContent = lines.join('\n');
    return this.buildPdfHeader(streamContent.length, lines, generatedAt);
  }

  private buildPdfHeader(streamLength: number, lines: string[], generatedAt: string) {
    const primaryGreen = '0.2 0.6 0.3';
    const darkGreen = '0.1 0.4 0.2';
    const textGray = '0.3 0.3 0.3';

    const header = [
      '%PDF-1.4',
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 6 0 R /F2 7 0 R /F3 8 0 R >> >> >> endobj',
      `4 0 obj << /Length ${streamLength} >> stream`,
    ];

    const footer = [
      'endstream endobj',
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
      '7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
      '8 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      'xref',
      '0 9',
      '0000000000 65535 f ',
      'trailer << /Root 1 0 R /Size 9 >>',
      'startxref',
      '0',
      '%%EOF',
    ];

    return [
      '%PDF-1.4',
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 6 0 R /F2 7 0 R /F3 8 0 R >> >> >> endobj',
      '4 0 obj << /Length ' + streamLength + ' >> stream',
      'q 1 1 1 rg 0 0 612 792 re f Q',
      `q ${primaryGreen} rg 0 720 612 72 re f Q`,
      `q 1 1 1 rg 52 747 21 21 re f Q`,
      `BT /F1 24 Tf 1 1 1 rg 90 750 Td (Sistema Agricola) Tj ET`,
      `BT /F3 11 Tf 1 1 1 rg 90 735 Td (Gestion Inteligente de Cultivos) Tj ET`,
      `BT /F1 14 Tf 1 1 1 rg 450 745 Td (SISTEMA AGRICOLA) Tj ET`,
      lines.join('\n'),
      'Q',
      'endstream endobj',
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
      '7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
      '8 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      'xref',
      '0 9',
      '0000000000 65535 f ',
      'trailer << /Root 1 0 R /Size 9 >>',
      'startxref',
      '0',
      '%%EOF',
    ].join('\n');
  }

  private parseMetricsJson(jsonStr: string): Array<{ key: string; value: string }> {
    try {
      const data = JSON.parse(jsonStr);
      return Object.entries(data).map(([key, value]) => ({
        key: this.formatKey(key),
        value: String(value),
      }));
    } catch {
      return [];
    }
  }

  private parseRecommendationsJson(jsonStr: string): string[] {
    try {
      const data = JSON.parse(jsonStr);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private escapePdfText(value: string) {
    if (!value) return '';
    
    const charMap: Record<string, string> = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
      'ñ': 'n', 'Ñ': 'N',
      'ü': 'u', 'Ü': 'U',
      '¿': '?', '¡': '!',
    };
    
    let normalized = value.normalize('NFD');
    
    for (const [char, replacement] of Object.entries(charMap)) {
      normalized = normalized.replace(new RegExp(char, 'g'), replacement);
    }
    
    normalized = normalized.replace(/[\u0300-\u036f]/g, '');
    
    return normalized
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
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