import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcrypyService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
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
