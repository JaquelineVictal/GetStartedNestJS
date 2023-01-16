import { Injectable } from '@nestjs/common';
import { readCsvFilter } from './app.method';
import { metricsDatabase } from './database/metricsDatabase';
import ibgeEntitie from './entities/metricEntitie';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getCsvIbgeFilter(): Promise<ibgeEntitie[]> {
    const parsedCsv = await read_csv();
    const reportDays = getAllDays(parsedCsv);
    const groupByResults = groupByHourAvg(reportDays, parsedCsv)
    metricsDatabase.push(...ibgesFromCsv);
    return metricsDatabase;
  }

  getIbge(): ibgeEntitie[] {
    return metricsDatabase;
  }
}
