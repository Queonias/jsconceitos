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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'sqlrecados',
      password: '123456',
      autoLoadEntities: true, // Carrega automaticamente as entidades
      synchronize: true, // Sincroniza o banco de dados com as entidades - Não usar em produção
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: 'recados/*',
      method: RequestMethod.ALL,
    });
    consumer.apply(OutroMiddleware).forRoutes({
      path: 'recados/*',
      method: RequestMethod.ALL,
    });
  }
}
