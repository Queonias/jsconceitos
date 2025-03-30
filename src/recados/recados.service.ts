import { Injectable } from '@nestjs/common';
import { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Recado 1',
      de: 'João',
      lido: false,
      data: new Date(),
    },
  ];

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    return this.recados.find((recado) => recado.id === Number(id));
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const novoRecado = {
      id,
      ...body,
    };
    this.recados.push(novoRecado);
    return novoRecado;
  }

  update(id: string, body: any) {
    const recadoExistenteIndex = this.recados.findIndex((item) => item.id === +id);
    if (recadoExistenteIndex >= 0) {
      const recadoExistenteIndex = this.recados.findIndex((item) => item.id === +id);
      this.recados[recadoExistenteIndex] = {
        ...this.recados[recadoExistenteIndex],
        ...body,
      };
    }
  }

  remove(id: string) {
    const recadoExistenteIndex = this.recados.findIndex((item) => item.id === +id);

    if (recadoExistenteIndex >= 0) {
      this.recados.splice(recadoExistenteIndex, 1);
    }
  }
}
