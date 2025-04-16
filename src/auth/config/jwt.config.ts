import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.TWT_TOKEN_ISSUER,
    jwtTtl: Number(process.env.JWT_TLL ?? 3600),
  };
});
