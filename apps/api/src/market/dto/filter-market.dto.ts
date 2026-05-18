import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FilterMarketDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 1;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  })
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 10;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  })
  limit?: number = 10;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  status?: boolean;

  @IsString()
  @IsOptional()
  search?: string;
}
