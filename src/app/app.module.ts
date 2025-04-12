import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceitosManualModule } from 'src/conceitos-manual/conceitos-manual.module';
import { ConceitosAutomaticoModule } from 'src/conceitos-automatico/conceitos-automatico.module';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { MyExceptionFilter } from 'src/common/filters/my-exception.filter';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { OutroMiddleware } from 'src/common/middlewares/outro.middleware';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env',
      // envFilePath: ['env/.env'],
      // ignoreEnvFile: true
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mssql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Carrega automaticamente as entidades
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza o banco de dados com as entidades - Não usar em produção
    }),
    RecadosModule,
    PessoasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: MyExceptionFilter,
    },
    // {
    //   provide: 'APP_GUARD',
    //   useClass: IsAdminGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: 'recados',
      method: RequestMethod.ALL,
    });
    consumer.apply(OutroMiddleware).forRoutes({
      path: 'recados/*',
      method: RequestMethod.ALL,
    });
  }
}
