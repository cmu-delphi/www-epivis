import { mean } from 'd3-array';
import EpiDate from './EpiDate';
import EpiPoint from './EpiPoint';

function getRandomColor() {
  function channel() {
    const x = 0x20 + Math.floor(Math.random() * 0xc0);
    return ('0' + x.toString(16)).slice(-2);
  }
  return '#' + channel() + channel() + channel();
}

function computeGap(data: readonly EpiPoint[]): number {
  // median gap distance
  const gaps = data.slice(1).map((a, i) => a.getDate().getIndex() - data[i].getDate().getIndex());
  gaps.sort((a, b) => a - b);
  return gaps.length > 0 ? gaps[Math.floor(gaps.length / 2)] : 1;
}

export default class DataSet {
  public color: string = getRandomColor();
  public readonly lineWidth = 2;
  public scale = 1;
  public verticalOffset = 0;
  public horizontalOffset = 0;
  public readonly gap: number;

  constructor(
    public readonly data: readonly EpiPoint[],
    public readonly title = '',
    public readonly params: Record<string, unknown> | null = null,
  ) {
    this.gap = computeGap(data);
  }

  randomize(): void {
    this.color = getRandomColor();
  }
  reset(): void {
    this.scale = 1;
    this.verticalOffset = 0;
    this.horizontalOffset = 0;
  }

  scaleMean(): void {
    const dataMean = mean(this.data, (d) => d.getValue());
    if (dataMean != null && dataMean > 0) {
      this.scaleAndShift(1 / dataMean, 0);
    }
  }
  scaleAndShift(scale: number, shift = 0): void {
    this.scale = scale;
    this.verticalOffset = shift;
  }
  getDataHash(): Map<string, number> {
    const dataHash = new Map<string, number>();
    for (const point of this.data) {
      if (!Number.isNaN(point.getValue())) {
        dataHash.set(point.getDate().toString(), point.getValue());
      }
    }
    return dataHash;
  }

  getPointValue(index: number): number {
    const temp = this.data[index].getValue();
    if (Number.isNaN(temp)) {
      return temp;
    }
    return this.verticalOffset + temp * this.scale;
  }

  regress(dataset: DataSet): void {
    const datahash = dataset.getDataHash();
    const x: number[] = [];
    const y: number[] = [];
    for (const point of this.data) {
      const value = point.getValue();
      const other = datahash.get(point.getDate().toString());
      if (!Number.isNaN(value) && other != null && !Number.isNaN(other)) {
        x.push(value);
        y.push(other);
      }
    }
    if (x.length === 0 || y.length === 0) {
      return;
    }
    // Run regression
    const x_avg = mean(x)!;
    const y_avg = mean(y)!;
    let cov_sum = 0;
    let x_var_sum = 0;
    for (let i = 0; i < x.length; i++) {
      cov_sum += x[i] * y[i] - x_avg * y_avg;
      x_var_sum += Math.pow(x[i], 2) - Math.pow(x_avg, 2);
    }
    const beta = cov_sum / x_var_sum;
    const alpha = y_avg - beta * x_avg;
    this.scaleAndShift(beta * dataset.scale, alpha * dataset.scale);
  }
}

export const SAMPLE_DATASET: DataSet = ((): DataSet => {
  // initial dataset, just for fun
  const data = new Array<EpiPoint>(365);
  const now = new Date();
  const baseIndex = new EpiDate(now.getFullYear(), now.getMonth() + 1, now.getDate()).getIndex() - 182;
  for (let i = 0; i < data.length; i++) {
    const x = 6 - (12 * i) / (data.length - 1);
    const xp = x * Math.PI;
    const v = x === 0 ? 1 : Math.sin(xp) / xp;
    data[i] = new EpiPoint(EpiDate.fromIndex(baseIndex + i), v);
  }
  const ds = new DataSet(data, 'EpiVis Sample');

  //sampleDataset.lineWidth = 5;
  //sampleDataset.color = '#dd3311';
  return ds;
})();

export class DataGroup {
  constructor(
    public readonly title: string,
    public readonly level: number,
    public readonly datasets: (DataSet | DataGroup)[],
  ) {}

  flat(arr: DataSet[]): void {
    for (const child of this.datasets) {
      if (child instanceof DataSet) {
        arr.push(child);
      } else {
        child.flat(arr);
      }
    }
  }
}

export const DEFAULT_GROUP: DataGroup = new DataGroup('All Datasets', 0, [SAMPLE_DATASET]);

export function flatten(dataset: DataSet | DataGroup): DataSet[] {
  if (dataset instanceof DataSet) {
    return [dataset];
  }
  const arr: DataSet[] = [];
  dataset.flat(arr);
  return arr;
}
