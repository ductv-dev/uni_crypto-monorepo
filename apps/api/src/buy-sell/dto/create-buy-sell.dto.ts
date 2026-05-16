import { OrderBookSide, OrderBookType } from '@workspace/db';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBuyDto {
  @IsString()
  @IsNotEmpty()
  market_id: string;

  @IsEnum(OrderBookType)
  @IsNotEmpty()
  type: OrderBookType;

  @IsEnum(OrderBookSide)
  @IsNotEmpty()
  side: OrderBookSide;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}
