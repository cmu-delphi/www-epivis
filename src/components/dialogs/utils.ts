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

export function appendIssueToTitle(title: string, issue: IssueSelection): string {
  if (issue.mode === 'asof') {
    return `${title} (reported: ${Math.floor(issue.param / 100)}w${issue.param % 100})`;
  } else if (issue.mode === 'lag') {
    return `${title} (lagged ${issue.param} week${issue.param != 1 ? 's' : ''})`;
  }
  return title;
}
