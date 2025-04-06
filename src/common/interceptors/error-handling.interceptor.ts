import {
  ArgumentMetadata,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  PipeTransform,
} from '@nestjs/common';
import e from 'express';
import { catchError, Observable, throwError } from 'rxjs';

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
