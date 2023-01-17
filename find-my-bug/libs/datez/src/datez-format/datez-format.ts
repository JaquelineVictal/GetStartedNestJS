import { format, parse } from 'date-fns';

import { Datez } from '../datez/datez';

export enum DatezFormat {
  DDMMYYYY = 'ddMMyyyy',
  YYYYMMDD = 'yyyyMMdd',
  slashedDDMMYYYY = 'dd/MM/yyyy',
  TimestampInSeconds = 'TimestampInSeconds',
  ISO = 'ISO',
  dashedYYYYMMDD = 'yyyy-MM-dd',
  dashedYYYYMM = 'yyyy-MM',
  YYYY = 'yyyy',
  slashedYYYYMMDD = 'yyyy/MM/dd',
  slashedDateTimeWithoutSecond = 'dd/MM/yyyy HH:mm',
  standardDateTime = 'yyyy-MM-dd HH:mm:ss',
  standardUnderscoreDateTime = 'yyyy_MM_dd_HH_mm_ss',
  dateTime = 'dateTime',
  date = 'date',
  hours = 'hours',
  minutes = 'minutes',
  standardDateTimeWithSecondZero = 'yyyy-MM-dd HH:mm:00',
  onlyMonth = 'MM',
  onlyDay = 'dd',
  onlyHour = 'HH',
  onlyMinute = 'mm',
  onlySeconds = 'ss',
}

export class DatezFormatter {
  public static reformat(dateStr: string, from: DatezFormat, to: DatezFormat): string {
    if (from === DatezFormat.dateTime) {
      return this.formatStringDate(dateStr, to);
    }

    const date = parse(dateStr, String(from), new Date());
    return this.formatDate(date, to);
  }

  public static format(date: Datez, datezFormat: DatezFormat): string {
    return this.formatDate(date.toDate(), datezFormat);
  }

  private static formatDate(date: Date, datezFormat: DatezFormat): string {
    switch (datezFormat) {
      case DatezFormat.TimestampInSeconds:
        return this.formatTimestampInSeconds(date);
      case DatezFormat.ISO:
        return this.formatISO(date);
      default:
        return this.formatDefault(date, datezFormat);
    }
  }

  private static formatStringDate(date: string, datezFormat: DatezFormat): string {
    switch (datezFormat) {
      case DatezFormat.date:
        return this.getDate(date);
      case DatezFormat.hours:
        return this.getHours(date);
      case DatezFormat.minutes:
        return this.getMinutes(date);
      default:
        return date;
    }
  }

  private static formatTimestampInSeconds(date: Date): string {
    const timestampInSeconds = Math.round(date.getTime() / 1000);
    return String(timestampInSeconds);
  }

  private static formatISO(date: Date): string {
    return date.toISOString();
  }

  private static formatDefault(date: Date, datezFormat: DatezFormat): string {
    const utcDate = this.localDateAsUTCDate(date);
    return format(utcDate, datezFormat);
  }

  private static localDateAsUTCDate(localDate: Date): Date {
    const utcDate = new Date(localDate);
    const newMinutes = localDate.getMinutes() + localDate.getTimezoneOffset();
    utcDate.setMinutes(newMinutes);
    return utcDate;
  }

  private static getDate(datetime: string): string {
    return datetime.substr(0, 10);
  }

  private static getHours(datetime: string): string {
    return datetime.substr(11, 2);
  }

  private static getMinutes(datetime: string): string {
    return datetime.substr(14, 2);
  }
}
