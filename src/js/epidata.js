// Wrapper for delphi_epidata.js
var Epidata = (function() {
   // The API
   var api = Epidata;
   // first available epiweek for each data source
   var first_epiweek = {
      'fluview': 199740,
      'flusurv': 200340,
      'gft': 200340,
      'ght': 200401,
      'twitter': 201148,
      'wiki': 200750,
      'nidss_flu': 200814,
      'nidss_dengue': 200301,
      'cdc': 201301,
      'quidel': 201535,
      'sensors': 201030,
      'nowcast': 200901,
   };
   // first available date for each data source
   var first_date = {
      'twitter': 20111201,
      'wiki': 20071209,
      'covidcast': 20200101,
      'covid_hosp': 20200101,
   };
   // find the current epiweek and date
   var date = new Date();
   var epidate = new EpiVis.Date(date.getYear() + 1900, date.getMonth() + 1, date.getDate());
   var current_epiweek = (epidate.getEpiYear() * 100) + epidate.getEpiWeek();
   var current_date = (epidate.getYear() * 10000) + (epidate.getMonth() * 100) + epidate.getDay();
   // generic epidata loader
   function loadEpidata(epidata, columns, params) {
      var datasets, points, row, col, year, week, date;
      datasets = [];
      for(col = 0; col < columns.length; col++) {
         points = [];
         for(row = 0; row < epidata.length; row++) {
            if(epidata[row].hasOwnProperty('time_value')) {
               const timeValue = epidata[row].time_value;
               if ('' + timeValue.length == 6) {
                  epidata[row].epiweek = timeValue;
               } else {
                  epidata[row].date = '' + timeValue;
               }
            }
            if(epidata[row].hasOwnProperty('date')) {
               date = EpiVis.Date.parse(epidata[row].date);
            } else if(epidata[row].hasOwnProperty('epiweek')) {
               year = Math.floor(epidata[row].epiweek / 100);
               week = epidata[row].epiweek % 100;
               date = EpiVis.Date.fromEpiweek(year, week);
            } else {
               throw {'msg': 'missing date/week column', 'row': epidata[row]};
            }
            points.push(new EpiVis.Point(date, epidata[row][columns[col]]));
         }
         datasets.push(new EpiVis.Dataset(points, columns[col], params));
      }
      return datasets;
   }
   // generic API access
   function handleData(onSuccess, onFailure, columns, params, result, message, epidata) {
      if(result <= 0) {
         // hard failure (can't continue)
         onFailure('There was an error fetching the data. [result=' + result + ']');
      }
      if(result === 2) {
         // soft failure (can continue)
         onFailure('Too many results, data truncated.');
      }
      if(result >= 1) {
         // success
         onSuccess(loadEpidata(epidata, columns, params));
      }
   }
   // generic callback generator
   function getCallback(onSuccess, onFailure, columns, params) {
      return function(result, message, epidata) {
         handleData(onSuccess, onFailure, columns, params, result, message, epidata);
      };
   }
   // public API
   return {
      api: api,
      fetchFluView: (onSuccess, onFailure, region, issue, lag, auth) => {
         const params = ['fluview', region, issue, lag, auth];
         const columns = ['wili', 'ili', 'num_ili', 'num_patients', 'num_providers', 'num_age_0', 'num_age_1', 'num_age_2', 'num_age_3', 'num_age_4', 'num_age_5'];
         api.fluview(getCallback(onSuccess, onFailure, columns, params), region, [api.range(first_epiweek.fluview, current_epiweek)], issue, lag, auth);
      },
      fetchFluSurv: (onSuccess, onFailure, location, issue, lag) => {
         const params = ['flusurv', location, issue, lag];
         const columns = ['rate_age_0', 'rate_age_1', 'rate_age_2', 'rate_age_3', 'rate_age_4', 'rate_overall'];
         api.flusurv(getCallback(onSuccess, onFailure, columns, params), location, [api.range(first_epiweek.flusurv, current_epiweek)], issue, lag);
      },
      fetchGFT: (onSuccess, onFailure, location) => {
         const params = ['gft', location];
         const columns = ['num'];
         api.gft(getCallback(onSuccess, onFailure, columns, params), location, [api.range(first_epiweek.gft, current_epiweek)]);
      },
      fetchGHT: (onSuccess, onFailure, auth, location, query) => {
         const params = ['ght', auth, location, query];
         const columns = ['value'];
         api.ght(getCallback(onSuccess, onFailure, columns, params), auth, location, [api.range(first_epiweek.ght, current_epiweek)], query);
      },
      fetchTwitter: (onSuccess, onFailure, auth, location, resolution) => {
         const params = ['twtr', auth, location, resolution];
         const columns = ['num', 'total', 'percent'];
         const callback = getCallback(onSuccess, onFailure, columns, params);
         if(resolution === 'daily') {
            api.twitter(callback, auth, location, [api.range(first_date.twitter, current_date)], null);
         } else {
            api.twitter(callback, auth, location, null, [api.range(first_epiweek.twitter, current_epiweek)]);
         }
      },
      fetchWiki: (onSuccess, onFailure, article, resolution, hour) => {
         const params = ['wiki', article, resolution, hour];
         const columns = ['count', 'total', 'value'];
         const callback = getCallback(onSuccess, onFailure, columns, params);
         if(resolution === 'daily') {
            api.wiki(callback, article, [api.range(first_date.wiki, current_date)], null, hour);
         } else {
            api.wiki(callback, article, null, [api.range(first_epiweek.wiki, current_epiweek)], hour);
         }
      },
      fetchCDC: (onSuccess, onFailure, auth, location) => {
         const params = ['cdcp', auth, location];
         const columns = ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'];
         api.cdc(getCallback(onSuccess, onFailure, columns, params), auth, [api.range(first_epiweek.cdc, current_epiweek)], location);
      },
      fetchQuidel: (onSuccess, onFailure, auth, location) => {
         const params = ['quidel', auth, location];
         const columns = ['value'];
         api.quidel(getCallback(onSuccess, onFailure, columns, params), auth, [api.range(first_epiweek.quidel, current_epiweek)], location);
      },
      fetchNIDSS_flu: (onSuccess, onFailure, region, issue, lag) => {
         const params = ['nidss_flu', region, issue, lag];
         const columns = ['visits', 'ili'];
         api.nidss_flu(getCallback(onSuccess, onFailure, columns, params), region, [api.range(first_epiweek.nidss_flu, current_epiweek)], issue, lag);
      },
      fetchNIDSS_dengue: (onSuccess, onFailure, location) => {
         const params = ['nidss_dengue', location];
         const columns = ['count'];
         api.nidss_dengue(getCallback(onSuccess, onFailure, columns, params), location, [api.range(first_epiweek.nidss_dengue, current_epiweek)]);
      },
      fetchSensors: (onSuccess, onFailure, auth, name, location) => {
         const params = ['sensors', auth, name, location];
         const columns = ['value'];
         api.sensors(getCallback(onSuccess, onFailure, columns, params), auth, name, location, [api.range(first_epiweek.sensors, current_epiweek)]);
      },
      fetchNowcast: (onSuccess, onFailure, location) => {
         const params = ['nowcast', location];
         const columns = ['value', 'std'];
         api.nowcast(getCallback(onSuccess, onFailure, columns, params), location, [api.range(first_epiweek.nowcast, current_epiweek)]);
      },
      fetchCovidcast: (onSuccess, onFailure, dataSource, signal, timeType, geoType, geoValue) => {
         const params = ['covidcast', dataSource, signal, timeType, geoType, geoValue];
         const columns = ['value', 'stderr', 'sample_size'];
         const timeValue = [api.range(first_date.covidcast, current_date)];
         api.covidcast(getCallback(onSuccess, onFailure, columns, params), dataSource, signal, timeType, geoType, timeValue, geoValue);
      },
      fetchCovidHosp: (onSuccess, onFailure, state, issue) => {
         const params = ['covid_hosp', state, issue];
         const columns = [
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
         ];
         const callback = getCallback(onSuccess, onFailure, columns, params);
         const dates = [api.range(first_date.covid_hosp, current_date)];
         api.covid_hosp(callback, state, dates, issue);
      },
   };
}());
