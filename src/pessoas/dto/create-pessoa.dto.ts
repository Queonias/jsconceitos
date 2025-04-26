import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

export class CreatePessoaDto {
  @ApiProperty({
    description: 'E-mail do usuário, que será utilizado como login.',
    example: 'usuario@exemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário, que será convertida para hash.',
    minLength: 5,
    example: 'senhaForte123',
  })
  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Nome completo do usuário.',
    minLength: 3,
    maxLength: 100,
    example: 'João da Silva',
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Lista de permissões (políticas de rota) atribuídas ao usuário.',
    isArray: true,
    enum: RoutePolicies,
    example: [RoutePolicies.admin, RoutePolicies.user],
  })
  @IsEnum(RoutePolicies, { each: true })
  routePolicies: RoutePolicies[] = [];
}
