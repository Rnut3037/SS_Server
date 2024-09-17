import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: { username: string, password: string, adress : string , adress_detail : string}): string {
    return this.authService.register(body.username, body.password, body.adress, body.adress_detail);
  }

  @Post('login')
  login(@Body() body: { username: string; password: string }): string {
    return this.authService.login(body.username, body.password);
  }
}