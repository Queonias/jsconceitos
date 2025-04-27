import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
import { TokenPayloadParam } from 'src/auth/params/token-payload-param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PessoaResponseDto } from './dto/response-pessoa.dto'; // vamos criar esse DTO!
import { AllPessoaResponseDto } from './dto/all-response-pessoa.dto'; // vamos criar esse também!
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

@ApiTags('Pessoas')
@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criar uma nova pessoa.',
    security: [{ bearerAuth: [] }],
  })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiBody({ type: CreatePessoaDto })
  @ApiResponse({ status: 201, type: PessoaResponseDto })
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'Rota para listar todas as pessoas.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, type: [AllPessoaResponseDto] })
  async findAll(@Req() req: Request) {
    console.log(req[REQUEST_TOKEN_PAYLOAD_KEY].sub);
    return this.pessoasService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Rota para buscar uma pessoa pelo ID.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, type: AllPessoaResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiParam({ name: 'id', description: 'ID da pessoa', example: 1 })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pessoasService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({
    summary: 'Rota para atualizar uma pessoa.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, type: PessoaResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiParam({ name: 'id', description: 'ID da pessoa', example: 1 })
  @ApiBody({ type: UpdatePessoaDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto,
  ) {
    return this.pessoasService.update(id, updatePessoaDto, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Rota para deletar uma pessoa.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, type: PessoaResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiParam({ name: 'id', description: 'ID da pessoa', example: 1 })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto,
  ) {
    return this.pessoasService.remove(id, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 10 * (1024 * 1024),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.pessoasService.uploadPicture(file, tokenPayload);
  }
}
