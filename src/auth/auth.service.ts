import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { IAccessToken } from '../interfaces/types';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { Usuario } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    readonly prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      if (await compare(pass, user.password)) {
        const result = omit(user, 'password');
        return result;
      }
    }
    return null;
  }

  validateSecurityPassword(password: string) {
    const regEx =
      /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;

    if (!regEx.test(password)) {
      throw new UnprocessableEntityException('WEAK_PASSWORD');
    }
  }

  async login(user?: Usuario): Promise<IAccessToken> {
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'AUTHORIZATION_REQUIRED',
      });
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  throwIfUserIsNotValid(user: Omit<Usuario, 'password'>) {
    if (user.active === false) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'NOT_ACTIVE_USER',
      });
    }
    return Promise.resolve(user);
  }

  async register(body: RegisterDto) {
    this.validateSecurityPassword(body.password);

    const password = this.hashPassword(body.password);

    return await this.prisma.usuario.create({
      data: {
        email: body.email,
        username: body.username,
        password,
      },
    });
  }
}
