import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload-param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@ApiTags('Recados')
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os recados com paginação.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de recados retornada com sucesso.' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um recado específico pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID do recado', example: 1 })
  @ApiResponse({ status: 200, description: 'Recado encontrado com sucesso.' })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  @ApiOperation({
    summary: 'Cria um novo recado.',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({ type: CreateRecadoDto })
  @ApiResponse({ status: 201, description: 'Recado criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza um recado específico.',
    security: [{ bearerAuth: [] }],
  })
  @ApiParam({ name: 'id', description: 'ID do recado', example: 1 })
  @ApiBody({ type: UpdateRecadoDto })
  @ApiResponse({ status: 200, description: 'Recado atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta um recado específico.',
    security: [{ bearerAuth: [] }],
  })
  @ApiParam({ name: 'id', description: 'ID do recado', example: 1 })
  @ApiResponse({ status: 200, description: 'Recado deletado com sucesso.' })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.remove(id, tokenPayload);
  }
}
