export class CreateFarmDto {
  name!: string;
  location!: string;
  area!: number;
}

export class UpdateFarmDto {
  name?: string;
  location?: string;
  area?: number;
}
