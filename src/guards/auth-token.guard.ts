import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
import jwtConfig from 'src/auth/config/jwt.config';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Não logado!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      console.log('erro');
      throw new UnauthorizedException('Falha ao logar!');
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return;
    }

    return authorization.split(' ')[1];
  }
}
