import { IsOptional, IsString } from 'class-validator';

export class AuthLogoutDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
