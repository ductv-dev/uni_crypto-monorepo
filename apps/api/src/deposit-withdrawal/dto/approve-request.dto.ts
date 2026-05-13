import { IsOptional, IsString } from 'class-validator';

export class ApproveRequestDto {
  @IsString()
  @IsOptional()
  tx_hash?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
