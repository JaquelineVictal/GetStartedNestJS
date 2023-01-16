import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IbgeController } from './module/ibge/ibge.controller';
import { IbgeService } from './module/ibge/ibge.service';

@Module({
  imports: [],
  controllers: [AppController, IbgeController],
  providers: [AppService, IbgeService],
})
export class AppModule {}
