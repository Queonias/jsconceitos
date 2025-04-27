import { ForbiddenException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import recadosConfig from './recados.config';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { EmailService } from 'src/email/email.service';

// Scope.DEFAULT -> O provider em questão é um singleton
// Scope.REQUEST -> O provider em questão é instanciado a cada requisição
// Scope.TRANSIENT -> É criada uma classe do provider para cada classe que injetar este provider

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    @Inject(recadosConfig.KEY)
    private readonly recadosConfiguration: ConfigType<typeof recadosConfig>,
    private readonly emailService: EmailService,
  ) {
    console.log(recadosConfiguration.teste1);
  }

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const recados = await this.recadoRepository.find({
      take: limit, // quantos registros serão exibidos (por página)
      skip: offset, // quantos registros devem ser pulados
      relations: {
        de: true,
        para: true,
      },
      order: {
        data: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id: id },
      relations: {
        de: true,
        para: true,
      },
      order: {
        data: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    if (recado) return recado;

    this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto) {
    const { paraId } = createRecadoDto;

    const para = await this.pessoasService.findOne(paraId);
    const de = await this.pessoasService.findOne(tokenPayload.sub);

    const novoRecado = {
      texto: createRecadoDto.texto,
      para,
      de,
      lido: false,
      data: new Date(),
    };
    const recado = this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);

    await this.emailService.sendEmail(
      para.email,
      'Novo recado',
      `Você recebeu um novo recado de ${de.nome}: ${createRecadoDto.texto}`,
    );

    return {
      ...recado,
      de: {
        id: de.id,
        nome: recado.de.nome,
      },
      para: {
        id: para.id,
        nome: recado.para.nome,
      },
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if (!recado) return this.throwNotFoundError();

    if (recado.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu');
    }

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);
    if (recado?.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu');
    }

    return this.recadoRepository.remove(recado);
  }
}
