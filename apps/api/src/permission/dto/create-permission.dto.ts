import { IsString } from 'class-validator';

export class CreatePermissionDTO {
  @IsString()
  permission_code!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;
}
