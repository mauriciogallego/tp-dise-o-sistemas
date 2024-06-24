import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './entities/login.entity';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<Login> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async updatePartnerToken(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
