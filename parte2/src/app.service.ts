import { Injectable } from '@nestjs/common';
import { ibgeDatabase } from './database/ibgeDatabase';
import ibgeEntitie from './entities/ibgeEntitie';
import Iibge from './interfaces/Iibge';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getIbge(): ibgeEntitie[] {
    return ibgeDatabase;
  }

  postIbge(ibge: Iibge): ibgeEntitie {
    const newIbgeEntitie = new ibgeEntitie(ibge);
    ibgeDatabase.push(newIbgeEntitie);
    return newIbgeEntitie;
  }
}
