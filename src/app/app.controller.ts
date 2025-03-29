import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Método da solicitação HTTP
  getHello(): string {
    return this.appService.getHello();
  }
}
