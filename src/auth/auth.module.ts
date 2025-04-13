import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcrypyService } from './hashing/bcrypt.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcrypyService,
    },
  ],
})
export class AuthModule {}
