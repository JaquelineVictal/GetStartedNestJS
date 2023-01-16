import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import ReportEntity from './entities/ReportEntity';

@Injectable()
export class ReportService {
  async getReportbyHour(): Promise<ReportEntity[]> {
    const parsedCsvMetrics = await this.readCsv();
    const reporteGroupByHour = this.buildReporteGroupByHour(parsedCsvMetrics);
    return reporteGroupByHour;
  }

  private async readCsv(): Promise<any[]> {
    const promise = () =>
      new Promise((resolve, reject) => {
        const parsedCsvMetrics = [];
        fs.createReadStream(`${process.cwd()}/METRICS_REPORT-1673286660394.csv`)
          .pipe(csv({ separator: ';' }))
          .on('data', (csvline) => parsedCsvMetrics.push(csvline))
          .on('end', () => {
            resolve(parsedCsvMetrics);
          })
          .on('error', function (err) {
            reject(err);
          });
      });
    return (await promise()) as any[];
  }

  private buildReporteGroupByHour(parsedCsvMetrics: any[]) {
    const mapGroupByDay = new Map();
    parsedCsvMetrics.forEach((parsedCsvMetricsElement) => {
      const metricDate = this.ajustetMetricDate(
        parsedCsvMetricsElement.dateTime,
      );
      const reportDate = this.buildReportDate(metricDate);

      if (mapGroupByDay.has(reportDate) == false) {
        const newReportRegister = {
          totalValue: Number(parsedCsvMetricsElement.value),
          count: 1,
          avg: Number(parsedCsvMetricsElement.value),
        };
        mapGroupByDay.set(reportDate, newReportRegister);
        return;
      }
      const reportRegister = mapGroupByDay.get(reportDate);
      reportRegister.totalValue =
        reportRegister.totalValue + Number(parsedCsvMetricsElement.value);
      reportRegister.count++;
      reportRegister.avg = reportRegister.totalValue / reportRegister.count;

      mapGroupByDay.set(reportDate, reportRegister);
    });
    const reportGroupByHour: ReportEntity[] = Array.from(
      mapGroupByDay,
      this.makeReportEntity,
    );
    return reportGroupByHour;
  }

  private ajustetMetricDate(dateTime: string): string {
    const [dateComponents, timeComponents] = dateTime.toString().split(' ');
    const [day, month, year] = dateComponents.split('/');
    const [hours, minutes, seconds] = timeComponents.split(':');
    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return date.toLocaleString('pt-BR');
  }

  private buildReportDate(date: string): string {
    const [dateComponents, timeComponents] = date.toString().split(' ');
    const [hours, minutes, seconds] = timeComponents.split(':');
    const dateHour = dateComponents + ' ' + hours + ':00:00';
    return dateHour;
  }

  private makeReportEntity(mapGroupByDayElement: any): ReportEntity {
    return new ReportEntity().build(
      mapGroupByDayElement[0],
      mapGroupByDayElement[1].totalValue,
      mapGroupByDayElement[1].count,
      mapGroupByDayElement[1].avg,
    );
  }
}
