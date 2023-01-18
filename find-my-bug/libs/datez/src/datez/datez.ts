import {
  add,
  differenceInDays,
  differenceInMilliseconds,
  differenceInMinutes,
  endOfDay,
  endOfMonth,
  endOfYear,
  getDay,
  getDate,
  getDayOfYear,
  getDaysInMonth,
  getDaysInYear,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSaturday,
  isSunday,
  isValid,
  isWeekend,
  startOfHour,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  sub,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import moment, { Moment } from 'moment-timezone';

import { DatezFormat, DatezFormatter } from '../datez-format/datez-format';
import { DatezParser } from '../datez-parser/datez-parser';
import { DatezDuration } from './datez.type';

export class Datez {
  private date: Date;

  constructor(date: string | number | Date) {
    this.date = new Date(date);
  }

  static today(): Datez {
    return new Datez(Date.now());
  }

  static yesterday(): Datez {
    return this.timeAgo({ days: 1 });
  }

  static timeAgo(duration: DatezDuration): Datez {
    return this.today().sub(duration);
  }

  static fromString(dateStr: string, datezFormat: DatezFormat): Datez {
    return DatezParser.parse(dateStr, datezFormat);
  }

  static fromLocalString(dateStr: string, timeZone: string): Datez {
    return new Datez(zonedTimeToUtc(dateStr, timeZone, {}));
  }

  static differenceInMilliseconds(dateStart: Date, dateEnd: Date): number {
    return differenceInMilliseconds(dateEnd, dateStart);
  }

  static isValidDate(date: Date): boolean {
    return isValid(date);
  }

  isValidDate(): boolean {
    return isValid(this.date);
  }

  getDaysInYear(): number {
    return getDaysInYear(this.date);
  }

  timeAgoByDate(duration: DatezDuration): Datez {
    return new Datez(this.date).sub(duration);
  }

  toLocaleString(timezone: string): string {
    return this.date.toLocaleString(timezone);
  }

  toUtc(timeZone: string): Datez {
    return new Datez(zonedTimeToUtc(this.date, timeZone));
  }

  differenceInMinutes(date: Datez): number {
    return differenceInMinutes(this.date, date.toDate());
  }

  differenceInDays(date: Datez): number {
    return differenceInDays(this.date, date.toDate());
  }

  isSameDay(dateRight: Datez): boolean {
    return isSameDay(this.date, dateRight.toDate());
  }
  startOfHour(): Datez {
    return new Datez(startOfHour(this.date));
  }
  startOfDay(): Datez {
    return new Datez(startOfDay(this.date));
  }

  endOfDay(): Datez {
    return new Datez(endOfDay(this.date));
  }

  startOfWeek({ weekStartsOn }): Datez {
    return new Datez(startOfWeek(this.date, { weekStartsOn }));
  }
  startOfMonth(): Datez {
    return new Datez(startOfMonth(this.date));
  }

  endOfMonth(): Datez {
    return new Datez(endOfMonth(this.date));
  }

  startOfYear(): Datez {
    return new Datez(startOfYear(this.date));
  }

  endOfYear(): Datez {
    return new Datez(endOfYear(this.date));
  }

  getMinutes(): number {
    return getMinutes(this.date);
  }

  getHours(): number {
    return getHours(this.date);
  }

  getDay(): number {
    return getDay(this.date);
  }

  getDate(): number {
    return getDate(this.date);
  }

  getMonth(): number {
    return getMonth(this.date);
  }

  getYear(): number {
    return getYear(this.date);
  }

  add(duration: DatezDuration): Datez {
    const newDate = add(this.date, duration);
    return new Datez(newDate);
  }

  sub(duration: DatezDuration): Datez {
    const newDate = sub(this.date, duration);
    return new Datez(newDate);
  }

  format(datezFormat: DatezFormat): string {
    return DatezFormatter.format(this, datezFormat);
  }

  round(roundInMinutes: number) {
    const coeff = 1000 * 60 * roundInMinutes;
    const rounded = new Date(Math.floor(this.date.getTime() / coeff) * coeff);
    return new Datez(rounded);
  }

  ceil(roundInMinutes: number) {
    const coeff = 1000 * 60 * roundInMinutes;
    const rounded = new Date(Math.ceil(this.date.getTime() / coeff) * coeff);
    return new Datez(rounded);
  }

  toDate(): Date {
    return new Date(this.date);
  }

  toZonedTime(timeZone: string): Datez {
    return new Datez(utcToZonedTime(this.format(DatezFormat.standardDateTime), timeZone));
  }

  toMoment(): Moment {
    return moment.utc(this.toDate());
  }

  isAfter(date: Datez): boolean {
    return isAfter(this.date, date.toDate());
  }

  isAfterOrEqual(date: Datez): boolean {
    return isEqual(this.date, date.toDate()) || isAfter(this.date, date.toDate());
  }

  isBefore(date: Datez): boolean {
    return isBefore(this.date, date.toDate());
  }

  isBetween(start: Datez, end: Datez): boolean {
    const date = new Datez(this.date);
    if (date.isBefore(start)) return false;
    if (date.isAfter(end)) return false;
    return true;
  }

  isBeforeDay(date: Datez): boolean {
    const smallDate = this.format(DatezFormat.dashedYYYYMMDD);
    const today = date.format(DatezFormat.dashedYYYYMMDD);

    const dateA = Datez.fromString(smallDate, DatezFormat.dashedYYYYMMDD).toDate();
    const dateB = Datez.fromString(today, DatezFormat.dashedYYYYMMDD).toDate();

    return isBefore(dateA, dateB);
  }

  isEqual(date: Datez): boolean {
    return isEqual(this.date, date.toDate());
  }

  isBeforeOrEqualDay(date: Datez): boolean {
    const smallDate = this.format(DatezFormat.dashedYYYYMMDD);
    const today = date.format(DatezFormat.dashedYYYYMMDD);

    const dateA = Datez.fromString(smallDate, DatezFormat.dashedYYYYMMDD).toDate();
    const dateB = Datez.fromString(today, DatezFormat.dashedYYYYMMDD).toDate();

    return isEqual(dateA, dateB) || isBefore(dateA, dateB);
  }

  isBeforeOrEqual(date: Datez): boolean {
    return isEqual(this.date, date.toDate()) || isBefore(this.date, date.toDate());
  }

  isRangeOf(startDate: Datez, endDate: Datez): boolean {
    return this.isAfterOrEqual(startDate) && this.isBeforeOrEqual(endDate);
  }
  isWeekend(): boolean {
    return isWeekend(this.date);
  }

  isSunday(): boolean {
    return isSunday(this.date);
  }

  isSaturday(): boolean {
    return isSaturday(this.date);
  }

  getDaysInMonth(): number {
    return getDaysInMonth(this.date);
  }

  getDayOfYear(): number {
    return getDayOfYear(this.date);
  }
}
