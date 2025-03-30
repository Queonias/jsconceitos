import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RecadosController],
  providers: [RecadosService],
})
export class RecadosModule {}
