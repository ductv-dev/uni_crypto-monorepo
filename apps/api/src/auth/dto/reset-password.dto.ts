import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import xss from 'xss';

const sanitizeText = (value: unknown) =>
  typeof value === 'string' ? xss(value.trim()) : '';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => sanitizeText(value))
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitizeText(value))
  hash!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'password must contain at least one uppercase character, a lowercase character, a digit, and a special character.',
  })
  @Transform(({ value }) => sanitizeText(value))
  newPassword!: string;
}
