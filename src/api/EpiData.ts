import UIkit from 'uikit';
import { appendIssueToTitle } from '../components/dialogs/utils';
import {
  cdcLocations,
  covidHospLocations,
  firstDate,
  firstEpiWeek,
  fluSurvRegions,
  fluViewRegions,
  gftLocations,
  ghtLocations,
  nidssDenqueLocations,
  nidssFluLocations,
  nowcastLocations,
  quidelLocations,
  sensorLocations,
  sensorNames,
  twitterLocations,
  wikiArticles,
} from '../data/data';
import DataSet, { DataGroup } from '../data/DataSet';
import EpiDate from '../data/EpiDate';
import EpiPoint from '../data/EpiPoint';
import { get } from 'svelte/store';
import { expandedDataGroups } from '../store';

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
    if (value != null && value !== '' && !key.startsWith('_')) {
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
  api_key = '',
): Promise<DataGroup | null> {
  const duplicates = get(expandedDataGroups).filter((d) => d.title == title);
  if (duplicates.length > 0) {
    return UIkit.modal
      .alert(
        `
    <div class="uk-alert uk-alert-error">
      Cannot import duplicate dataset: <b>${title}.</b>
    </div>`,
      )
      .then(() => null);
  }
  let url_string = ENDPOINT + `/${endpoint}/`;
  if (api_key !== '') {
    url_string += `?api_key=${api_key}`;
  }
  const url = new URL(url_string);
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
      return loadEpidata(title, res, columns, { _endpoint: endpoint, ...params });
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

export function fetchCOVIDcastMeta(
  api_key = '',
): Promise<{ geo_type: string; signal: string; data_source: string; time_type?: string }[]> {
  let url_string = ENDPOINT + `/covidcast_meta/`;
  if (api_key !== '') {
    url_string += `?api_key=${api_key}`;
  }
  const url = new URL(url_string);
  url.searchParams.set('format', 'json');
  return fetchImpl<{ geo_type: string; signal: string; data_source: string; time_type?: string }[]>(url).catch(
    (error) => {
      console.warn('failed fetching data', error);
      return [];
    },
  );
}

export function importCDC({ locations, auth }: { locations: string; auth?: string }): Promise<DataGroup | null> {
  const regionLabel = cdcLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] CDC Page Hits: ${regionLabel}`;
  return loadDataSet(
    title,
    'cdc',
    {
      epiweeks: epiRange(firstEpiWeek.cdc, currentEpiWeek),
    },
    { auth, locations },
    ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'],
  );
}

export function importCOVIDcast({
  data_source,
  geo_type,
  geo_value,
  signal,
  time_type = 'day',
  api_key,
}: {
  data_source: string;
  signal: string;
  time_type?: string;
  geo_type: string;
  geo_value: string;
  api_key: string;
}): Promise<DataGroup | null> {
  const title = `[API] COVIDcast: ${data_source}:${signal} (${geo_type}:${geo_value})`;
  return loadDataSet(
    title,
    'covidcast',
    {
      time_type: time_type,
      time_values:
        time_type === 'day'
          ? epiRange(firstDate.covidcast, currentDate)
          : epiRange(firstEpiWeek.covidcast, currentEpiWeek),
    },
    { data_source, signal, time_type, geo_type, geo_value },
    ['value', 'stderr', 'sample_size'],
    api_key,
  );
}

export function importCOVIDHosp({
  states,
  issues,
}: {
  states: string;
  issues?: number | null;
}): Promise<DataGroup | null> {
  const regionLabel = covidHospLocations.find((d) => d.value === states)?.label ?? '?';
  let title = `[API] COVID Hospitalization: ${regionLabel}`;
  if (issues != null) {
    title += ` (issued on: ${issues})`;
  } else {
    title += ' (most recent issue)';
  }
  return loadDataSet(
    title,
    'covid_hosp_state_timeseries',
    {
      dates: epiRange(firstDate.covid_hosp, currentDate),
    },
    { states, issues },
    [
      'hospital_onset_covid',
      'hospital_onset_covid_coverage',
      'inpatient_beds',
      'inpatient_beds_coverage',
      'inpatient_beds_used',
      'inpatient_beds_used_coverage',
      'inpatient_beds_used_covid',
      'inpatient_beds_used_covid_coverage',
      'previous_day_admission_adult_covid_confirmed',
      'previous_day_admission_adult_covid_confirmed_coverage',
      'previous_day_admission_adult_covid_suspected',
      'previous_day_admission_adult_covid_suspected_coverage',
      'previous_day_admission_pediatric_covid_confirmed',
      'previous_day_admission_pediatric_covid_confirmed_coverage',
      'previous_day_admission_pediatric_covid_suspected',
      'previous_day_admission_pediatric_covid_suspected_coverage',
      'staffed_adult_icu_bed_occupancy',
      'staffed_adult_icu_bed_occupancy_coverage',
      'staffed_icu_adult_patients_confirmed_suspected_covid',
      'staffed_icu_adult_patients_confirmed_suspected_covid_coverage',
      'staffed_icu_adult_patients_confirmed_covid',
      'staffed_icu_adult_patients_confirmed_covid_coverage',
      'total_adult_patients_hosp_confirmed_suspected_covid',
      'total_adult_patients_hosp_confirmed_suspected_covid_coverage',
      'total_adult_patients_hosp_confirmed_covid',
      'total_adult_patients_hosp_confirmed_covid_coverage',
      'total_pediatric_patients_hosp_confirmed_suspected_covid',
      'total_pediatric_patients_hosp_confirmed_suspected_covid_coverage',
      'total_pediatric_patients_hosp_confirmed_covid',
      'total_pediatric_patients_hosp_confirmed_covid_coverage',
      'total_staffed_adult_icu_beds',
      'total_staffed_adult_icu_beds_coverage',
      'inpatient_beds_utilization',
      'inpatient_beds_utilization_coverage',
      'inpatient_beds_utilization_numerator',
      'inpatient_beds_utilization_denominator',
      'percent_of_inpatients_with_covid',
      'percent_of_inpatients_with_covid_coverage',
      'percent_of_inpatients_with_covid_numerator',
      'percent_of_inpatients_with_covid_denominator',
      'inpatient_bed_covid_utilization',
      'inpatient_bed_covid_utilization_coverage',
      'inpatient_bed_covid_utilization_numerator',
      'inpatient_bed_covid_utilization_denominator',
      'adult_icu_bed_covid_utilization',
      'adult_icu_bed_covid_utilization_coverage',
      'adult_icu_bed_covid_utilization_numerator',
      'adult_icu_bed_covid_utilization_denominator',
      'adult_icu_bed_utilization',
      'adult_icu_bed_utilization_coverage',
      'adult_icu_bed_utilization_numerator',
      'adult_icu_bed_utilization_denominator',
    ],
  );
}

export function importFluSurv({
  locations,
  issues,
  lag,
}: {
  locations: string;
  issues?: number | null;
  lag?: number | null;
}): Promise<DataGroup | null> {
  const regionLabel = fluSurvRegions.find((d) => d.value === locations)?.label ?? '?';
  const title = appendIssueToTitle(`[API] FluSurv: ${regionLabel}`, { issues, lag });
  return loadDataSet(
    title,
    'flusurv',
    {
      epiweeks: epiRange(firstEpiWeek.flusurv, currentEpiWeek),
    },
    { locations, issues, lag },
    ['rate_age_0', 'rate_age_1', 'rate_age_2', 'rate_age_3', 'rate_age_4', 'rate_overall'],
  );
}

export function importFluView({
  regions,
  issues,
  lag,
  auth,
}: {
  regions: string;
  issues?: number | null;
  lag?: number | null;
  auth?: string;
}): Promise<DataGroup | null> {
  const regionLabel = fluViewRegions.find((d) => d.value === regions)?.label ?? '?';
  const title = appendIssueToTitle(`[API] FluView: ${regionLabel}`, { issues, lag });
  return loadDataSet(
    title,
    'fluview',
    {
      epiweeks: epiRange(firstEpiWeek.fluview, currentEpiWeek),
    },
    { regions, issues, lag, auth },
    [
      'wili',
      'ili',
      'num_ili',
      'num_patients',
      'num_providers',
      'num_age_0',
      'num_age_1',
      'num_age_2',
      'num_age_3',
      'num_age_4',
      'num_age_5',
    ],
  );
}

export function importGFT({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = gftLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] GFT: ${regionLabel}`;
  return loadDataSet(
    title,
    'gft',
    {
      epiweeks: epiRange(firstEpiWeek.gft, currentEpiWeek),
    },
    { locations },
    ['num'],
  );
}

export function importGHT({
  auth,
  locations,
  query,
}: {
  auth: string;
  locations: string;
  query: string;
}): Promise<DataGroup | null> {
  const regionLabel = ghtLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] GHT: ${regionLabel} [${query}]`;
  return loadDataSet(
    title,
    'ght',
    {
      epiweeks: epiRange(firstEpiWeek.ght, currentEpiWeek),
    },
    { auth, locations, query },
    ['value'],
  );
}

export function importNIDSSDenque({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = nidssDenqueLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] NIDSS-Denque: ${regionLabel}`;
  return loadDataSet(
    title,
    'nidss_dengue',
    {
      epiweeks: epiRange(firstEpiWeek.nidss_dengue, currentEpiWeek),
    },
    { locations },
    ['count'],
  );
}
export function importNIDSSFlu({
  regions,
  issues,
  lag,
}: {
  regions: string;
  issues?: number | null;
  lag?: number | null;
}): Promise<DataGroup | null> {
  const regionLabel = nidssFluLocations.find((d) => d.value === regions)?.label ?? '?';
  const title = appendIssueToTitle(`[API] NIDSS-influenza: ${regionLabel}`, { issues, lag });
  return loadDataSet(
    title,
    'nidss_flu',
    {
      epiweeks: epiRange(firstEpiWeek.nidss_flu, currentEpiWeek),
    },
    { regions, issues, lag },
    ['visits', 'ili'],
  );
}
export function importNowcast({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = nowcastLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] Delphi Nowcast: ${regionLabel}`;
  return loadDataSet(
    title,
    'nowcast',
    {
      epiweeks: epiRange(firstEpiWeek.nowcast, currentEpiWeek),
    },
    { locations },
    ['value', 'std'],
  );
}
export function importQuidel({ auth, locations }: { auth: string; locations: string }): Promise<DataGroup | null> {
  const regionLabel = quidelLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] Quidel Data: ${regionLabel}`;
  return loadDataSet(
    title,
    'quidel',
    {
      epiweeks: epiRange(firstEpiWeek.quidel, currentEpiWeek),
    },
    { auth, locations },
    ['value'],
  );
}
export function importSensors({
  auth,
  names,
  locations,
}: {
  auth: string;
  names: string;
  locations: string;
}): Promise<DataGroup | null> {
  const regionLabel = sensorLocations.find((d) => d.value === locations)?.label ?? '?';
  const namesLabel = sensorNames.find((d) => d.value === names)?.label ?? '?';
  const title = `[API] Delphi Sensor: ${namesLabel}: ${regionLabel}`;
  return loadDataSet(
    title,
    'sensors',
    {
      epiweeks: epiRange(firstEpiWeek.sensors, currentEpiWeek),
    },
    { auth, names, locations },
    ['value'],
  );
}
// twtr
export function importTwitter({
  auth,
  locations,
  resolution,
}: {
  auth: string;
  locations: string;
  resolution: 'daily' | 'weekly';
}): Promise<DataGroup | null> {
  const regionLabel = twitterLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] Twitter: ${regionLabel}, ${resolution[0].toUpperCase()}${resolution.slice(1)}`;
  return loadDataSet(
    title,
    'twitter',
    resolution === 'daily'
      ? {
          dates: epiRange(firstDate.twitter, currentDate),
        }
      : {
          epiweeks: epiRange(firstEpiWeek.twitter, currentEpiWeek),
        },
    { auth, locations, resolution },
    ['num', 'total', 'percent'],
  );
}
export function importWiki({
  articles,
  resolution,
  hour,
  language = 'en',
}: {
  articles: string;
  resolution: 'daily' | 'weekly';
  hour?: number | null;
  language?: string;
}): Promise<DataGroup | null> {
  const articleLabel = wikiArticles.find((d) => d.value === articles)?.label ?? '?';
  let title = `[API] Wiki: ${articleLabel}, ${resolution[0].toUpperCase()}${resolution.slice(1)}`;
  if (hour != null) {
    title += ` (${hour})`;
  }
  return loadDataSet(
    title,
    'wiki',
    resolution === 'daily'
      ? {
          dates: epiRange(firstDate.wiki, currentDate),
        }
      : {
          epiweeks: epiRange(firstEpiWeek.wiki, currentEpiWeek),
        },
    { articles, hour, language, resolution },
    ['count', 'total', 'value'],
  );
}
