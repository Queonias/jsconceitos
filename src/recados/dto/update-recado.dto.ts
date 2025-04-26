import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  @ApiPropertyOptional({
    description: 'Define se o recado foi lido ou não.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  readonly lido?: boolean;
}
