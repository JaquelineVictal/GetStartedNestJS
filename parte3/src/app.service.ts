import { Injectable } from '@nestjs/common';
import { read_csv } from './app.method';
import { ibgeDatabase } from './database/ibgeDatabase';
import ibgeEntitie from './entities/ibgeEntitie';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getCsvIbge(): Promise<ibgeEntitie[]> {
    const ibgesFromCsv = await read_csv();
    ibgeDatabase.push(ibgesFromCsv);
    return ibgeDatabase;
  }

  getIbge(): ibgeEntitie[] {
    return ibgeDatabase;
  }
}
