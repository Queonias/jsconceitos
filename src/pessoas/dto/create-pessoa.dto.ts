import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePessoaDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  nome: string;
}
