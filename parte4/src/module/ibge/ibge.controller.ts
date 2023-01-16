import { Controller, Get } from '@nestjs/common';
import { IbgeService } from './ibge.service';
import { IbgeEntity } from './entities/IbgeEntity';

@Controller()
export class IbgeController {
  constructor(private readonly appService: IbgeService) {}

  @Get('IBGE')
  getIbge(): IbgeEntity[] {
    return this.appService.getIbge();
  }

  @Get('read-csv/IBGE')
  async getCsvIbge(): Promise<string> {
    return await this.appService.getCsvIbgeFilter();
  }
}
