/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@src/auth/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (token) {
        const payload = await this.jwtService.verifyAsync(token);
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = {
          ...payload,
          id: payload.sub,
        };
      }
      return true;
    }
    return super.canActivate(context) as boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err, user, info) {
    // validate token here if it's needed
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'AUTHORIZATION_REQUIRED',
        })
      );
    }
    return user;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    // @ts-ignore
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
