import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';
// import { MyExceptionFilter } from './common/filters/my-exception.filter';
// import { IsAdminGuard } from './common/guards/is-admin.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // retorna erro se chaves não estão no DTO
      transform: false, // transforma o objeto em uma instância da classe DTO
    }),
    new ParseIntIdPipe(),
  );

  // app.useGlobalGuards(new IsAdminGuard)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
