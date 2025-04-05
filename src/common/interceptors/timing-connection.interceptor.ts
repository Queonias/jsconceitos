import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { response } from 'express';
import { Observable, tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    console.log('TimingConnectionInterceptor executado ANTES');
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`TimingConnectionInterceptor: levou ${duration}ms para executar.`);
      }),
    );
  }
}
