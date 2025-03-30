import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

// CRUD - Create, Read, Update, Delete
// Create - POST -> Criar
// Read - GET -> Ler
// Read - GET -> Ler apenas um
// Delete - DELETE -> Deletar
// Update - PATCH/PUT -> Atualizar

// PATCH - Atualiza apenas uma parte do recurso
// PUT - Atualiza o recurso inteiro

@Controller('recados')
export class RecadosController {
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return 'Essa rota retorna todos os recados';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return `Essa rota retorna o recado ID ${id}`;
  }

  @Post()
  create(@Body() body: any) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      id,
      ...body,
    };
  }
}
