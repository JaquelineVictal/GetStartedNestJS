import * as fs from 'fs';
import * as csv from 'csv-parser';
import ibgeEntitie from './entities/ibgeEntitie';

export async function readCsvFilter(): Promise<ibgeEntitie[]> {
  const promise = () =>
    new Promise((resolve, reject) => {
      const csvTojson = [];
      fs.createReadStream(`${process.cwd()}/ibge-fem-10000.csv`)
        .pipe(csv())
        .on('data', (csvline) => csvTojson.push(csvline))
        .on('end', () => {
          resolve(csvTojson);
        })
        .on('error', function (err) {
          reject(err);
        });
    });
  const csvTojson = (await promise()) as any[];
  const newIbgesEntitie = csvTojson.map((csvTojsonElement, index) =>
    makeIbgeEntitie(csvTojsonElement, index),
  );
  const find = 'EI';
  const getCsvIbgeFilter = newIbgesEntitie.filter((newIbgesEntitieElement) =>
    newIbgesEntitieElement.name.match(find),
  );
  return getCsvIbgeFilter as ibgeEntitie[];
}

function makeIbgeEntitie(csvTojsonElement: any, index: number): ibgeEntitie {
  return new ibgeEntitie({
    id: index,
    name: csvTojsonElement.nome,
    region: csvTojsonElement.regiao,
    freq: csvTojsonElement.freq,
    rank: csvTojsonElement.rank,
    gender: csvTojsonElement.gender,
  });
}
