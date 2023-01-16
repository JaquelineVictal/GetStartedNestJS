import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportController } from './module/reports/report.controller';
import { ReportService } from './module/reports/report.service';

@Module({
  imports: [],
  controllers: [AppController, ReportController],
  providers: [AppService, ReportService],
})
export class AppModule {}
