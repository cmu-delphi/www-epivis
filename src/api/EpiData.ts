/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
  nidssDengueLocations,
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
import { apiKey, expandedDataGroups, storeApiKeys } from '../store';

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

function processResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.json();
  }
  return response.text().then((text) => {
    throw new Error(`[${response.status}] ${text}`);
  });
}

export function fetchImpl<T>(url: URL): Promise<T> {
  const urlGetS = url.toString();
  if (urlGetS.length < 4096) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fetch(url.toString(), fetchOptions).then((d) => {
      return processResponse(d);
    });
  }
  const params = new URLSearchParams(url.searchParams);
  url.searchParams.forEach((d) => url.searchParams.delete(d));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return fetch(url.toString(), {
    ...fetchOptions,
    method: 'POST',
    body: params,
  }).then((d) => {
    return processResponse(d);
  });
}

// generic epidata loader
function loadEpidata(
  name: string,
  epidata: Record<string, unknown>[],
  columns: string[],
  columnRenamings: Record<string, string>,
  params: Record<string, unknown>,
): DataGroup {
  const datasets: DataSet[] = [];
  const colRenamings = new Map(Object.entries(columnRenamings));

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
    if (points.length > 0) {
      // overwrite default column name if there's an overwrite in columnRenamings
      const title = colRenamings.has(col) ? colRenamings.get(col) : col;
      datasets.push(new DataSet(points, title, params));
    }
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
  columnRenamings: Record<string, string> = {},
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
      try {
        const data = loadEpidata(title, res, columns, columnRenamings, { _endpoint: endpoint, ...params });
        if (data.datasets.length == 0) {
          return UIkit.modal
            .alert(
              `
        <div class="uk-alert uk-alert-error">
          <a href="${url.href}">API Link</a> returned no data, which suggests that the API has no available information for the selected location.
        </div>`,
            )
            .then(() => null);
        }
        return data;
      } catch (error) {
        console.warn('failed loading data', error);
        // EpiData API error - JSON with "message" property
        if ('message' in res) {
          return UIkit.modal
            .alert(
              `
          <div class="uk-alert uk-alert-error">
            [f01] Failed to fetch API data from <a href="${url.href}">API Link</a>:<br/><i>${res['message']}</i>
          </div>`,
            )
            .then(() => null);
        }
        // Fallback for generic error
        return UIkit.modal
          .alert(
            `
        <div class="uk-alert uk-alert-error">
          [f02] Failed to fetch API data from <a href="${url.href}">API Link</a>:<br/><i>${error}</i>
        </div>`,
          )
          .then(() => null);
      }
    })
    .catch((error) => {
      console.warn('failed fetching data', error);
      return UIkit.modal
        .alert(
          `
      <div class="uk-alert uk-alert-error">
        [f03] Failed to fetch API data from <a href="${url.href}">API Link</a>:<br/><i>${error}</i>
      </div>`,
        )
        .then(() => null);
    });
}

export function fetchCOVIDcastMeta(
  api_key: string,
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
    { locations },
    ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'],
    auth,
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
  if (!api_key && get(storeApiKeys)) {
    // if no API key was passed to this method, but we have a saved one, use it...
    // this gets around access control and rate limiting when using an epivis "shared"
    // link (an URL-encoded signal list, processed through `deriveLinkDefaults`).
    api_key = get(apiKey);
  }
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
  ).then((ds) => {
    // get inside the Promise and make sure its not null,
    // then enable display of 'value' data
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['value'];
    }
    return ds;
  });
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
  const title = appendIssueToTitle(`[API] ILINet (aka FluView): ${regionLabel}`, { issues, lag });
  return loadDataSet(
    title,
    'fluview',
    {
      epiweeks: epiRange(firstEpiWeek.fluview, currentEpiWeek),
    },
    { regions, issues, lag },
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
    auth,
    {
      wili: '%wILI',
      ili: '%ILI',
    },
  ).then((ds) => {
    // get inside the Promise and make sure its not null,
    // then enable display of 'percent weighted ILI' data
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['%wILI'];
    }
    return ds;
  });
}

export function importFluViewClinical({
  regions,
  issues,
  lag,
}: {
  regions: string;
  issues?: number | null;
  lag?: number | null;
}): Promise<DataGroup | null> {
  const regionLabel = fluViewRegions.find((d) => d.value === regions)?.label ?? '?';
  const title = appendIssueToTitle(`[API] FluView Clinical: ${regionLabel}`, { issues, lag });
  return loadDataSet(
    title,
    'fluview_clinical',
    {
      epiweeks: epiRange(firstEpiWeek.fluview, currentEpiWeek),
    },
    { regions, issues, lag },
    ['total_specimens', 'total_a', 'total_b', 'percent_positive', 'percent_a', 'percent_b'],
  ).then((ds) => {
    // get inside the Promise and make sure its not null,
    // then enable display of 'percent_positive' data
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['percent_positive'];
    }
    return ds;
  });
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
    { locations, query },
    ['value'],
    auth,
  );
}

export function importNIDSSDengue({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = nidssDengueLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] NIDSS-Dengue: ${regionLabel}`;
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
    { locations },
    ['value'],
    auth,
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
    { names, locations },
    ['value'],
    auth,
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
    { locations, resolution },
    ['num', 'total', 'percent'],
    auth,
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
