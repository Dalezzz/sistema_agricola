export class CreateReportDto {
  title!: string;
  content!: string;
  type!: 'monthly' | 'quarterly' | 'annual' | 'special';
}

export class UpdateReportDto {
  title?: string;
  content?: string;
}
