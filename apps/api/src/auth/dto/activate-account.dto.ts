import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ActivateAccountDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsNotEmpty({ message: 'Hash kích hoạt không được để trống' })
  @IsString()
  hash!: string;
}
