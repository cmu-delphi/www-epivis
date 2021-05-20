import DataSet, { DataGroup } from '../data/DataSet';
import EpiDate from '../data/EpiDate';
import EpiPoint from '../data/EpiPoint';

// import DataSet from "../data/DataSet";
// import EpiDate from "../data/EpiDate";
// import EpiPoint from "../data/EpiPoint";

// function range(from: string, to: string) {
//   return { from, to };
// }

// // find the current epiweek and date
// const date = new Date();
// const epidate = new EpiDate(date.getFullYear() + 1900, date.getMonth() + 1, date.getDate());
// const current_epiweek = (epidate.getEpiYear() * 100) + epidate.getEpiWeek();
// const current_date = (epidate.getYear() * 10000) + (epidate.getMonth() * 100) + epidate.getDay();

declare const process: { env: Record<string, string> };
const ENDPOINT = process.env.EPIDATA_ENDPOINT_URL;

export const fetchOptions: RequestInit = process.env.NODE_ENV === 'development' ? { cache: 'force-cache' } : {};

function fetchImpl<T>(url: URL): Promise<T> {
  const urlGetS = url.toString();
  if (urlGetS.length < 4096) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fetch(url.toString(), fetchOptions).then((d) => d.json());
  }
  url.searchParams;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return fetch(url.pathname, {
    ...fetchOptions,
    method: 'POST',
    body: url.searchParams,
  }).then((d) => d.json());
}

export function loadDataSet(
  title: string,
  endpoint: string,
  params: Record<string, unknown>,
  columns: string[],
): Promise<DataGroup> {
  const url = new URL(ENDPOINT + `/${endpoint}/`);
  const clean: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      clean[key] = value;
      url.searchParams.set(key, String(value));
    }
  });
  url.searchParams.set('format', 'json');
  return fetchImpl<Record<string, unknown>[]>(url)
    .then((res) => {
      return loadEpidata(title, res, columns, clean);
    })
    .catch((error) => {
      console.warn('failed fetching data', error);
      return new DataGroup(title, []);
    });
}

// generic epidata loader
export function loadEpidata(
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

// export default class EpiData {
//   fetchFluView: (onSuccess, onFailure, region, issue, lag, auth) => {
//       const params = ['fluview', region, issue, lag, auth];
//   const columns = ['wili', 'ili', 'num_ili', 'num_patients', 'num_providers', 'num_age_0', 'num_age_1', 'num_age_2', 'num_age_3', 'num_age_4', 'num_age_5'];
//       return fetchAPI(region, )  },
// fetchCDC
// ::::: (onSuccess, onFailure, auth, location) => {
//       const params = ['cdcp', auth, location];
//       const columns = ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'];
//       api.cdc(getCallback(onSuccess, onFailure, columns, params), auth, [range(first_epiweek.cdc, current_epiweek)], location);
//   },
//   fetchQuidel: (onSuccess, onFailure, auth, location) => {
//       const params = ['quidel', auth, location];
//       const columns = ['value'];
//       api.quidel(getCallback(onSuccess, onFailure, columns, params), auth, [range(first_epiweek.quidel, current_epiweek)], location);
//   },
//   fetchNIDSS_flu: (onSuccess, onFailure, region, issue, lag) => {
//       const params = ['nidss_flu', region, issue, lag];
//       const columns = ['visits', 'ili'];
//       api.nidss_flu(getCallback(onSuccess, onFailure, columns, params), region, [range(first_epiweek.nidss_flu, current_epiweek)], issue, lag);
//   },
//   fetchNIDSS_dengue: (onSuccess, onFailure, location) => {
//       const params = ['nidss_dengue', location];
//       const columns = ['count'];
//       api.nidss_dengue(getCallback(onSuccess, onFailure, columns, params), location, [range(first_epiweek.nidss_dengue, current_epiweek)]);
//   },
//   fetchSensors: (onSuccess, onFailure, auth, name, location) => {
//       const params = ['sensors', auth, name, location];
//       const columns = ['value'];
//       api.sensors(getCallback(onSuccess, onFailure, columns, params), auth, name, location, [range(first_epiweek.sensors, current_epiweek)]);
//   },
//   fetchNowcast: (onSuccess, onFailure, location) => {
//       const params = ['nowcast', location];
//       const columns = ['value', 'std'];
//       api.nowcast(getCallback(onSuccess, onFailure, columns, params), location, [range(first_epiweek.nowcast, current_epiweek)]);
//   },
//   fetchCovidcast: (onSuccess, onFailure, dataSource, signal, timeType, geoType, geoValue) => {
//       const params = ['covidcast', dataSource, signal, timeType, geoType, geoValue];
//       const columns = ['value', 'stderr', 'sample_size'];
//       const timeValue = [range(first_date.covidcast, current_date)];
//       api.covidcast(getCallback(onSuccess, onFailure, columns, params), dataSource, signal, timeType, geoType, timeValue, geoValue);
//   },
//   fetchCovidHosp: (onSuccess, onFailure, state, issue) => {
//       const params = ['covid_hosp', state, issue];
//       const columns = [
//         'hospital_onset_covid',
//         'hospital_onset_covid_coverage',
//         'inpatient_beds',
//         'inpatient_beds_coverage',
//         'inpatient_beds_used',
//         'inpatient_beds_used_coverage',
//         'inpatient_beds_used_covid',
//         'inpatient_beds_used_covid_coverage',
//         'previous_day_admission_adult_covid_confirmed',
//         'previous_day_admission_adult_covid_confirmed_coverage',
//         'previous_day_admission_adult_covid_suspected',
//         'previous_day_admission_adult_covid_suspected_coverage',
//         'previous_day_admission_pediatric_covid_confirmed',
//         'previous_day_admission_pediatric_covid_confirmed_coverage',
//         'previous_day_admission_pediatric_covid_suspected',
//         'previous_day_admission_pediatric_covid_suspected_coverage',
//         'staffed_adult_icu_bed_occupancy',
//         'staffed_adult_icu_bed_occupancy_coverage',
//         'staffed_icu_adult_patients_confirmed_suspected_covid',
//         'staffed_icu_adult_patients_confirmed_suspected_covid_coverage',
//         'staffed_icu_adult_patients_confirmed_covid',
//         'staffed_icu_adult_patients_confirmed_covid_coverage',
//         'total_adult_patients_hosp_confirmed_suspected_covid',
//         'total_adult_patients_hosp_confirmed_suspected_covid_coverage',
//         'total_adult_patients_hosp_confirmed_covid',
//         'total_adult_patients_hosp_confirmed_covid_coverage',
//         'total_pediatric_patients_hosp_confirmed_suspected_covid',
//         'total_pediatric_patients_hosp_confirmed_suspected_covid_coverage',
//         'total_pediatric_patients_hosp_confirmed_covid',
//         'total_pediatric_patients_hosp_confirmed_covid_coverage',
//         'total_staffed_adult_icu_beds',
//         'total_staffed_adult_icu_beds_coverage',
//         'inpatient_beds_utilization',
//         'inpatient_beds_utilization_coverage',
//         'inpatient_beds_utilization_numerator',
//         'inpatient_beds_utilization_denominator',
//         'percent_of_inpatients_with_covid',
//         'percent_of_inpatients_with_covid_coverage',
//         'percent_of_inpatients_with_covid_numerator',
//         'percent_of_inpatients_with_covid_denominator',
//         'inpatient_bed_covid_utilization',
//         'inpatient_bed_covid_utilization_coverage',
//         'inpatient_bed_covid_utilization_numerator',
//         'inpatient_bed_covid_utilization_denominator',
//         'adult_icu_bed_covid_utilization',
//         'adult_icu_bed_covid_utilization_coverage',
//         'adult_icu_bed_covid_utilization_numerator',
//         'adult_icu_bed_covid_utilization_denominator',
//         'adult_icu_bed_utilization',
//         'adult_icu_bed_utilization_coverage',
//         'adult_icu_bed_utilization_numerator',
//         'adult_icu_bed_utilization_denominator',
//       ];
//       const callback = getCallback(onSuccess, onFailure, columns, params);
//       const dates = [range(first_date.covid_hosp, current_date)];
//       api.covid_hosp(callback, state, dates, issue);
//   },
// }
