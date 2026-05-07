import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  last_name!: string;

  @Type(() => Date)
  @IsDate()
  date_of_birth!: Date;
  @IsNotEmpty()
  @Matches(/^(male|female|other)$/i)
  gender!: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  address!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  country!: string;
}
