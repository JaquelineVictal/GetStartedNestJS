import { Controller, Get } from '@nestjs/common';
import ReportEntity from './entities/ReportEntity';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('read-csv/report')
  async getCsvIbge(): Promise<ReportEntity[]> {
    return await this.appService.getReportbyHour();
  }
}
