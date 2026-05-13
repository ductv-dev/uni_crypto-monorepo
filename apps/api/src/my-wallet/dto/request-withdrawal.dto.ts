import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestWithdrawalDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  network!: string;

  @IsString()
  @IsNotEmpty()
  to_address!: string;
}
