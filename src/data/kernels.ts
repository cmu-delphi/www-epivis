import DataSet from './DataSet';
import type EpiDate from './EpiDate';
import EpiPoint from './EpiPoint';

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}
export function product(values: number[]): number {
  return values.reduce((acc, v) => acc * v, 1);
}
export function average(values: number[]): number {
  return sum(values) / values.length;
}
export function ratio(values: number[]): number {
  const a = values[0];
  const b = values[1];
  return b == 0 ? 0 : a / b;
}
export function scale(factor: number, values: number[]): number {
  return values[0] * factor;
}
export function iliplus(values: number[]): number {
  return (values[0] * values[1]) / 100;
}

export function mergeDataSets(name: string, datasets: DataSet[], kernel: (vs: number[]) => number): DataSet | null {
  if (datasets.length === 0) {
    return null;
  }
  if (datasets.length === 1) {
    const ds = datasets[0];
    const data = ds.data.map((d) => new EpiPoint(d.getDate(), kernel([d.getValue()])));
    return new DataSet(data, name);
  }

  // find the union of dates
  const byDate = new Map<number, { date: EpiDate; vs: number[] }>();

  const l = datasets.length;

  datasets.forEach((ds, i) => {
    for (const point of ds.data) {
      const d = point.getDate().getIndex();
      const entry = byDate.get(d);
      if (entry) {
        entry.vs[i] = point.getValue();
      } else {
        // create a new full entry
        const vs = Array(l).map(() => Number.NaN);
        vs[i] = point.getValue();
        byDate.set(d, { date: point.getDate(), vs });
      }
    }
  });

  const data = Array.from(byDate.values(), (entry) => {
    return new EpiPoint(entry.date, kernel(entry.vs));
  }).sort((a, b) => a.getDate().compare(b.getDate()));

  return new DataSet(data, name);
}
