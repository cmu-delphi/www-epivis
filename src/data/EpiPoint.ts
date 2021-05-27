import type EpiDate from './EpiDate';

export default class EpiPoint {
  constructor(private readonly date: EpiDate, private readonly value: number) {}
  getDate(): EpiDate {
    return this.date;
  }
  getValue(): number {
    return this.value;
  }
}
