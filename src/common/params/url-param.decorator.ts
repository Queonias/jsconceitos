import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UrlParam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.url;
});
