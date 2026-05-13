import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMyWalletDto {
  @IsString()
  @IsNotEmpty()
  asset_id!: string;
}
