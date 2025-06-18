import { IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @Matches(/^[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain only letters, numbers, and allowed special characters (@$!%*?&)',
  })
  password: string;
}
