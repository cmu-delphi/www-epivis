export function randomId(): string {
  return 'd' + Math.random().toString(36).slice(0, 4);
}

export interface IssueSelection {
  mode: 'recent' | 'asof' | 'lag';
  param: number;
}

export const DEFAULT_ISSUE: IssueSelection = {
  mode: 'recent',
  param: 0,
};