export function randomId(): string {
  return 'd' + Math.random().toString(36).slice(0, 4);
}

export interface IssueSelection {
  issue?: number | null;
  lag?: number | null;
}

export const DEFAULT_ISSUE: IssueSelection = {};

export function appendIssueToTitle(title: string, issue: IssueSelection): string {
  if (issue.issue != null) {
    return `${title} (reported: ${Math.floor(issue.issue / 100)}w${issue.issue % 100})`;
  } else if (issue.lag != null) {
    return `${title} (lagged ${issue.lag} week${issue.lag != 1 ? 's' : ''})`;
  }
  return title;
}
