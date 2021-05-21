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

function fetchImpl<T>(url: URL): Promise<T> {
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
): Promise<DataGroup> {
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
      return new DataGroup(title, []);
    });
}

//       fetchSensors: (onSuccess, onFailure, auth, name, location) => {
//          const params = ['sensors', auth, name, location];
//          const columns = ['value'];
//          api.sensors(getCallback(onSuccess, onFailure, columns, params), auth, name, location, [api.range(firstEpiWeek.sensors, current_epiweek)]);
//       },
//       fetchNowcast: (onSuccess, onFailure, location) => {
//          const params = ['nowcast', location];
//          const columns = ['value', 'std'];
//          api.nowcast(getCallback(onSuccess, onFailure, columns, params), location, [api.range(firstEpiWeek.nowcast, current_epiweek)]);
//       },
//       fetchCovidcast: (onSuccess, onFailure, dataSource, signal, timeType, geoType, geoValue) => {
//          const params = ['covidcast', dataSource, signal, timeType, geoType, geoValue];
//          const columns = ['value', 'stderr', 'sample_size'];
//          const timeValue = [api.range(first_date.covidcast, current_date)];
//          api.covidcast(getCallback(onSuccess, onFailure, columns, params), dataSource, signal, timeType, geoType, timeValue, geoValue);
//       },
//       fetchCovidHosp: (onSuccess, onFailure, state, issue) => {
//          const params = ['covid_hosp', state, issue];
//          const columns = [
//            'hospital_onset_covid',
//            'hospital_onset_covid_coverage',
//            'inpatient_beds',
//            'inpatient_beds_coverage',
//            'inpatient_beds_used',
//            'inpatient_beds_used_coverage',
//            'inpatient_beds_used_covid',
//            'inpatient_beds_used_covid_coverage',
//            'previous_day_admission_adult_covid_confirmed',
//            'previous_day_admission_adult_covid_confirmed_coverage',
//            'previous_day_admission_adult_covid_suspected',
//            'previous_day_admission_adult_covid_suspected_coverage',
//            'previous_day_admission_pediatric_covid_confirmed',
//            'previous_day_admission_pediatric_covid_confirmed_coverage',
//            'previous_day_admission_pediatric_covid_suspected',
//            'previous_day_admission_pediatric_covid_suspected_coverage',
//            'staffed_adult_icu_bed_occupancy',
//            'staffed_adult_icu_bed_occupancy_coverage',
//            'staffed_icu_adult_patients_confirmed_suspected_covid',
//            'staffed_icu_adult_patients_confirmed_suspected_covid_coverage',
//            'staffed_icu_adult_patients_confirmed_covid',
//            'staffed_icu_adult_patients_confirmed_covid_coverage',
//            'total_adult_patients_hosp_confirmed_suspected_covid',
//            'total_adult_patients_hosp_confirmed_suspected_covid_coverage',
//            'total_adult_patients_hosp_confirmed_covid',
//            'total_adult_patients_hosp_confirmed_covid_coverage',
//            'total_pediatric_patients_hosp_confirmed_suspected_covid',
//            'total_pediatric_patients_hosp_confirmed_suspected_covid_coverage',
//            'total_pediatric_patients_hosp_confirmed_covid',
//            'total_pediatric_patients_hosp_confirmed_covid_coverage',
//            'total_staffed_adult_icu_beds',
//            'total_staffed_adult_icu_beds_coverage',
//            'inpatient_beds_utilization',
//            'inpatient_beds_utilization_coverage',
//            'inpatient_beds_utilization_numerator',
//            'inpatient_beds_utilization_denominator',
//            'percent_of_inpatients_with_covid',
//            'percent_of_inpatients_with_covid_coverage',
//            'percent_of_inpatients_with_covid_numerator',
//            'percent_of_inpatients_with_covid_denominator',
//            'inpatient_bed_covid_utilization',
//            'inpatient_bed_covid_utilization_coverage',
//            'inpatient_bed_covid_utilization_numerator',
//            'inpatient_bed_covid_utilization_denominator',
//            'adult_icu_bed_covid_utilization',
//            'adult_icu_bed_covid_utilization_coverage',
//            'adult_icu_bed_covid_utilization_numerator',
//            'adult_icu_bed_covid_utilization_denominator',
//            'adult_icu_bed_utilization',
//            'adult_icu_bed_utilization_coverage',
//            'adult_icu_bed_utilization_numerator',
//            'adult_icu_bed_utilization_denominator',
//          ];
//          const callback = getCallback(onSuccess, onFailure, columns, params);
//          const dates = [api.range(first_date.covid_hosp, current_date)];
//          api.covid_hosp(callback, state, dates, issue);
//       },
//    };
