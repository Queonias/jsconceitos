import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRecadoDto {
  @ApiProperty({
    description: 'Texto do recado a ser enviado.',
    example: 'Olá! Apenas passando para lembrar da reunião às 10h.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly texto: string;

  @ApiProperty({
    description: 'ID da pessoa que receberá o recado.',
    example: 42,
  })
  @IsPositive()
  paraId: number;
}
