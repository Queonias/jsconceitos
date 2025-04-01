import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

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

  findAll() {
    return `This action returns all pessoas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pessoa`;
  }

  update(id: number, updatePessoaDto: UpdatePessoaDto) {
    return `This action updates a #${id} pessoa`;
  }

  remove(id: number) {
    return `This action removes a #${id} pessoa`;
  }
}
