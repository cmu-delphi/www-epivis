// Wrapper for delphi_epidata.js
var Epidata = (function() {
   // The API
   var api = Epidata;
   // first available epiweek for each data source
   var first_epiweek = {
      'fluview': 199740,
      'flusurv': 200340,
      'ilinet': 199740,
      'stateili': 201001,
      'gft': 200340,
      'ght': 200401,
      'twitter': 201148,
      'wiki': 200750,
      'nidss_flu': 200814,
      'nidss_dengue': 200301,
      'signals': 200340,
      'cdc': 201301,
      'quidel': 201535,
      'sensors': 201030,
      'nowcast': 200901,
   };
   // first available date for each data source
   var first_date = {
      'twitter': 20111201,
      'wiki': 20071209,
   };
   // find the current epiweek and date
   var date = new Date();
   var epidate = new EpiVis.Date(date.getYear() + 1900, date.getMonth() + 1, date.getDate());
   var current_epiweek = (epidate.getEpiYear() * 100) + epidate.getEpiWeek();
   var current_date = (epidate.getYear() * 10000) + (epidate.getMonth() * 100) + epidate.getDay();
   // generic epidata loader
   function loadEpidata(epidata, columns) {
      var datasets, points, row, col, year, week, date;
      datasets = [];
      for(col = 0; col < columns.length; col++) {
         points = [];
         for(row = 0; row < epidata.length; row++) {
            if(epidata[row].hasOwnProperty('date')) {
               date = EpiVis.Date.parse(epidata[row].date);
            } else if(epidata[row].hasOwnProperty('epiweek')) {
               year = Math.floor(epidata[row].epiweek / 100);
               week = epidata[row].epiweek % 100;
               date = EpiVis.Date.fromEpiweek(year, week);
            } else {
               throw {'msg': 'missing column "date" and "epiweek"'};
            }
            points.push(new EpiVis.Point(date, epidata[row][columns[col]]));
         }
         datasets.push(new EpiVis.Dataset(points, columns[col]));
      }
      return datasets;
   }
   // generic API access
   function handleData(onSuccess, onFailure, columns, result, message, epidata) {
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
         onSuccess(loadEpidata(epidata, columns));
      }
   }
   // generic callback generator
   function getCallback(onSuccess, onFailure, columns) {
      return function(result, message, epidata) {
         handleData(onSuccess, onFailure, columns, result, message, epidata);
      };
   }
   // public API
   return {
      fetchFluView: function(onSuccess, onFailure, region, issue, lag) {
         var columns = ['wili', 'ili', 'num_ili', 'num_patients', 'num_providers', 'num_age_0', 'num_age_1', 'num_age_2', 'num_age_3', 'num_age_4', 'num_age_5'];
         api.fluview(getCallback(onSuccess, onFailure, columns), region, [api.range(first_epiweek.fluview, current_epiweek)], issue, lag);
      },
      fetchFluSurv: function(onSuccess, onFailure, location, issue, lag) {
         var columns = ['rate_age_0', 'rate_age_1', 'rate_age_2', 'rate_age_3', 'rate_age_4', 'rate_overall'];
         api.flusurv(getCallback(onSuccess, onFailure, columns), location, [api.range(first_epiweek.flusurv, current_epiweek)], issue, lag);
      },
      fetchILINet: function(onSuccess, onFailure, location, version, auth) {
         var columns = ['ili', 'num_ili', 'num_patients', 'num_providers', 'num_age_0', 'num_age_1', 'num_age_2', 'num_age_3', 'num_age_4', 'num_age_5'];
         if(location.length > 2) {
            // this isn't a state abbreviation, so it must either be regional or national - those also have wILI
            columns.push('wili');
         } else {
            // this isn't either be regional or national, so it must be a state abbreviation - those also have ili_estimate (scraped from state websites)
            columns.push('ili_estimate');
         }
         api.ilinet(getCallback(onSuccess, onFailure, columns), location, [api.range(first_epiweek.ilinet, current_epiweek)], version, auth);
      },
      fetchStateILI: function(onSuccess, onFailure, auth, state) {
         var columns = ['ili'];
         api.stateili(getCallback(onSuccess, onFailure, columns), auth, state, [api.range(first_epiweek.stateili, current_epiweek)]);
      },
      fetchGFT: function(onSuccess, onFailure, location) {
         var columns = ['num'];
         api.gft(getCallback(onSuccess, onFailure, columns), location, [api.range(first_epiweek.gft, current_epiweek)]);
      },
      fetchGHT: function(onSuccess, onFailure, auth, location, query) {
         var columns = ['value'];
         api.ght(getCallback(onSuccess, onFailure, columns), auth, location, [api.range(first_epiweek.ght, current_epiweek)], query);
      },
      fetchTwitter: function(onSuccess, onFailure, auth, location, resolution) {
         var columns = ['num', 'total', 'percent'];
         var callback = getCallback(onSuccess, onFailure, columns);
         if(resolution === 'daily') {
            api.twitter(callback, auth, location, [api.range(first_date.twitter, current_date)], null);
         } else {
            api.twitter(callback, auth, location, null, [api.range(first_epiweek.twitter, current_epiweek)]);
         }
      },
      fetchWiki: function(onSuccess, onFailure, article, resolution, hour) {
         var columns = ['count', 'total', 'value'];
         var callback = getCallback(onSuccess, onFailure, columns);
         if(resolution === 'daily') {
            api.wiki(callback, article, [api.range(first_date.wiki, current_date)], null, hour);
         } else {
            api.wiki(callback, article, null, [api.range(first_epiweek.wiki, current_epiweek)], hour);
         }
      },
      fetchCDC: function(onSuccess, onFailure, auth, location) {
         var columns = ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'];
         api.cdc(getCallback(onSuccess, onFailure, columns), auth, [api.range(first_epiweek.cdc, current_epiweek)], location);
      },
      fetchQuidel: function(onSuccess, onFailure, auth, location) {
         var columns = ['value'];
         api.quidel(getCallback(onSuccess, onFailure, columns), auth, [api.range(first_epiweek.quidel, current_epiweek)], location);
      },
      fetchNIDSS_flu: function(onSuccess, onFailure, region, issue, lag) {
         var columns = ['visits', 'ili'];
         api.nidss_flu(getCallback(onSuccess, onFailure, columns), region, [api.range(first_epiweek.nidss_flu, current_epiweek)], issue, lag);
      },
      fetchNIDSS_dengue: function(onSuccess, onFailure, location) {
         var columns = ['count'];
         api.nidss_dengue(getCallback(onSuccess, onFailure, columns), location, [api.range(first_epiweek.nidss_dengue, current_epiweek)]);
      },
      fetchSignals: function(onSuccess, onFailure, auth, name, location) {
         var columns = ['value'];
         api.signals(getCallback(onSuccess, onFailure, columns), auth, name, location, [api.range(first_epiweek.signals, current_epiweek)]);
      },
      fetchSensors: function(onSuccess, onFailure, auth, name, location) {
         var columns = ['value'];
         api.sensors(getCallback(onSuccess, onFailure, columns), auth, name, location, [api.range(first_epiweek.sensors, current_epiweek)]);
      },
      fetchNowcast: function(onSuccess, onFailure, location) {
         var columns = ['value', 'std'];
         api.nowcast(getCallback(onSuccess, onFailure, columns), location, [api.range(first_epiweek.nowcast, current_epiweek)]);
      },
   };
}());
