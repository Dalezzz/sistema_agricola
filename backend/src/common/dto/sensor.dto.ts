export class CreateSensorDto {
  name!: string;
  type!: string;
  farmId!: string;
  plotId?: string;
}

export class UpdateSensorDto {
  name?: string;
  plotId?: string;
}
