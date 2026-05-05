import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLogoutDto {
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
