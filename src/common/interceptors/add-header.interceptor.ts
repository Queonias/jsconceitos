import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { response } from 'express';
import { Observable } from 'rxjs';

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Header', 'Hello World');
    return next.handle();
  }
}
