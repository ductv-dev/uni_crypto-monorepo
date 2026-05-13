import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMarketDto {
  @IsString()
  @IsNotEmpty()
  symbol!: string;

  @IsString()
  @IsNotEmpty()
  base_asset_id!: string;

  @IsString()
  @IsNotEmpty()
  quote_asset_id!: string;

  @IsNumber()
  @Min(0)
  min_order_amount!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  max_order_amount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min_order_value?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price_precision?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity_precision?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
