import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePessoaDto {
  @IsEmail()
  email: string; // E-mail será usuário

  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  password: string; // Será convertida em hash

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  nome: string;
}
