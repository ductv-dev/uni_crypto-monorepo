import { Matches } from 'class-validator';

export class ChangePasswordDto {
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'password must contain at least one uppercase character, a lowercase character, a digit, and a special character.',
  })
  password!: string;
}
