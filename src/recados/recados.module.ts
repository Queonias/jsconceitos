import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';

@Module({
  imports: [TypeOrmModule.forFeature([Recado]), forwardRef(() => PessoasModule)],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, //Token para injeção de dependência
      // useValue: new RecadosUtilsMock(), // Mock
      useClass: RecadosUtils, // Classe real
    },
    {
      provide: SERVER_NAME,
      useValue: 'My Name Is NestJS',
    },
  ],
  exports: [
    SERVER_NAME,
    {
      provide: RecadosUtils,
      useClass: RecadosUtils,
    },
  ],
})
export class RecadosModule {}
