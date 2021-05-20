export function randomId(): string {
  return 'd' + Math.random().toString(36).slice(0, 4);
}
