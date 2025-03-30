import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Recado 1',
      de: 'João',
      para: 'Maria',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    const recado = this.recados.find((recado) => recado.id === Number(id));
    if (recado) return recado;

    this.throwNotFoundError();
  }

  create(createRecadoDto: CreateRecadoDto) {
    this.lastId++;
    const id = this.lastId;
    const novoRecado = {
      id,
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };
    this.recados.push(novoRecado);
    return novoRecado;
  }

  update(id: string, updateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex((item) => item.id === +id);
    if (recadoExistenteIndex < 0) return this.throwNotFoundError();
    if (recadoExistenteIndex >= 0) {
      const recadoExistenteIndex = this.recados.findIndex((item) => item.id === +id);
      this.recados[recadoExistenteIndex] = {
        ...this.recados[recadoExistenteIndex],
        ...updateRecadoDto,
      };
    }
    return this.recados[recadoExistenteIndex];
  }

  remove(id: string) {
    const recadoExistenteIndex = this.recados.findIndex((item) => item.id === +id);
    if (recadoExistenteIndex < 0) return this.throwNotFoundError();
    if (recadoExistenteIndex >= 0) {
      const recado = this.recados[recadoExistenteIndex];
      this.recados.splice(recadoExistenteIndex, 1);
      return recado;
    }
  }
}
