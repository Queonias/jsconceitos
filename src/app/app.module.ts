import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { MyExceptionFilter } from 'src/common/filters/my-exception.filter';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { OutroMiddleware } from 'src/common/middlewares/outro.middleware';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfigutation: ConfigType<typeof appConfig>) => {
        return {
          type: appConfigutation.database.type,
          host: appConfigutation.database.host,
          port: appConfigutation.database.port,
          username: appConfigutation.database.username,
          database: appConfigutation.database.database,
          password: appConfigutation.database.password,
          autoLoadEntities: appConfigutation.database.autoLoadEntities,
          synchronize: appConfigutation.database.synchronize,
        };
      },
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
