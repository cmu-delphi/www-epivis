import UIkit from 'uikit';
import DataSet, { DataGroup } from '../data/DataSet';
import EpiDate from '../data/EpiDate';
import EpiPoint from '../data/EpiPoint';

// import DataSet from "../data/DataSet";
// import EpiDate from "../data/EpiDate";
// import EpiPoint from "../data/EpiPoint";

export function epiRange(from: string | number, to: string | number): string {
  return `${from}-${to}`;
}

// find the current epiweek and date
const date = new Date();
const epidate = new EpiDate(date.getFullYear() + 1900, date.getMonth() + 1, date.getDate());
export const currentEpiWeek = epidate.getEpiYear() * 100 + epidate.getEpiWeek();
export const currentDate = epidate.getYear() * 10000 + epidate.getMonth() * 100 + epidate.getDay();

declare const process: { env: Record<string, string> };
const ENDPOINT = process.env.EPIDATA_ENDPOINT_URL;

export const fetchOptions: RequestInit = process.env.NODE_ENV === 'development' ? { cache: 'force-cache' } : {};

export function fetchImpl<T>(url: URL): Promise<T> {
  const urlGetS = url.toString();
  if (urlGetS.length < 4096) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fetch(url.toString(), fetchOptions).then((d) => d.json());
  }
  const params = new URLSearchParams(url.searchParams);
  url.searchParams.forEach((d) => url.searchParams.delete(d));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return fetch(url.toString(), {
    ...fetchOptions,
    method: 'POST',
    body: params,
  }).then((d) => d.json());
}

// generic epidata loader
function loadEpidata(
  name: string,
  epidata: Record<string, unknown>[],
  columns: string[],
  params: Record<string, unknown>,
): DataGroup {
  const datasets: DataSet[] = [];

  for (const col of columns) {
    const points: EpiPoint[] = [];
    for (const row of epidata) {
      if (row != null && typeof row.time_value === 'number') {
        const timeValue = row.time_value;
        if (timeValue.toString().length == 6) {
          row.epiweek = timeValue;
        } else {
          row.date = timeValue.toString();
        }
      }
      let date: EpiDate;
      if (row != null && (typeof row.date === 'string' || typeof row.date === 'number')) {
        date = EpiDate.parse(row.date.toString());
      } else if (row != null && typeof row.epiweek === 'number') {
        const year = Math.floor(row.epiweek / 100);
        const week = row.epiweek % 100;
        date = EpiDate.fromEpiweek(year, week);
      } else {
        throw new Error(`missing date/week column in response`);
      }
      points.push(new EpiPoint(date, row[col] as number));
    }
    datasets.push(new DataSet(points, col, params));
  }
  return new DataGroup(name, datasets);
}

function cleanParams(params: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      clean[key] = value;
    }
  });
  return clean;
}

export function loadDataSet(
  title: string,
  endpoint: string,
  fixedParams: Record<string, unknown>,
  userParams: Record<string, unknown>,
  columns: string[],
): Promise<DataGroup | null> {
  const url = new URL(ENDPOINT + `/${endpoint}/`);
  const params = cleanParams(userParams);
  Object.entries(fixedParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  url.searchParams.set('format', 'json');
  return fetchImpl<Record<string, unknown>[]>(url)
    .then((res) => {
      return loadEpidata(title, res, columns, params);
    })
    .catch((error) => {
      console.warn('failed fetching data', error);
      return UIkit.modal
        .alert(
          `
      <div class="uk-alert uk-alert-error">
        Failed to fetch API data from <a href="${url.href}">API Link</a>.
      </div>`,
        )
        .then(() => null);
    });
}

export function fetchCOVIDcastMeta(): Promise<{ geo_type: string; signal: string; data_source: string }[]> {
  const url = new URL(ENDPOINT + `/covidcast_meta/`);
  url.searchParams.set('format', 'json');
  return fetchImpl<{ geo_type: string; signal: string; data_source: string }[]>(url).catch((error) => {
    console.warn('failed fetching data', error);
    return [];
  });
}
