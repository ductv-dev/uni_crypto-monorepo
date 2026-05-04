import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/signin.dtu';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthSigninDto) {
    return this.authService.signin(dto);
  }

  // @Post('register')
  // register() {
  //   return this.authService.register();
  // }
}
