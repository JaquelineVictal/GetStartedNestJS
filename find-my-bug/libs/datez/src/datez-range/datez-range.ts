import { DatezRangeFormatted } from './datez-range.type';
import { DatezFormat, DatezFormatter } from '../datez-format/datez-format';
import { Datez } from '../datez/datez';
import { DatezDuration } from '../datez/datez.type';

export class DatezRange {
  private start: Datez;
  private end: Datez;

  constructor(start: Datez, end: Datez) {
    this.start = start;
    this.end = end;
  }

  static lastNDays(days: number): DatezRange {
    const now = new Date(Date.now());
    const start = new Datez(now).add({ days: -days });
    const end = new Datez(now);
    return new DatezRange(start, end);
  }

  static lastNDaysFrom(date: string, format: DatezFormat, days: number): DatezRange {
    const from = Datez.fromString(date, format);
    const start = from.add({ days: -days });
    const end = from;
    return new DatezRange(start, end);
  }

  static entireDay(date: string, format: DatezFormat): DatezRange {
    const start = Datez.fromString(date, format);
    const end = Datez.fromString(date, format).add({ hours: 23, minutes: 59, seconds: 59 });
    const range = new DatezRange(start, end);
    return range;
  }
  static entireLocalDay(date: string, timezone: string): DatezRange {
    const start = Datez.fromLocalString(date, timezone);
    const end = Datez.fromLocalString(date, timezone).add({ hours: 23, minutes: 59, seconds: 59 });
    const range = new DatezRange(start, end);
    return range;
  }

  static entireHour(date: string, format: DatezFormat): DatezRange {
    const start = Datez.fromString(date, format);
    const end = Datez.fromString(date, format).add({ minutes: 59, seconds: 59 });
    const range = new DatezRange(start, end);
    return range;
  }

  getDates(): { start: Date; end: Date } {
    const start = this.start.toDate();
    const end = this.end.toDate();
    return { start, end };
  }

  format(datezFormat: DatezFormat): DatezRangeFormatted {
    const start = DatezFormatter.format(this.start, datezFormat);
    const end = DatezFormatter.format(this.end, datezFormat);
    return { start, end };
  }

  days(): Datez[] {
    const listOfDays: Datez[] = [];
    for (let date = this.start; date.isBeforeOrEqual(this.end); date = date.add({ days: 1 })) {
      listOfDays.push(date);
    }
    return listOfDays;
  }

  steppedBy(duration: DatezDuration): Datez[] {
    const dates: Datez[] = [];
    for (let date = this.start; date.isBeforeOrEqual(this.end); date = date.add(duration)) {
      dates.push(date);
    }
    return dates;
  }
}
