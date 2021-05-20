export enum NavMode {
  pan = 0,
  crop = 1,
  zoom = 2,
}

export enum Align {
  left = 0,
  right = 1,
  bottom = 2,
  top = 3,
  center = 4,
}

export interface IBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function isTouchEvent(e: MouseEvent | TouchEvent): e is TouchEvent {
  return e.type.toLowerCase().indexOf('touch') === 0;
}

export function zeroPad(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}

export function contains(box: IBox, point: { x: number; y: number }): boolean {
  return box.x <= point.x && point.x <= box.x + box.w && box.y < point.y && point.y < box.y + box.h;
}
