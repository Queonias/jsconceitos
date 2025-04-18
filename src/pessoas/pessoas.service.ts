import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(createPessoaDto.password);
      const pessoaData = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash,
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

  async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayloadParam: TokenPayloadDto) {
    const dadosPessoa = {
      nome: updatePessoaDto.nome,
    };

    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(updatePessoaDto.password);
      dadosPessoa['passwordHash'] = passwordHash;
    }
    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
    });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (pessoa.id !== tokenPayloadParam.sub) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }
    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayloadParam: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    if (pessoa.id !== tokenPayloadParam.sub) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }

    return this.pessoaRepository.remove(pessoa);
  }
}
