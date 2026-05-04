export class CreateUserDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
}

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
}
