import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuditLog {
  @IsNotEmpty()
  @IsString()
  user_id!: string;

  @IsNotEmpty()
  @IsString()
  action!: string;

  @IsNotEmpty()
  @IsString()
  table_name!: string;

  @IsNotEmpty()
  @IsString()
  record_id!: string;

  @IsNotEmpty()
  @IsString()
  changes!: string;

  @IsNotEmpty()
  @IsString()
  ip_address!: string;
}
