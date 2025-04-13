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
import globalConfig from 'src/global-config/global.config';
import { GlobalConfigModule } from 'src/global-config/global-config.module';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig), GlobalConfigModule],
      inject: [globalConfig.KEY],
      useFactory: async (globalConfigutation: ConfigType<typeof globalConfig>) => {
        return {
          type: globalConfigutation.database.type,
          host: globalConfigutation.database.host,
          port: globalConfigutation.database.port,
          username: globalConfigutation.database.username,
          database: globalConfigutation.database.database,
          password: globalConfigutation.database.password,
          autoLoadEntities: globalConfigutation.database.autoLoadEntities,
          synchronize: globalConfigutation.database.synchronize,
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
