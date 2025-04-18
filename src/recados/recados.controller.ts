import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { AuthTokenGuard } from 'src/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload-param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

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
// @UseInterceptors(TimingConnectionInterceptor)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @ReqDataParam('headers') url: string) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
