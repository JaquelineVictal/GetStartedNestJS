import { Injectable } from '@nestjs/common';
import { readCsvFilter } from './app.method';
import { ibgeDatabase } from './database/ibgeDatabase';
import ibgeEntitie from './entities/ibgeEntitie';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getCsvIbgeFilter(): Promise<ibgeEntitie[]> {
    const ibgesFromCsv = await readCsvFilter();
    ibgeDatabase.push(...ibgesFromCsv);
    return ibgeDatabase;
  }

  getIbge(): ibgeEntitie[] {
    return ibgeDatabase;
  }
}
