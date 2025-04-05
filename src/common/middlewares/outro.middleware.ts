// Cliente (Navegador) -> (Servidor) -> Middleware (Resquest, Response) ->
// NestJs (Guards, Interceptors, Pipes, Filters) -> Controller -> Service -> Repository

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class OutroMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Outro middleware');

    // return res.status(404).send({
    //   message: 'Not found',
    // });

    next();
  }
}
