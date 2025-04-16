import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcrypyService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Pessoa]), ConfigModule.forFeature(jwtConfig)],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcrypyService,
    },
    AuthService,
  ],
  exports: [HashingService],
})
export class AuthModule {}
