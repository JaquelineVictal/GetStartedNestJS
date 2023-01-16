import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import ibgeEntitie from './entities/ibgeEntitie';
import Iibge from './interfaces/Iibge';

@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('IBGE')
  getIbge(): ibgeEntitie[] {
    return this.appService.getIbge();
  }

  @Post('IBGE')
  postIbge(@Req() request: Request): Iibge {
    //typeGuard
    const ibge = request.body as unknown as Iibge;
    return this.appService.postIbge(ibge);
  }
}
