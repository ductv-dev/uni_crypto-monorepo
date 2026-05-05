import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import xss from 'xss';

const sanitizeText = (value: unknown) =>
  typeof value === 'string' ? xss(value.trim()) : '';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => sanitizeText(value))
  email!: string;
}
