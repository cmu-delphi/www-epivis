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
export function ratioInversed(values: number[]): number {
  const a = values[1];
  const b = values[0];
  return b == 0 ? 0 : a / b;
}
export function scale(factor: number): (values: number[]) => number {
  return (values) => values[0] * factor;
}
export function iliplus(values: number[]): number {
  return (values[0] * values[1]) / 100;
}
