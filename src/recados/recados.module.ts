import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { RecadosUtils } from './recados.utils';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [TypeOrmModule.forFeature([Recado]), forwardRef(() => PessoasModule), ConfigModule],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosUtils],
  exports: [RecadosUtils],
})
export class RecadosModule {}
