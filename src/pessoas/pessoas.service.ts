import { ConflictException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class PessoasService {
  private count = 0;
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {
    this.count++;
    console.log(`PessoasService foi iniciado ${this.count}`);
  }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const pessoaData = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash: createPessoaDto.password,
      };
      const pessoa = this.pessoaRepository.create(pessoaData);
      await this.pessoaRepository.save(pessoa);
      return pessoa;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    const pessoa = await this.pessoaRepository.find({
      order: {
        nome: 'desc',
      },
    });
    return pessoa;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const dadosPessoa = {
      nome: updatePessoaDto.nome,
      passwordHash: updatePessoaDto.password,
    };
    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
    });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (pessoa) {
      return this.pessoaRepository.remove(pessoa);
    }
    throw new NotFoundException('Pessoa não encontrada');
  }
}
