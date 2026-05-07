import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name!: string;
  @IsString()
  description!: string;
  @IsNumber()
  @Min(2)
  @Max(10)
  level!: number;

  @IsBoolean()
  status!: boolean;
}
