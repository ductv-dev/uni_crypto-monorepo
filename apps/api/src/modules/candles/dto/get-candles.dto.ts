import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { CandleInterval } from '../enums/candle-interval.enum';

export class GetCandlesDto {
  @IsEnum(CandleInterval)
  interval!: CandleInterval;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return 500;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  })
  limit: number = 500;
}
