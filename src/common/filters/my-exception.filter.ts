import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(BadRequestException)
export class MyExceptionFilter<T extends BadRequestException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof response === 'string'
        ? {
            message: exceptionResponse,
          }
        : (exceptionResponse as object);

    response.status(404).json({
      ...error,
      data: new Date().toISOString(),
      path: request.url,
    });
  }
}
