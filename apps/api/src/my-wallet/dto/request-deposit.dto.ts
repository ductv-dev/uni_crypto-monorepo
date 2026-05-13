import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestDepositDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  network!: string;

  @IsString()
  @IsNotEmpty()
  tx_hash!: string;

  @IsString()
  @IsNotEmpty()
  from_address!: string;
}
