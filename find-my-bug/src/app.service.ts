import { BadRequestException, Injectable } from '@nestjs/common';
import { Datez, DatezFormat, DatezRange } from 'libs/datez/src';
import { configurationEnv } from './configuration/configuration';
import { ConfigurationService } from './configuration/configuration.service';
import { ElectricityPoints } from './mocks/electricityPoints.mock';
import { WeatherPoints } from './mocks/weatherPoints.mock';
import * as Math from 'mathjs';

@Injectable()
export class AppService {
  //constructor() {}

  getReport(body: IReportInput): IResultProcess[] {
    const { dateFrom, dateTo, frequency, energy } = body;
    const dayInRange = this.createDateRange(dateFrom, dateTo);
    console.log(dayInRange);
    const envEnergyType = this.getEnvEnergyType();
    console.log(envEnergyType);
    const parameters = this.getParameters();
    console.log(parameters);

    if (envEnergyType != energy)
      throw new BadRequestException('Doesnt has a report for this energy type');

    const result: IResultProcess[] = dayInRange.flatMap((date) => {
      const IResultProcess = this.process(date, parameters);
      return IResultProcess;
    });
    return result;
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
    if (isClosedDay) {
      const returnIsClosedDay: IResultProcess[] = dayEnergyPoints.map(
        (point) => {
          return this._calculateIsClosedDay(point);
        },
      );
      return returnIsClosedDay;
    }
    const result: IResultProcess[] = dayEnergyPoints.map((point) => {
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
  private _calculateIsClosedDay(point: IPoint): IResultProcess {
    return {
      date: point.date,
      value: null,
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
        this.filterIsSameDay(energyPointValuesElement.date, day) == true,
    );
    return dayEnergyPoints;
  }

  private getDayWeatherPoints(
    day: Datez,
    weatherPointValues: IPoint[],
  ): IPoint[] {
    const dayWeatherPoint = weatherPointValues.filter(
      (weatherPointValuesElement) =>
        this.filterIsSameDay(weatherPointValuesElement.date, day) == true,
    );
    return dayWeatherPoint;
  }

  private getMaxWeatherValue(dayWeatherPoint): number {
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
    if (date.getDate() < initialMonthClosed || isWinter == true) return true;
    return false;
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
  frequency: string;
  energy: string;
}
