<script lang="ts">
  // import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from '../utils';

  // const dispatch = createEventDispatcher();

  const id = randomId();

  let dataSource: string = 'fluview';

  function onSubmit(e: Event) {
    e.preventDefault();

  }

//   const successFunction = (title) => {
//   return function(datasets) {
//     datasets.forEach(data => {
//       data.parentTitle = title;
//     });
//     var info = new CSV.Info();
//     info.numCols = datasets.length;
//     info.numRows = datasets[0].data.length;
//     info.data = new CSV.DataGroup("[API] " + title, datasets);
//     info.print();
//     var node = new TreeView.Node(info.data.getTitle());
//     loadDataGroup(node, info.data.getData());
//     tree.append(node);
//     closeDialog();
//   };
// };

// const onFailure = (message) => {
//   alert(message);
// };

// function loadEpidata() {
//   if ($("#radio_fluview").is(":checked")) {
//     (function() {
//       var region = $("#select_fluview_region :selected").val();
//       var title = "FluView: " + $("#select_fluview_region :selected").text();
//       var issue, lag;
//       var auth = $("#text_fluview_auth").val();

//       if ($("#radio_fluview_static").is(":checked")) {
//         issue = parseInt($("#text_fluview_static").val(), 10);
//         title +=
//           " (reported " + Math.floor(issue / 100) + "w" + (issue % 100) + ")";
//       } else if ($("#radio_fluview_offset").is(":checked")) {
//         lag = parseInt($("#text_fluview_offset").val(), 10);
//         title += " (lagged " + lag + " week" + (lag != 1 ? "s" : "") + ")";
//       }

//       Epidata.fetchFluView(
//         successFunction(title),
//         onFailure,
//         region,
//         issue,
//         lag,
//         auth
//       );
//     })();
//   } else if ($("#radio_flusurv").is(":checked")) {
//     (function() {
//       var location = $("#select_flusurv_location :selected").val();
//       var title = "FluSurv: " + $("#select_flusurv_location :selected").text();
//       var issue, lag;

//       if ($("#radio_flusurv_static").is(":checked")) {
//         issue = parseInt($("#text_flusurv_static").val(), 10);
//         title +=
//           " (reported " + Math.floor(issue / 100) + "w" + (issue % 100) + ")";
//       } else if ($("#radio_flusurv_offset").is(":checked")) {
//         lag = parseInt($("#text_flusurv_offset").val(), 10);
//         title += " (lagged " + lag + " week" + (lag != 1 ? "s" : "") + ")";
//       }

//       Epidata.fetchFluSurv(
//         successFunction(title),
//         onFailure,
//         location,
//         issue,
//         lag
//       );
//     })();
//   } else if ($("#radio_gft").is(":checked")) {
//     (function() {
//       var location = $("#select_gft_location :selected").val();
//       var title = "GFT: " + $("#select_gft_location :selected").text();
//       Epidata.fetchGFT(successFunction(title), onFailure, location);
//     })();
//   } else if ($("#radio_ght").is(":checked")) {
//     (function() {
//       var auth = $("#text_ght_auth").val();
//       var location = $("#select_ght_location :selected").val();
//       var query = $("#text_ght_query").val();
//       var title =
//         "GHT: " +
//         $("#select_ght_location :selected").text() +
//         "[" +
//         $("#text_ght_query").val() +
//         "]";
//       Epidata.fetchGHT(
//         successFunction(title),
//         onFailure,
//         auth,
//         location,
//         query
//       );
//     })();
//   } else if ($("#radio_twitter").is(":checked")) {
//     (function() {
//       var auth = $("#text_twitter_auth").val();
//       var location = $("#select_twitter_location :selected").val();
//       var resolution = $("#select_twitter_resolution :selected").val();
//       var title =
//         "Twitter: " +
//         $("#select_twitter_location :selected").text() +
//         ", " +
//         $("#select_twitter_resolution :selected").text();
//       Epidata.fetchTwitter(
//         successFunction(title),
//         onFailure,
//         auth,
//         location,
//         resolution
//       );
//     })();
//   } else if ($("#radio_wiki").is(":checked")) {
//     (function() {
//       var article = $("#select_wiki_article :selected").val();
//       var resolution = $("#select_wiki_resolution :selected").val();
//       var hour;

//       if ($("#check_wiki_hour").is(":checked")) {
//         hour = parseInt($("#text_wiki_hour").val(), 10);
//       }

//       var title =
//         "Wiki: " +
//         $("#select_wiki_article :selected").text() +
//         ", " +
//         $("#select_wiki_resolution :selected").text() +
//         (typeof hour !== "undefined" ? " (hour=" + hour + ")" : "");
//       Epidata.fetchWiki(
//         successFunction(title),
//         onFailure,
//         article,
//         resolution,
//         hour
//       );
//     })();
//   } else if ($("#radio_nidss_flu").is(":checked")) {
//     (function() {
//       var region = $("#select_nidss_flu_region :selected").val();
//       var title =
//         "NIDSS-influenza: " + $("#select_nidss_flu_region :selected").text();
//       var issue, lag;

//       if ($("#radio_nidss_flu_static").is(":checked")) {
//         issue = parseInt($("#text_nidss_flu_static").val(), 10);
//         title +=
//           " (reported " + Math.floor(issue / 100) + "w" + (issue % 100) + ")";
//       } else if ($("#radio_nidss_flu_offset").is(":checked")) {
//         lag = parseInt($("#text_nidss_flu_offset").val(), 10);
//         title += " (lagged " + lag + " week" + (lag > 1 ? "s" : "") + ")";
//       }

//       Epidata.fetchNIDSS_flu(
//         successFunction(title),
//         onFailure,
//         region,
//         issue,
//         lag
//       );
//     })();
//   } else if ($("#radio_nidss_dengue").is(":checked")) {
//     (function() {
//       var location = $("#select_nidss_dengue_location :selected").val();
//       var title =
//         "NIDSS-Dengue: " + $("#select_nidss_dengue_location :selected").text();
//       Epidata.fetchNIDSS_dengue(successFunction(title), onFailure, location);
//     })();
//   } else if ($("#radio_cdc").is(":checked")) {
//     (function() {
//       var auth = $("#text_cdc_auth").val();
//       var location_v = $("#select_cdc_location :selected").val();
//       var location_t = $("#select_cdc_location :selected").text();
//       var title = "CDC Page Hits: " + location_t;
//       Epidata.fetchCDC(successFunction(title), onFailure, auth, location_v);
//     })();
//   } else if ($("#radio_quidel").is(":checked")) {
//     (function() {
//       var auth = $("#text_quidel_auth").val();
//       var location_v = $("#select_quidel_location :selected").val();
//       var location_t = $("#select_quidel_location :selected").text();
//       var title = "Quidel Data: " + location_t;
//       Epidata.fetchQuidel(successFunction(title), onFailure, auth, location_v);
//     })();
//   } else if ($("#radio_sensors").is(":checked")) {
//     (function() {
//       var auth = $("#text_sensors_auth").val();
//       var name_v = $("#select_sensors_name :selected").val();
//       var name_t = $("#select_sensors_name :selected").text();
//       var location_v = $("#select_sensors_location :selected").val();
//       var location_t = $("#select_sensors_location :selected").text();
//       var title = "Delphi Sensor " + name_t + ": " + location_t;
//       Epidata.fetchSensors(
//         successFunction(title),
//         onFailure,
//         auth,
//         name_v,
//         location_v
//       );
//     })();
//   } else if ($("#radio_nowcast").is(":checked")) {
//     (function() {
//       var location_v = $("#select_nowcast_location :selected").val();
//       var location_t = $("#select_nowcast_location :selected").text();
//       var title = "Delphi Nowcast: " + location_t;
//       Epidata.fetchNowcast(successFunction(title), onFailure, location_v);
//     })();
//   } else if ($("#radio_covidcast").is(":checked")) {
//     (() => {
//       const dataSource = $("#select_covidcast_data_source :selected").val();
//       const signal = $("#select_covidcast_signal :selected").val();
//       const timeType = 'day';
//       const geoType = $("#select_covidcast_geo_type :selected").val();
//       const geoValue = $("#text_covidcast_geo_value").val();
//       const title = `Delphi COVIDcast: ${geoValue} ${signal} (${dataSource})`;
//       Epidata.fetchCovidcast(
//           successFunction(title),
//           onFailure,
//           dataSource,
//           signal,
//           timeType,
//           geoType,
//           geoValue);
//     })();
//   } else if ($("#radio_covid_hosp").is(":checked")) {
//     (() => {
//       const state_v = $("#select_covid_hosp_state :selected").val();
//       const state_t = $("#select_covid_hosp_state :selected").text();
//       let title = "COVID Hospitalization: " + state_t;
//       let issue;
//       if ($("#radio_covid_hosp_static").is(":checked")) {
//         issue = parseInt($("#text_covid_hosp_static").val(), 10);
//         title += " (issued on " + issue + ")";
//       } else {
//         title += " (most recent issue)";
//       }

//       Epidata.fetchCovidHosp(
//           successFunction(title),
//           onFailure,
//           state_v,
//           issue);
//     })();
//   } else {
//     alert("invalid api");
//   }
// }


// const initializeCovidcastOptions = () => {

//   const validNameRegex = /^[-_\w\d]+$/;

//   const getSortedUnique = (rows, key) => {
//     const set = {};
//     rows.forEach(row => {
//       set[row[key]] = 1;
//     });
//     const items = [];
//     Object.entries(set).forEach(keyval => items.push(keyval[0]));
//     return items.sort();
//   }

//   const populateDropdown = (element, names) => {
//     names.forEach(name => {
//       if (name.match(validNameRegex)) {
//         element.append(`<option value="${name}">${name}</option>`);
//       } else {
//         console.log('invalid name:', name);
//       }
//     });
//   };

//   Epidata.api.covidcast_meta((result, message, epidata) => {
//     if (result !== 1) {
//       console.log('failed to fetch covidcast metadata:', message);
//       return;
//     }
//     populateDropdown(
//         $('#select_covidcast_data_source'),
//         getSortedUnique(epidata, 'data_source'));
//     populateDropdown(
//         $('#select_covidcast_signal'),
//         getSortedUnique(epidata, 'signal'));
//     populateDropdown(
//         $('#select_covidcast_geo_type'),
//         getSortedUnique(epidata, 'geo_type'));
//   });
// }
</script>

<Dialog title="Load from Epidata API" on:close>
  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    <div>
      <div class="uk-form-label">Data Source</div>
      <div class="uk-form-controls uk-form-controls-text">
        <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="fluview" />
          FluView
          (source: <a target="_blank" href="https://gis.cdc.gov/grasp/fluview/fluportaldashboard.html">cdc.gov</a>)
        </label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="flusurv" /> FluSurv (source: <a target="_blank" href="https://gis.cdc.gov/GRASP/Fluview/FluHospRates.html">cdc.gov</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="gft" /> Google Flu Trends (source: <a target="_blank" href="https://www.google.org/flutrends/">google.com</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="ght" /> Google Health Trends (source: private Google API)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="twitter" /> HealthTweets (source: <a target="_blank" href="http://www.healthtweets.org/">healthtweets.org</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="wiki" /> Wikipedia Access (source: <a target="_blank" href="https://dumps.wikimedia.org/other/pagecounts-raw/">dumps.wikimedia.org</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="cdc" /> CDC Page Hits (source: private CDC dataset)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="quidel" /> Quidel Data (source: private Quidel dataset)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="nidss_flu" /> NIDSS - Influenza (source: <a target="_blank" href="http://nidss.cdc.gov.tw/en/CDCWNH01.aspx?dc=wnh">nidss.cdc.gov.tw</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="nidss_dengue" /> NIDSS - Dengue (source: <a target="_blank" href="http://nidss.cdc.gov.tw/en/SingleDisease.aspx?dc=1&amp;dt=4&amp;disease=061&amp;position=1">nidss.cdc.gov.tw</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="sensors" /> Delphi Sensors (source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="nowcast" /> Delphi Nowcast (source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="covidcast" /> Delphi COVIDcast (source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</label>
         <label><input class="uk-radio" type="radio" name="dataSource"  bind:group={dataSource} value="covid_hosp" /> COVID Hospitalization (source: <a target="_blank" href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-state-timeseries">healthdata.gov</a>)</label>
      </div>
    </div>
  </form>

  TODO

         <div class="csv_options" id="radio_fluview_options">
            <div class="option_label">
               <select name="select_fluview_region" id="select_fluview_region">
                 // TODO
               </select>
            </div><span class="explanation">(region to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="fluview_issue_radio" id="radio_fluview_recent" checked /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="fluview_issue_radio" id="radio_fluview_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific week)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="fluview_issue_radio" id="radio_fluview_offset" /> Lagged Data</label></div><span class="explanation">(fetch data lagged by a number of weeks)</span>
            <br />
            <div class="csv_options" id="radio_fluview_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_fluview_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_fluview_static" value="201520" /> What MMWR week should the data come from?</label></div> <span class="explanation">(format: YYYYWW)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_fluview_offset_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_fluview_offset" value="0" /> How many weeks is the data lagged by?</label></div> <span class="explanation">(a non-negative integer)</span>
               <br />
            </div>
            <div class="option_label">
               <input type="text" name="text_fluview_auth" id="text_fluview_auth" size="8" />
            </div><span class="explanation">(authorization token; required for imputed data for non-participating states; in any case, the API will return data for regions and participating states)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_flusurv_options" style="display: none;">
            <div class="option_label">
               <select name="select_flusurv_location" id="select_flusurv_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="flusurv_issue_radio" id="radio_flusurv_recent" checked /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="flusurv_issue_radio" id="radio_flusurv_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific week)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="flusurv_issue_radio" id="radio_flusurv_offset" /> Lagged Data</label></div><span class="explanation">(fetch data lagged by a number of weeks)</span>
            <br />
            <div class="csv_options" id="radio_flusurv_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_flusurv_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_flusurv_static" value="201520" /> What MMWR week should the data come from?</label></div> <span class="explanation">(format: YYYYWW)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_flusurv_offset_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_flusurv_offset" value="0" /> How many weeks is the data lagged by?</label></div> <span class="explanation">(a non-negative integer)</span>
               <br />
            </div>
         </div>
         <div class="csv_options" id="radio_gft_options" style="display: none;">
            <div class="option_label">
               <select name="select_gft_location" id="select_gft_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_ght_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_ght_auth" id="text_ght_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_ght_location" id="select_ght_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label">
               <input type="text" name="text_ght_query" id="text_ght_query" />
            </div><span class="explanation">(search query or topic ID)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_twitter_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_twitter_auth" id="text_twitter_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_twitter_location" id="select_twitter_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label">
               <select name="select_twitter_resolution" id="select_twitter_resolution">
                  <option value="daily" selected>Daily</option>
                  <option value="weekly">Weekly</option>
               </select>
            </div><span class="explanation">(temporal resolution)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_wiki_options" style="display: none;">
            <div class="option_label">
               <select name="select_wiki_article" id="select_wiki_article">

               </select>
            </div><span class="explanation">(article to filter data by)</span>
            <br />
            <div class="option_label">
               <select name="select_wiki_resolution" id="select_wiki_resolution">
                  <option value="daily" selected>Daily</option>
                  <option value="weekly">Weekly</option>
               </select>
            </div><span class="explanation">(temporal resolution)</span>
            <br />
            <div class="option_label"><label><input type="checkbox" id="check_wiki_hour" /> Specific Hour</label></div><span class="explanation">(filter by hour of day, otherwise return sum of all counts)</span>
            <br />
            <div class="csv_options" id="check_wiki_hour_options" style="display: none;">
               <label><input type="text" id="text_wiki_hour" value="0" /> Which hour should be used? <span class="explanation">(0-23, timezone is UTC)</span></label>
            </div>
            <br />
         </div>
         <div class="csv_options" id="radio_cdc_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_cdc_auth" id="text_cdc_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_cdc_location" id="select_cdc_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_quidel_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_quidel_auth" id="text_quidel_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_quidel_location" id="select_quidel_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_nidss_flu_options" style="display: none;">
            <div class="option_label">
               <select name="select_nidss_flu_region" id="select_nidss_flu_region">

               </select>
            </div><span class="explanation">(region to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_recent" checked /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific week)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_offset" /> Lagged Data</label></div><span class="explanation">(fetch data lagged by a number of weeks)</span>
            <br />
            <div class="csv_options" id="radio_nidss_flu_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_nidss_flu_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_nidss_flu_static" value="201530" /> What week was the data published?</label></div> <span class="explanation">(format: YYYYWW)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_nidss_flu_offset_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_nidss_flu_offset" value="1" /> How many weeks is the data lagged by?</label></div> <span class="explanation">(a positive integer)</span>
               <br />
            </div>
         </div>
         <div class="csv_options" id="radio_nidss_dengue_options" style="display: none;">
            <div class="option_label">
               <select name="select_nidss_dengue_location" id="select_nidss_dengue_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_sensors_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_sensors_auth" id="text_sensors_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_sensors_name" id="select_sensors_name">

               </select>
            </div><span class="explanation">(data source from which signal is built)</span>
            <br />
            <div class="option_label">
               <select name="select_sensors_location" id="select_sensors_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_nowcast_options" style="display: none;">
            <div class="option_label">
               <select name="select_nowcast_location" id="select_nowcast_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_covid_hosp_options" style="display: none;">
            <div class="option_label">
               <select name="select_covid_hosp_state" id="select_covid_hosp_state">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="covid_hosp_issue_radio" id="radio_covid_hosp_recent" checked /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="covid_hosp_issue_radio" id="radio_covid_hosp_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific date)</span>
            <br />
            <div class="csv_options" id="radio_covid_hosp_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_covid_hosp_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_covid_hosp_static" value="20201116" /> What date was the dataset published?</label></div> <span class="explanation">(format: YYYYMMDD)</span>
               <br />
            </div>
         </div>
         <div class="csv_options" id="radio_covidcast_options" style="display: none;">
            <div class="option_label">
               <select name="select_covidcast_source" id="select_covidcast_data_source">
               <!-- populated on page load using API endpoint `covidcast_meta` -->
               </select>
            </div><span class="explanation">(upstream data source)</span>
            <br />
            <div class="option_label">
               <select name="select_covidcast_signal" id="select_covidcast_signal">
               <!-- populated on page load using API endpoint `covidcast_meta` -->
               </select>
            </div><span class="explanation">(delphi indicator name)</span>
            <br />
            <div class="option_label">
               <select name="select_covidcast_geo_type" id="select_covidcast_geo_type">
               <!-- populated on page load using API endpoint `covidcast_meta` -->
               </select>
            </div><span class="explanation">(geographic resolution)</span>
            <br />
            <div class="option_label">
               <input type="text" name="text_covidcast_geo_value" id="text_covidcast_geo_value" />
            </div><span class="explanation">(location, e.g. 'PA' or '42003')</span>
            <br />
         </div>
  <button slot="footer" class="uk-button" type="button" form={id}>Fetch Data</button>
</Dialog>
