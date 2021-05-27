export default class EpiDate {
  private static DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  private static CUMULATIVE_DAYS_PER_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  private static DAY_OF_WEEK_TABLE = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

  constructor(private readonly year: number, private readonly month: number, private readonly day: number) {
    // constructor logic
    if (
      year < 1 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > EpiDate.DAYS_PER_MONTH[month - 1] + (month == 2 && EpiDate.isLeapYear(year) ? 1 : 0)
    ) {
      throw new Error(`invalid date: year: ${year}, month: ${month}, day: ${day}`);
    }
  }

  private static getIndex(year: number, month: number, day: number): number {
    const y = (year + 399) % 400;
    const yearOffset =
      Math.floor((year - 1) / 400) * 146097 + y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
    const monthOffset = EpiDate.CUMULATIVE_DAYS_PER_MONTH[month - 1] + (month > 2 && EpiDate.isLeapYear(year) ? 1 : 0);
    const dayOffset = day - 1;
    return yearOffset + monthOffset + dayOffset;
  }

  private static getDayOfWeek(year: number, month: number, day: number): number {
    const y = year - (month < 3 ? 1 : 0);
    return (
      (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + EpiDate.DAY_OF_WEEK_TABLE[month - 1] + day) %
      7
    );
  }

  getYear(): number {
    return this.year;
  }
  getMonth(): number {
    return this.month;
  }
  getDay(): number {
    return this.day;
  }

  compare(that: EpiDate): number {
    if (that.year !== this.year) {
      return this.year - that.year;
    }
    if (that.month !== this.month) {
      return this.month - that.month;
    }
    return this.day - that.day;
  }

  isLeapYear(): boolean {
    return EpiDate.isLeapYear(this.year);
  }

  toString(): string {
    return `${this.year}/${this.month}/${this.day}`;
  }

  getIndex(): number {
    return EpiDate.getIndex(this.year, this.month, this.day);
  }
  getDayOfWeek(): number {
    return EpiDate.getDayOfWeek(this.year, this.month, this.day);
  }
  getEpiYear(): number {
    const thisDate = EpiDate.getIndex(this.year, this.month, this.day);
    const firstDate1 = EpiDate.getIndex(this.year, 1, 4) - EpiDate.getDayOfWeek(this.year, 1, 4);
    let y: number;
    if (thisDate < firstDate1) {
      y = -1;
    } else {
      const firstDate2 = EpiDate.getIndex(this.year + 1, 1, 4) - EpiDate.getDayOfWeek(this.year + 1, 1, 4);
      y = thisDate < firstDate2 ? 0 : 1;
    }
    return this.year + y;
  }
  getEpiWeek(): number {
    const thisDate = EpiDate.getIndex(this.year, this.month, this.day);
    const firstDate1 = EpiDate.getIndex(this.year, 1, 4) - EpiDate.getDayOfWeek(this.year, 1, 4);
    let firstDate;
    if (thisDate < firstDate1) {
      firstDate = EpiDate.getIndex(this.year - 1, 1, 4) - EpiDate.getDayOfWeek(this.year - 1, 1, 4);
    } else {
      const firstDate2 = EpiDate.getIndex(this.year + 1, 1, 4) - EpiDate.getDayOfWeek(this.year + 1, 1, 4);
      firstDate = thisDate < firstDate2 ? firstDate1 : firstDate2;
    }
    return Math.floor((thisDate - firstDate) / 7) + 1;
  }
  addDays(num = 1): EpiDate {
    return EpiDate.fromIndex(this.getIndex() + num);
  }
  addWeeks(num = 1): EpiDate {
    return EpiDate.fromIndex(this.getIndex() + 7 * num);
  }
  addMonths(num = 1): EpiDate {
    num = Math.floor(num);
    let y = this.getYear();
    let m = this.getMonth();
    const sign = num >= 0 ? +1 : -1;
    num *= sign;
    const yy = Math.floor(num / 12);
    const mm = num % 12;
    y += sign * yy;
    m += sign * mm;
    if (m > 12) {
      m -= 12;
      y++;
    }
    if (m < 1) {
      m += 12;
      y--;
    }
    return new EpiDate(y, m, 1);
  }
  addYears(num = 1): EpiDate {
    return new EpiDate(this.getYear() + num, 1, 1);
  }

  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
  static parse(value: string): EpiDate {
    const str = '' + value;
    let y: number, m: number, d: number;
    if (str.length === 8) {
      y = Number.parseInt(str.substring(0, 4), 10);
      m = Number.parseInt(str.substring(4, 6), 10);
      d = Number.parseInt(str.substring(6, 8), 10);
    } else if (str.length === 10) {
      y = Number.parseInt(str.substring(0, 4), 10);
      m = Number.parseInt(str.substring(5, 7), 10);
      d = Number.parseInt(str.substring(8, 10), 10);
    } else {
      throw new Error(`unknown date format (try YYYYMMDD): ${str}`);
    }
    return new EpiDate(y, m, d);
  }
  static fromIndex(index: number): EpiDate {
    const CUMULATIVE_DAYS_PER_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const x = index;
    let year = Math.floor(index / 365);
    index = index % 365;
    const leaps = Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
    index = index - leaps + year * 365;
    year = Math.floor(index / 365) + 1;
    const y = (year + 399) % 400;
    let yearOffset =
      Math.floor((year - 1) / 400) * 146097 + y * 365 + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
    if (x - yearOffset == 365 && EpiDate.isLeapYear(year + 1)) {
      ++year;
      yearOffset += 365;
    }
    index = x - yearOffset;
    let m = 1;
    const leap = EpiDate.isLeapYear(year) ? 1 : 0;
    while (m < 12 && CUMULATIVE_DAYS_PER_MONTH[m] + (m >= 2 ? leap : 0) <= index) {
      ++m;
    }
    index -= CUMULATIVE_DAYS_PER_MONTH[m - 1] + (m > 2 && EpiDate.isLeapYear(year) ? 1 : 0);
    return new EpiDate(year, m, index + 1);
  }
  static fromEpiweek(year: number, week: number): EpiDate {
    if (week < 1 || week > 54) {
      throw new Error(`invalid epiweek year=${year}, week=${week}`);
    }
    let date = new EpiDate(year, 6, 1);
    while (date.getEpiYear() < year) {
      date = date.addYears(+1);
    }
    while (date.getEpiYear() > year) {
      date = date.addYears(-1);
    }
    while (date.getEpiWeek() < week) {
      date = date.addWeeks(+1);
    }
    while (date.getEpiWeek() > week) {
      date = date.addWeeks(-1);
    }
    while (date.getDayOfWeek() < 3) {
      date = date.addDays(+1);
    }
    while (date.getDayOfWeek() > 3) {
      date = date.addDays(-1);
    }
    if (date.getEpiYear() !== year || date.getEpiWeek() !== week) {
      // fix for week 53 in years with only 52 weeks
      console.log('warning: invalid epiweek', year, week);
      date = new EpiDate(year, 12, 31);
    }
    return date;
  }

  static getDayName(dayOfWeek: number, longName = true): string {
    const DAY_NAMES_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (longName) {
      return DAY_NAMES_LONG[dayOfWeek];
    }
    return DAY_NAMES_SHORT[dayOfWeek];
  }
  static getMonthName(month: number, longName = true): string {
    const MONTH_NAMES_LONG = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (longName) {
      return MONTH_NAMES_LONG[month - 1];
    } else {
      return MONTH_NAMES_SHORT[month - 1];
    }
  }
}
