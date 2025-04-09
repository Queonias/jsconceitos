import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { ReqDataParam } from 'src/common/params/req-data-param.decorator';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { In } from 'typeorm';
import { ONLY_LOWERCASE_LETTERS_REGEX, REMOVE_SPACES_REGEX } from './recados.constant';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';

// CRUD - Create, Read, Update, Delete
// Create - POST -> Criar
// Read - GET -> Ler
// Read - GET -> Ler apenas um
// Delete - DELETE -> Deletar
// Update - PATCH/PUT -> Atualizar

// PATCH - Atualiza apenas uma parte do recurso
// PUT - Atualiza o recurso inteiro

// DTO - Data Transfer Object -> Objeto de Transferência de Dados
// DTO - Objeto simples -> validar dados / Transformar dados

@UseGuards(IsAdminGuard)
@Controller('recados')
@UseInterceptors(TimingConnectionInterceptor)
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RemoveSpacesRegex,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseLettersRegex: OnlyLowercaseLettersRegex,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @ReqDataParam('headers') url: string) {
    console.log(this.removeSpacesRegex.execute('   teste   '));
    console.log(this.onlyLowercaseLettersRegex.execute('TesteAgora'));
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosService.remove(id);
  }
}
