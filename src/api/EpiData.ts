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
const CAST_API_V5_ENDPOINT = process.env.EPIDATA_CAST_API_V5_ENDPOINT_URL;

export const fetchOptions: RequestInit = process.env.NODE_ENV === 'development' ? { cache: 'force-cache' } : {};

export interface CovidcastMetaSourceEntry {
  version_range: { latest: string; first: string };
  time_value_range: { latest: string; first: string };
  signals: string[];
  geo_types: string[];
}

export type CovidcastMetaResponse = Record<string, CovidcastMetaSourceEntry>;

export type PopHiveExtraKeyValues = Record<string, string[]>;

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
      if (params.source != 'pophive' && params.source != 'nwss') {
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
      } else {
        if (row != null && typeof row.time_value === 'string') {
          points.push(new EpiPoint(EpiDate.parse(row.time_value), row[col] as number));
        } else {
          throw new Error(`missing time_value column in response`);
        }
      }
    }
    points.sort((a, b) => a.getDate().getIndex() - b.getDate().getIndex());
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
  // add additional labels for the error message
  additionalLabels: Record<string, string> = {},
  baseUrl: string = ENDPOINT,
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
  let url_string = baseUrl + `/${endpoint}/`;
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
          <a href="${url.href}">API Link</a> returned no data for ${additionalLabels.titleLabel}, which suggests that the API has no available information for the selected ${additionalLabels.selectionLabel}.
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

export function fetchPopHiveMeta(api_key: string): Promise<CovidcastMetaResponse> {
  let url_string = CAST_API_V5_ENDPOINT + `/metadata/?source=pophive`;
  if (api_key !== '') {
    url_string += `&api_key=${api_key}`;
  }
  const url = new URL(url_string);
  return fetchImpl<CovidcastMetaResponse>(url).catch((error) => {
    console.warn('failed fetching data', error);
    return {} as CovidcastMetaResponse;
  });
}

export function fetchPopHiveExtraKeyValues(api_key: string): Promise<PopHiveExtraKeyValues> {
  let url_string = CAST_API_V5_ENDPOINT + `/metadata/extra_key_values/?source=pophive`;
  if (api_key !== '') {
    url_string += `&api_key=${api_key}`;
  }
  const url = new URL(url_string);
  return fetchImpl<{ extra_key_values: PopHiveExtraKeyValues }>(url)
    .then((res) => res.extra_key_values ?? {})
    .catch((error) => {
      console.warn('failed fetching extra key values', error);
      return {} as PopHiveExtraKeyValues;
    });
}

export function importPopHive({
  signal,
  geo_type,
  geo_value,
  age_group,
  api_key,
}: {
  signal: string;
  geo_type: string;
  geo_value: string;
  age_group: string;
  api_key: string;
}): Promise<DataGroup | null> {
  const title = `[API] PopHive: pophive:${signal} (${geo_type}:${geo_value}, age:${age_group})`;
  if (!api_key && get(storeApiKeys)) {
    api_key = get(apiKey);
  }
  const additionalLabels = {
    titleLabel: 'PopHive (pophive:' + signal + ')',
    selectionLabel: 'location: ' + geo_type + ':' + geo_value,
    dataSourceDocumentationUrl: '',
    dataSourceDescription: '',
  };
  return loadDataSet(
    title,
    'viz',
    {},
    { source: 'pophive', signal, geo_type, geo_value, extra_keys: `age_group:${age_group}` },
    ['value'],
    api_key,
    {},
    additionalLabels,
    CAST_API_V5_ENDPOINT,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['value'];
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}

export function fetchNwssMeta(api_key: string): Promise<CovidcastMetaResponse> {
  let url_string = CAST_API_V5_ENDPOINT + `/metadata/?source=nwss`;
  if (api_key !== '') {
    url_string += `&api_key=${api_key}`;
  }
  const url = new URL(url_string);
  return fetchImpl<CovidcastMetaResponse>(url).catch((error) => {
    console.warn('failed fetching data', error);
    return {} as CovidcastMetaResponse;
  });
}

export function importNwss({
  signal,
  geo_type,
  geo_value,
  pcr_target,
  nwss_source,
  fill_method,
  api_key,
}: {
  signal: string;
  geo_type: string;
  geo_value: string;
  pcr_target: string;
  nwss_source: string;
  fill_method: string;
  api_key: string;
}): Promise<DataGroup | null> {
  const title = `[API] NWSS: nwss:${signal} (${geo_type}:${geo_value})`;
  if (!api_key && get(storeApiKeys)) {
    api_key = get(apiKey);
  }
  const additionalLabels = {
    titleLabel: 'NWSS (nwss:' + signal + ')',
    selectionLabel: 'location: ' + geo_type + ':' + geo_value,
    dataSourceDocumentationUrl: '',
    dataSourceDescription: '',
  };
  return loadDataSet(
    title,
    'viz',
    {},
    {
      source: 'nwss',
      signal,
      geo_type,
      geo_value,
      pcr_target,
      fill_method,
      extra_keys: `nwss_source:${nwss_source}`,
    },
    ['value'],
    api_key,
    {},
    additionalLabels,
    CAST_API_V5_ENDPOINT,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['value'];
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}

export function importCDC({ locations, auth }: { locations: string; auth?: string }): Promise<DataGroup | null> {
  const regionLabel = cdcLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] CDC Page Hits: ${regionLabel}`;
  const additionalLabels = {
    titleLabel: 'CDC Page Hist',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/cdc.html',
    dataSourceDescription:
      'This data source tracks public interest in influenza by counting visits to specific informational pages on the CDC website. Delphi receives server log summaries directly from the CDC, which count page hits for key topics such as ‘Flu Symptoms & Severity’, ‘How Flu Spreads’, and ‘What To Do If You Get Sick’. These counts act as a proxy for information-seeking behavior related to the flu.',
  };
  return loadDataSet(
    title,
    'cdc',
    {
      epiweeks: epiRange(firstEpiWeek.cdc, currentEpiWeek),
    },
    { locations },
    ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'],
    auth,
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'COVIDcast (' + data_source + ':' + signal + ')',
    selectionLabel: 'location: ' + geo_type + ':' + geo_value,
    dataSourceDocumentationUrl: `https://cmu-delphi.github.io/delphi-epidata/api/covidcast-signals/${data_source}.html`,
    dataSourceDescription: `This dataset provides daily COVID-19 case and hospitalization data sourced from the COVIDcast API. The data is aggregated from multiple sources, including public health labs (ILINet) and clinical labs (WHO_NREVSS), to provide a comprehensive view of COVID-19 activity in the United States.`,
  };
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
    {},
    additionalLabels,
  ).then((ds) => {
    // get inside the Promise and make sure its not null,
    // then enable display of 'value' data
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['value'];
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
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
  const additionalLabels = {
    titleLabel: 'COVID Hospitalization',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/covid_hosp.html',
    dataSourceDescription:
      'This dataset provides daily surveys of hospital COVID-19 capacity and patient impact, as reported by US hospitals. Data is acquired from HealthData.gov. It is a mirror of the “COVID-19 Reported Patient Impact and Hospital Capacity by State Timeseries” and “COVID-19 Reported Patient Impact and Hospital Capacity by State” datasets provided by HHS via healthdata.gov. The latter provides more frequent updates, so it is combined with the former to create a single dataset which is as recent as possible.',
  };
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
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'FluSurv',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/flusurv.html',
    dataSourceDescription:
      'This data source provides laboratory-confirmed influenza hospitalization rates from the CDC’s Influenza Hospitalization Surveillance Network (FluSurv-NET). The data includes age-stratified hospitalization rates and rates by race, sex, and flu type, when available.',
  };
  return loadDataSet(
    title,
    'flusurv',
    {
      epiweeks: epiRange(firstEpiWeek.flusurv, currentEpiWeek),
    },
    { locations, issues, lag },
    [
      'rate_age_0',
      'rate_age_1',
      'rate_age_2',
      'rate_age_3',
      'rate_age_4',
      'rate_overall',
      'rate_age_5',
      'rate_age_6',
      'rate_age_7',
      'rate_age_18t29',
      'rate_age_30t39',
      'rate_age_40t49',
      'rate_age_5t11',
      'rate_age_12t17',
      'rate_age_lt18',
      'rate_age_gte18',
      'rate_age_1t4',
      'rate_age_gte75',
      'rate_age_0tlt1',
      'rate_race_white',
      'rate_race_black',
      'rate_race_hisp',
      'rate_race_asian',
      'rate_race_natamer',
      'rate_sex_male',
      'rate_sex_female',
      'rate_flu_a',
      'rate_flu_b',
    ],
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'ILINet (aka FluView)',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/fluview.html',
    dataSourceDescription:
      'The fluview endpoint reports influenza-like illness (ILI) data sourced from the U.S. Outpatient Influenza-like Illness Surveillance Network (ILINet) dashboard. Data is sourced from both ILINet (public health labs) and WHO_NREVSS (clinical labs).',
  };
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
    additionalLabels,
  ).then((ds) => {
    // get inside the Promise and make sure its not null,
    // then enable display of 'percent weighted ILI' data
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['%wILI'];
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
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
  const additionalLabels = {
    titleLabel: 'FluView Clinical',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/fluview_clinical.html',
    dataSourceDescription:
      'This data source provides age-stratified clinical data based on laboratory-confirmed influenza reports from the US FluView dashboard.',
  };
  return loadDataSet(
    title,
    'fluview_clinical',
    {
      epiweeks: epiRange(firstEpiWeek.fluview, currentEpiWeek),
    },
    { regions, issues, lag },
    ['total_specimens', 'total_a', 'total_b', 'percent_positive', 'percent_a', 'percent_b'],
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    // get inside the Promise and make sure its not null,
    // then enable display of 'percent_positive' data
    if (ds instanceof DataGroup) {
      ds.defaultEnabled = ['percent_positive'];
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}

export function importGFT({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = gftLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] GFT: ${regionLabel}`;
  const additionalLabels = {
    titleLabel: 'GFT',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/gft.html',
    dataSourceDescription:
      'This data source provides a historical estimate of influenza activity based on the aggregated volume of search queries related to flu symptoms, treatments, and related topics. The data is sourced from Google Flu Trends (GFT), which used these query volumes to model ILI rates.',
  };
  return loadDataSet(
    title,
    'gft',
    {
      epiweeks: epiRange(firstEpiWeek.gft, currentEpiWeek),
    },
    { locations },
    ['num'],
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'GHT',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/ght.html',
    dataSourceDescription:
      'The ght endpoint provides access to Google Health Trends data, which tracks the aggregated volume of search queries related to specific influenza symptoms and treatments.',
  };
  return loadDataSet(
    title,
    'ght',
    {
      epiweeks: epiRange(firstEpiWeek.ght, currentEpiWeek),
    },
    { locations, query },
    ['value'],
    auth,
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}

export function importNIDSSDengue({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = nidssDengueLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] NIDSS-Dengue: ${regionLabel}`;
  const additionalLabels = {
    titleLabel: 'NIDSS-Dengue',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/nidss_dengue.html',
    dataSourceDescription:
      'This endpoint reports counts of confirmed dengue cases from the Taiwan National Infectious Disease Statistics System (NIDSS) via the Taiwan CDC.',
  };
  return loadDataSet(
    title,
    'nidss_dengue',
    {
      epiweeks: epiRange(firstEpiWeek.nidss_dengue, currentEpiWeek),
    },
    { locations },
    ['count'],
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'NIDSS-influenza',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/nidss_flu.html',
    dataSourceDescription:
      'This endpoint provides weekly influenza case counts for Taiwan, as reported by the Taiwan National Infectious Disease Statistics System (NIDSS) via the Taiwan CDC.',
  };
  return loadDataSet(
    title,
    'nidss_flu',
    {
      epiweeks: epiRange(firstEpiWeek.nidss_flu, currentEpiWeek),
    },
    { regions, issues, lag },
    ['visits', 'ili'],
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}

export function importNowcast({ locations }: { locations: string }): Promise<DataGroup | null> {
  const regionLabel = nowcastLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] Delphi Nowcast: ${regionLabel}`;
  const additionalLabels = {
    titleLabel: 'Delphi Nowcast',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/nowcast.html',
    dataSourceDescription:
      'This endpoint provides Delphi’s nowcast estimates of the percentage of outpatient visits due to Influenza-Like Illness (ILI).',
  };
  return loadDataSet(
    title,
    'nowcast',
    {
      epiweeks: epiRange(firstEpiWeek.nowcast, currentEpiWeek),
    },
    { locations },
    ['value', 'std'],
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}
export function importQuidel({ auth, locations }: { auth: string; locations: string }): Promise<DataGroup | null> {
  const regionLabel = quidelLocations.find((d) => d.value === locations)?.label ?? '?';
  const title = `[API] Quidel Data: ${regionLabel}`;
  const additionalLabels = {
    titleLabel: 'Quidel Data',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/quidel.html',
    dataSourceDescription:
      'This data source provides influenza testing data from Quidel Corporation, covering HHS health regions. Data is aggregated by unique device. Covers US states (excluding some like FL in older mappings).',
  };
  return loadDataSet(
    title,
    'quidel',
    {
      epiweeks: epiRange(firstEpiWeek.quidel, currentEpiWeek),
    },
    { locations },
    ['value'],
    auth,
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'Delphi Sensor (' + namesLabel + ')',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/sensors.html',
    dataSourceDescription:
      'This endpoint provides access to Delphi’s digital surveillance sensor estimates for seasonal influenza-like illness (ILI). It aggregates signals from multiple digital sources, including Google Health Trends, Wikipedia access counts, Twitter posts, and CDC web traffic, to provide real-time indicators of flu activity before official clinical reports are finalized.',
  };
  return loadDataSet(
    title,
    'sensors',
    {
      epiweeks: epiRange(firstEpiWeek.sensors, currentEpiWeek),
    },
    { names, locations },
    ['value'],
    auth,
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'Twitter',
    selectionLabel: 'location: ' + regionLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/twitter.html',
    dataSourceDescription:
      'This data source provides estimates of influenza activity derived from the content of public Twitter posts. The data was processed by HealthTweets.org using natural language processing (NLP) to classify tweets as flu-related.',
  };
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
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
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
  const additionalLabels = {
    titleLabel: 'Wiki',
    selectionLabel: 'article: ' + articleLabel,
    dataSourceDocumentationUrl: 'https://cmu-delphi.github.io/delphi-epidata/api/wiki.html',
    dataSourceDescription:
      'This data source measures public interest in health topics by tracking access counts for specific influenza-related articles on English-language Wikipedia. Delphi aggregates these counts from Wikimedia’s public pageview dumps, providing a proxy for information-seeking behavior and public awareness of the flu.',
  };
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
    '',
    {},
    additionalLabels,
  ).then((ds) => {
    if (ds instanceof DataGroup) {
      ds.dataSourceDocumentationUrl = additionalLabels.dataSourceDocumentationUrl;
      ds.dataSourceDescription = additionalLabels.dataSourceDescription;
    }
    return ds;
  });
}
