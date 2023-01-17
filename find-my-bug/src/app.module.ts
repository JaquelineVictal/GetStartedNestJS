import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationService } from './configuration/configuration.service';
import { DatezModule } from '../libs/datez/src';

@Module({
  imports: [DatezModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ConfigurationService],
})
export class AppModule {}
