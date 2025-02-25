import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { RegisterDto } from '../users/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log({ registerDto });
    return this.authService.register(registerDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return req.user;
  }
}
