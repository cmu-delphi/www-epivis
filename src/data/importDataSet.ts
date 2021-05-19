import { csvParseRows } from 'd3-dsv';
import EpiDate from './EpiDate';
import { parse } from 'date-fns';
import DataSet, { DataGroup } from './DataSet';
import EpiPoint from './EpiPoint';

// var DateType = {
//   Simple: 0,
//   Epi: 1,
//   Decimal: 2,
//   Monthly: 3,
//   Epiweek: 4,
// };
export interface CSVOptions {
  transpose: boolean;
  hasHeader: boolean;
  dataType: 'simple' | 'epiweek' | 'epi' | 'decimal' | 'monthly' | 0 | 1 | 2 | 3 | 4 | null;
  dateCol1: number;
  dateCol2: number;
  dateFormat: string;
  hasGroup: boolean;
  groupColumn: number;
}

export default function importDataSet(file: File, fileContent: string, options: CSVOptions): DataGroup {
  let lines = '';
  for (const row of fileContent.split('\n')) {
    const trimmed = row.trim();
    if (trimmed[0] === '#') {
      continue;
    }
    lines += trimmed;
  }
  let rows = csvParseRows(lines);
  let numColumns = rows.reduce((acc, v) => Math.max(acc, v.length), 0);
  if (options.transpose) {
    numColumns = rows.length;
    rows = transpose(rows, numColumns);
  }

  let labels = Array(numColumns).map((_, i) => `Column ${i}`);

  let groups: { label: string; level: number; rows: string[][] }[] = [{ label: file.name, level: 0, rows: [] }];
  let activeGroup = groups[0];
  groups.push(activeGroup);

  let foundHeader = false;
  for (const row of rows) {
    if (row.length === numColumns) {
      // valid row
      if (options.hasHeader && !foundHeader) {
        labels = row;
        foundHeader = true;
      } else {
        // value row
        activeGroup.rows.push(row);
      }
    } else if (row.length === 1 && row[0].startsWith('+')) {
      // push group
      const level = row[0].lastIndexOf('+');
      activeGroup = {
        label: row[0].slice(0, level + 1),
        level: level + 1,
        rows: [],
      };
      groups.push(activeGroup);
    } else {
      // ignore
    }
  }

  if (options.hasGroup && groups.length === 1) {
    // for each group split into subgroups based on dataset
    groups = groups.map((group) => splitGroup(group.rows, group.label, group.level, options.groupColumn)).flat();
  }

  // parse each group
  if (groups.length === 1) {
    return parseGroup(file.name, 0, activeGroup.rows, options, labels);
  }
  const root: DataGroup = {
    title: file.name,
    level: 0,
    datasets: [],
  };
  let active = root;
  for (const group of groups) {
    const parsed = parseGroup(group.label, group.level, group.rows, options, labels);
    if (group.level > active.level) {
      // child
      active.datasets.push(parsed);
      parsed.parent = active;
      active = parsed;
      continue;
    }
    // multiple levels up
    while (group.level < active.level) {
      active = active.parent!;
    }
    // sibling
    active.parent!.datasets.push(parsed);
    parsed.parent = active.parent!;
    active = parsed;
  }
  return root;
}

function parseGroup(title: string, level: number, rows: string[][], options: CSVOptions, labels: string[]): DataGroup {
  const dates = rows.map((row, i) => parseDate(row, i, options));
  const datasets: DataSet[] = [];
  labels.forEach((label, i) => {
    if (isDateColumn(i, options)) {
      return;
    }
    const data = rows.map((row, j) => {
      const v = Number.parseFloat(row[i]);
      return new EpiPoint(dates[j]!, Number.isNaN(v) ? 0 : v);
    });
    datasets.push(new DataSet(data, label));
  });
  return { title, level, datasets };
}

function splitGroup(rows: string[][], prefix: string, level: number, groupColumn: number) {
  if (rows.length === 0) {
    return [];
  }
  const r: { label: string; level: number; rows: string[][] }[] = [
    {
      label: prefix + String(rows[0][groupColumn]),
      level,
      rows: [],
    },
  ];
  let active = r[0];
  for (const row of rows) {
    const group = prefix + String(row[groupColumn]);
    if (group != active.label) {
      r.push({
        label: group,
        level,
        rows: [row],
      });
      active = r[r.length - 1];
    } else {
      active.rows.push(row);
    }
  }
  return r;
}

function isDateColumn(column: number, options: CSVOptions) {
  if (options.dataType == null) {
    return false;
  }
  if (column === options.dateCol1) {
    return true;
  }
  if (
    options.dataType === 'epi' ||
    options.dataType === 1 ||
    options.dataType === 'monthly' ||
    options.dataType === 3
  ) {
    return column == options.dateCol2;
  }
  return false;
}

function parseDate(values: string[], lineIndex: number, options: CSVOptions): EpiDate | null {
  try {
    if (options.dataType === 'simple' || options.dataType === 0) {
      const m = parse(values[options.dateCol1], options.dateFormat, new Date());
      return new EpiDate(m.getFullYear(), m.getMonth() + 1, m.getDate());
    }
    if (options.dataType === 'epiweek' || options.dataType === 4) {
      const ew = Number.parseInt(values[options.dateCol1], 10);
      const year = Math.floor(ew / 100);
      const week = ew % 100;
      return EpiDate.fromEpiweek(year, week);
    }
    if (options.dataType === 'epi' || options.dataType === 1) {
      const year = Number.parseInt(values[options.dateCol1], 10);
      const week = Number.parseInt(values[options.dateCol2], 10);
      return EpiDate.fromEpiweek(year, week);
    }
    if (options.dataType === 'decimal' || options.dataType === 2) {
      const y = Number.parseFloat(values[options.dateCol1]);
      const year = Math.floor(y);
      const days = Math.floor((y - year) * 365.25);
      return new EpiDate(year, 1, 1).addDays(days);
    }
    if (options.dataType === 'monthly' || options.dataType === 3) {
      const year = Number.parseInt(values[options.dateCol1], 10);
      const month = Number.parseInt(values[options.dateCol2], 10);
      return new EpiDate(year, month, 15);
    }
    return new EpiDate(2000, 1, 1).addDays(lineIndex);
  } catch (error) {
    console.error('invalid date in row', values, options);
    return null;
  }
}

function transpose(rows: string[][], numColumns: number) {
  const transposedRows: string[][] = [];
  for (let i = 0; i < numColumns; i++) {
    const row: string[] = rows.map((row) => row[i]);
    transposedRows.push(row);
  }
  return transposedRows;
}
