import * as fs from 'fs';
import * as csv from 'csv-parser';
import { IbgeEntity } from './entities/IbgeEntity';
import { searchName } from './entities/enums/searchName.enum';
import { Injectable } from '@nestjs/common';
import { ibgeDatabase } from '../../database/ibgeDatabase';

@Injectable()
export class IbgeService {
  async getCsvIbgeFilter(): Promise<string> {
    const parsedCsv = await this.readCsv();
    const parsedCsvFilter = this.filterCsv(parsedCsv, searchName.EI);
    const ibgeData = this.buildIbgeEntities(
      parsedCsvFilter,
      ibgeDatabase.length,
    );
    ibgeDatabase.push(...ibgeData);
    return JSON.stringify(ibgeData, ['name']);
  }

  getIbge(): IbgeEntity[] {
    return ibgeDatabase;
  }

  private async readCsv(): Promise<any[]> {
    const promise = () =>
      new Promise((resolve, reject) => {
        const parsedCsv = [];
        fs.createReadStream(`${process.cwd()}/ibge-fem-10000.csv`)
          .pipe(csv())
          .on('data', (csvline) => parsedCsv.push(csvline))
          .on('end', () => {
            resolve(parsedCsv);
          })
          .on('error', function (err) {
            reject(err);
          });
      });
    return (await promise()) as any[];
  }

  private filterCsv(parsedCsv: any[], find: string): any[] {
    const parsedCsvFilter = parsedCsv.filter((parsedCsvElement) =>
      parsedCsvElement.nome.match(find),
    );
    return parsedCsvFilter;
  }

  private buildIbgeEntities(
    parsedCsvFilter: any[],
    arryLength: number,
  ): IbgeEntity[] {
    const newIbgeEntities: IbgeEntity[] = parsedCsvFilter.map(
      (parsedCsvFilterElement, index) =>
        this.makeIbgeEntity(parsedCsvFilterElement, index, arryLength),
    );
    return newIbgeEntities;
  }

  private makeIbgeEntity(
    ibgeParsedCsv: any,
    index: number,
    arrLength: number,
  ): IbgeEntity {
    const newIbgeEntity = {
      id: index + arrLength,
      name: ibgeParsedCsv.nome,
      region: ibgeParsedCsv.regiao,
      freq: ibgeParsedCsv.freq,
      rank: ibgeParsedCsv.rank,
      gender: ibgeParsedCsv.sexo,
      createdAt: ibgeParsedCsv.createdAt ? ibgeParsedCsv.createdAt : new Date(),
      updatedAt: ibgeParsedCsv.updatedAt ? ibgeParsedCsv.updatedAt : new Date(),
    };
    return new IbgeEntity().build(
      newIbgeEntity.id,
      newIbgeEntity.name,
      newIbgeEntity.region,
      newIbgeEntity.freq,
      newIbgeEntity.rank,
      newIbgeEntity.gender,
      newIbgeEntity.createdAt,
      newIbgeEntity.updatedAt,
    );
  }
}
