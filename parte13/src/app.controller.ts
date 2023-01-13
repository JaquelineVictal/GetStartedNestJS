import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import ibgeEntitie from './entities/ibgeEntitie';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('IBGE')
  getIbge(): ibgeEntitie[] {
    return this.appService.getIbge();
  }

  @Get('read-csv/IBGE')
  async getCsvIbge(): Promise<ibgeEntitie[]> {
    return await this.appService.getCsvIbgeFilter();
  }
}
