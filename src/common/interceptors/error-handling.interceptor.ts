import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        console.log('Interceptando erro', error);
        if (error.name === 'NotFoundException') {
          return new BadRequestException(error.message);
        }
        return error;
      }),
    );
  }
}
