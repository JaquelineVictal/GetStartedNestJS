import * as fs from 'fs';
import * as csv from 'csv-parser';
import ibgeEntitie from './entities/metricEntitie';

export async function readCsvFilter(arrLength: number): Promise<ibgeEntitie[]> {
  const promise = () =>
    new Promise((resolve, reject) => {
      const csvTojson = [];
      fs.createReadStream(`${process.cwd()}/METRICS_REPORT-1673286660394.csv`)
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
  const find = 'EI';
  const csvTojsonFilter = csvTojson.filter((csvTojsonFilterElement) =>
    csvTojsonFilterElement.nome.match(find),
  );
  const newIbgesEntitie = csvTojsonFilter.map((csvTojsonElement, index) =>
    makeIbgeEntitie(csvTojsonElement, index, arrLength),
  );
  return newIbgesEntitie as ibgeEntitie[];
}

function makeIbgeEntitie(
  csvTojsonElement: any,
  index: number,
  arrLength: number,
): ibgeEntitie {
  return new ibgeEntitie({
    id: index + arrLength,
    name: csvTojsonElement.nome,
    region: csvTojsonElement.regiao,
    freq: csvTojsonElement.freq,
    rank: csvTojsonElement.rank,
    gender: csvTojsonElement.gender,
  });
}
