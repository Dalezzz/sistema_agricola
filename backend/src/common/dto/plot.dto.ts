export class CreatePlotDto {
  name!: string;
  farmId!: string;
  area!: number;
  cropId?: string;
}

export class UpdatePlotDto {
  name?: string;
  area?: number;
  cropId?: string;
}
