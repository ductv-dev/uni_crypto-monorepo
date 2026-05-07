import { IsBoolean, IsEmail, IsIn, IsNotEmpty, Matches } from 'class-validator';
import {
  type AuthAccountType,
  AUTH_ACCOUNT_TYPES,
} from '../../auth/constants/auth.constants';

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'password must contain at least one uppercase character, a lowercase character, a digit, and a special character.',
  })
  password!: string;
  @IsNotEmpty()
  @IsIn(AUTH_ACCOUNT_TYPES)
  type!: AuthAccountType;

  @IsNotEmpty()
  @IsBoolean()
  is_super_admin!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  is_active!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  is_blocked!: boolean;

  @IsNotEmpty()
  id_role!: string;
}
