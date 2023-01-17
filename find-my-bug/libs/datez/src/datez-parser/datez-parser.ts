import { DatezFormat } from '../datez-format/datez-format';
import { Datez } from '..';
import { parse, parseISO } from 'date-fns';

export class DatezParser {
  static parse(dateStr: string, datezFormat: DatezFormat): Datez {
    switch (datezFormat) {
      case DatezFormat.ISO:
        return this.parseISO(dateStr);
      default:
        return this.parseDefault(dateStr, datezFormat);
    }
  }

  static parseISO(dateStr: string): Datez {
    const date = parseISO(dateStr);
    return new Datez(date);
  }

  static parseDefault(dateStr: string, datezFormat: DatezFormat): Datez {
    const referenceDate = new Date(2020, 0, 1);
    const date = parse(dateStr, datezFormat, referenceDate);
    return new Datez(date);
  }
}
