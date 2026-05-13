import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateWalletDto {
  @IsBoolean()
  @IsNotEmpty()
  status!: boolean;
}
