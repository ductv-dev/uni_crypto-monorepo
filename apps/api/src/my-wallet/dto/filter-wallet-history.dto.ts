import { IsNumberString, IsOptional } from 'class-validator';

export class FilterWalletHistoryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
