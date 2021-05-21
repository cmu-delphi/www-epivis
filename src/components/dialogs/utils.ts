export function randomId(): string {
  return 'd' + Math.random().toString(36).substr(2, 9);
}

export interface IssueSelection {
  issues?: number | null;
  lag?: number | null;
}

export const DEFAULT_ISSUE: IssueSelection = {};

export function appendIssueToTitle(title: string, issue: IssueSelection): string {
  if (issue.issues != null) {
    return `${title} (reported: ${Math.floor(issue.issues / 100)}w${issue.issues % 100})`;
  } else if (issue.lag != null) {
    return `${title} (lagged ${issue.lag} week${issue.lag != 1 ? 's' : ''})`;
  }
  return title;
}
