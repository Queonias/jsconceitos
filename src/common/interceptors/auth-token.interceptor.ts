import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTohenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token || token !== 'valid-token') {
      // You can replace 'valid-token' with your actual token validation logic
      // For example, you might want to check against a database or a secret key
      // If the token is invalid, throw an UnauthorizedException
      throw new UnauthorizedException('Token not provided');
    }
    return next.handle();
  }
}
