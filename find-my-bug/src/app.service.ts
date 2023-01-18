import { BadRequestException, Injectable } from '@nestjs/common';
import { Datez, DatezFormat, DatezRange } from 'libs/datez/src';
import { configurationEnv } from './configuration/configuration';
import { ConfigurationService } from './configuration/configuration.service';
import { ElectricityPoints } from './mocks/electricityPoints.mock';
import { WeatherPoints } from './mocks/weatherPoints.mock';
import * as Math from 'mathjs';
import { POINTS_FREQUENCY } from './enum/frequency.enum';

@Injectable()
export class AppService {
  getReport(body: IReportInput): IResultProcess[] {
    const { dateFrom, dateTo, frequency, energy } = body;
    const dayInRange = this.createDateRange(dateFrom, dateTo);
    const envEnergyType = this.getEnvEnergyType();
    const parameters = this.getParameters();

    if (envEnergyType != energy)
      throw new BadRequestException('Doesnt has a report for this energy type');

    const result: IResultProcess[] = dayInRange.flatMap((date) => {
      const IResultProcess = this.process(date, parameters);
      return IResultProcess;
    });
    const resultGroupByFreq: IResultProcess[] = this.getResultGroupByFreq(
      result,
      frequency,
    );

    return resultGroupByFreq;
  }

  private process(
    date: Datez,
    parameters: ParametersCalculation,
  ): IResultProcess[] {
    const weatherPoints: IPoint[] = WeatherPoints;
    const energyPoints: IPoint[] = ElectricityPoints;

    const dayEnergyPoints = this.getDayEnergyPoints(date, energyPoints);
    const dayWeatherPoint = this.getDayWeatherPoints(date, weatherPoints);
    const maxWeatherValue = this.getMaxWeatherValue(dayWeatherPoint);

    const isClosedDay = this.verifyIsClosed(
      date,
      parameters.parameterC,
      parameters.parameterD,
    );

    const result: IResultProcess[] = dayEnergyPoints.map((point) => {
      if (isClosedDay) return { date: point.date, value: null };
      return this._calculate(point, maxWeatherValue, parameters);
    });
    return result;
  }

  private _calculate(
    point: IPoint,
    maxWeatherValue: number,
    parameters: ParametersCalculation,
  ): IResultProcess {
    return {
      date: point.date,
      value:
        parameters.parameterA * point.value * maxWeatherValue -
        parameters.parameterB,
    };
  }

  private createDateRange(dateFrom: string, dateTo: string): Datez[] {
    const dateRange = new DatezRange(
      Datez.fromString(dateFrom, DatezFormat.standardDateTime),
      Datez.fromString(dateTo, DatezFormat.standardDateTime),
    );
    return dateRange.days();
  }

  private getEnvEnergyType() {
    return configurationEnv.type.report;
  }

  private getParameters(): ParametersCalculation {
    const parameterA = configurationEnv.parameters.parameterA;
    const parameterB = configurationEnv.parameters.parameterB;
    const parameterC = configurationEnv.parameters.parameterC;
    const parameterD = configurationEnv.parameters.parameterD;
    return { parameterA, parameterB, parameterC, parameterD };
  }

  private getDayEnergyPoints(
    day: Datez,
    energyPointValues: IPoint[],
  ): IPoint[] {
    const dayEnergyPoints = energyPointValues.filter(
      (energyPointValuesElement) =>
        this.filterIsSameDay(energyPointValuesElement.date, day),
    );
    return dayEnergyPoints;
  }

  private getDayWeatherPoints(
    day: Datez,
    weatherPointValues: IPoint[],
  ): IPoint[] {
    const dayWeatherPoint = weatherPointValues.filter(
      (weatherPointValuesElement) =>
        this.filterIsSameDay(weatherPointValuesElement.date, day),
    );
    return dayWeatherPoint;
  }

  private getMaxWeatherValue(dayWeatherPoint: IPoint[]): number {
    return Math.max(
      ...dayWeatherPoint.map(
        (weatherPointValuesElement) => weatherPointValuesElement.value,
      ),
    );
  }

  private filterIsSameDay(dateLeft: string, dateRight: Datez): boolean {
    const newDateLeft = new Datez(dateLeft);
    return newDateLeft.isSameDay(dateRight);
  }

  private verifyIsClosed(
    date: Datez,
    isWinter: boolean,
    initialMonthClosed: number,
  ): boolean {
    //IF date < initialMonthClosed the Site is closed --> true
    //IF isWinter is true the site is closed true
    if (date.getDate() < initialMonthClosed || isWinter) return true;
    return false;
  }

  private getResultGroupByFreq(
    result: IResultProcess[],
    frequency: POINTS_FREQUENCY,
  ): IResultProcess[] {
    const mapGroupByFreq = new Map();
    result.forEach((resultElement) => {
      const resultDate = new Datez(resultElement.date);
      const dateGroupByFreq = this.getDateGroupByFreq(resultDate, frequency);

      if (!mapGroupByFreq.has(dateGroupByFreq)) {
        const newMapRegister: MapRegister = {
          total: Number(resultElement.value),
          counter: 1,
          average: Number(resultElement.value),
        };
        mapGroupByFreq.set(dateGroupByFreq, newMapRegister);
        return;
      }
      const MapRegister: MapRegister = mapGroupByFreq.get(dateGroupByFreq);
      MapRegister.total = MapRegister.total + Number(resultElement.value);
      MapRegister.counter++;
      MapRegister.average = MapRegister.total / MapRegister.counter;

      mapGroupByFreq.set(dateGroupByFreq, MapRegister);
    });
    const resultGroupByFreq = Array.from(mapGroupByFreq, this.fomartMapToArry);
    return resultGroupByFreq;
  }

  private getDateGroupByFreq(
    resultDate: Datez,
    frequency: POINTS_FREQUENCY,
  ): string {
    switch (frequency) {
      case POINTS_FREQUENCY.PHour: {
        return resultDate.startOfHour().format(DatezFormat.standardDateTime);
      }
      case POINTS_FREQUENCY.PDay: {
        return resultDate.startOfDay().format(DatezFormat.standardDateTime);
      }
      case POINTS_FREQUENCY.PWeek: {
        return resultDate
          .startOfWeek({ weekStartsOn: 0 })
          .format(DatezFormat.standardDateTime);
      }
    }
  }

  private fomartMapToArry(mapGroupByFreqElement): IResultProcess {
    return {
      date: mapGroupByFreqElement[0],
      value: mapGroupByFreqElement[1].average,
    };
  }
}

export interface ParametersCalculation {
  parameterA: number;
  parameterB: number;
  parameterC: boolean;
  parameterD: number;
}

export interface IResultProcess {
  date: string;
  value: number | null;
}

export interface IPoint {
  date: string;
  value: number;
  referenceValue: number;
  metricId: number;
}
export interface IReportInput {
  dateFrom: string;
  dateTo: string;
  frequency: POINTS_FREQUENCY;
  energy: string;
}

export interface MapRegister {
  total: number;
  counter: number;
  average: number;
}
