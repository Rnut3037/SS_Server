// auth.controller.ts
import { Body, Controller, Get, Post, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string, password: string, adress: string, adress_detail: string }): Promise<string> {
    return await this.authService.register(body.username, body.password, body.adress, body.adress_detail);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }): Promise<{ accessToken: string }> {
    return await this.authService.login(body.username, body.password);
  }

  @Get("coin")
  async getCoin(@Headers('authorization') authHeader: string):Promise<string>{
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization 헤더가 필요합니다.');
  }
  const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형식에서 토큰 부분 추출
  try {
    const leftCoin = await this.authService.getCoins(token)
    return `coin left : ${leftCoin}`
  }
  catch {
    return "Cannot find user"
  }
  }
}
