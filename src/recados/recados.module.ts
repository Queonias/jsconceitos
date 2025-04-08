import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosUtils, RecadosUtilsMock } from './recados.utils';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from 'src/recados/recados.constant';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';

@Module({
  imports: [TypeOrmModule.forFeature([Recado]), forwardRef(() => PessoasModule)],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    {
      provide: RecadosUtils, //Token para injeção de dependência
      // useValue: new RecadosUtilsMock(), // Mock
      useClass: RecadosUtils, // Classe real
    },
    {
      provide: SERVER_NAME,
      useValue: 'My Name Is NestJS',
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowercaseLettersRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
    },
  ],
  exports: [
    SERVER_NAME,
    {
      provide: RecadosUtils,
      useClass: RecadosUtils,
    },
  ],
})
export class RecadosModule {}
