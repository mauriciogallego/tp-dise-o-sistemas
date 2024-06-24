import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReqStrategy } from '@src/interfaces/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: ReqStrategy) {
    const { email, password } = req.body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'INVALID_EMAIL_PASSWORD',
      });
    }
    await this.authService.throwIfUserIsNotValid(user);
    return user;
  }
}
