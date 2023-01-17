import { Body, Controller, Get, Response } from '@nestjs/common';
import { AppService, IResultProcess } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getEnergyReport')
  getEnergyReport(
    @Response({ passthrough: true }) res,
    @Body() body,
  ): IResultProcess[] {
    return this.appService.getReport(body);
  }
}
