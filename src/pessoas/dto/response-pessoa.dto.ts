import { ApiProperty } from '@nestjs/swagger';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

export class PessoaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'usuario@exemplo.com' })
  email: string;

  @ApiProperty({ example: 'João da Silva' })
  nome: string;

  @ApiProperty({ isArray: true, enum: RoutePolicies, example: [RoutePolicies.user] })
  routePolicies: RoutePolicies[];

  @ApiProperty({ example: '2025-04-26T12:34:56.789Z' })
  createdAt: string;
}
