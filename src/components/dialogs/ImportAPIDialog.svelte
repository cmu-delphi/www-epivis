<script lang="ts">
  import FluSurv from './dataSources/FluSurv.svelte';
  import FluView from './dataSources/FluView.svelte';

  import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from './utils';
  import type { DataGroup } from '../../data/DataSet';
  import Gft from './dataSources/GFT.svelte';
  import GHT from './dataSources/GHT.svelte';
  import Twitter from './dataSources/Twitter.svelte';
  import Wiki from './dataSources/Wiki.svelte';
  import Quidel from './dataSources/Quidel.svelte';
  import NidssDengue from './dataSources/NIDSSDengue.svelte';
  import NidssFlu from './dataSources/NIDSSFlu.svelte';

  const dispatch = createEventDispatcher();

  const id = randomId();

  let dataSource:
    | 'fluview'
    | 'flusurv'
    | 'gft'
    | 'ght'
    | 'twitter'
    | 'wiki'
    | 'cdc'
    | 'quidel'
    | 'nidss_flu'
    | 'nidss_denque'
    | 'sensors'
    | 'nowcast'
    | 'covidcast'
    | 'covid_hosp' = 'fluview';

  let handler: unknown = null;
  function onSubmit(e: Event) {
    e.preventDefault();
    if (!handler) {
      return;
    }
    // eslint-disable-next-line no-unused-vars
    (handler as { importDataSet: () => Promise<DataGroup> }).importDataSet().then((ds) => dispatch('imported', ds));
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
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="fluview" />
          FluView (source:
          <a target="_blank" href="https://gis.cdc.gov/grasp/fluview/fluportaldashboard.html">cdc.gov</a>)
        </label>
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="flusurv" /> FluSurv
          (source: <a target="_blank" href="https://gis.cdc.gov/GRASP/Fluview/FluHospRates.html">cdc.gov</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="gft" /> Google Flu
          Trends (source: <a target="_blank" href="https://www.google.org/flutrends/">google.com</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="ght" /> Google Health Trends
          (source: private Google API)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="twitter" />
          HealthTweets (source: <a target="_blank" href="http://www.healthtweets.org/">healthtweets.org</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="wiki" /> Wikipedia
          Access (source:
          <a target="_blank" href="https://dumps.wikimedia.org/other/pagecounts-raw/">dumps.wikimedia.org</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="cdc" /> CDC Page Hits (source:
          private CDC dataset)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="quidel" /> Quidel Data (source:
          private Quidel dataset)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="nidss_flu" /> NIDSS -
          Influenza (source:
          <a target="_blank" href="http://nidss.cdc.gov.tw/en/CDCWNH01.aspx?dc=wnh">nidss.cdc.gov.tw</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="nidss_dengue" /> NIDSS
          - Dengue (source:
          <a
            target="_blank"
            href="http://nidss.cdc.gov.tw/en/SingleDisease.aspx?dc=1&amp;dt=4&amp;disease=061&amp;position=1"
            >nidss.cdc.gov.tw</a
          >)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="sensors" /> Delphi
          Sensors (source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="nowcast" /> Delphi
          Nowcast (source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="covidcast" /> Delphi
          COVIDcast (source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="covid_hosp" /> COVID
          Hospitalization (source:
          <a
            target="_blank"
            href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-state-timeseries"
            >healthdata.gov</a
          >)</label
        >
      </div>
    </div>

    {#if dataSource === 'fluview'}
      <FluView {id} bind:this={handler} />
    {:else if dataSource === 'flusurv'}
      <FluSurv {id} bind:this={handler} />
    {:else if dataSource === 'gft'}
      <Gft {id} bind:this={handler} />
    {:else if dataSource === 'ght'}
      <GHT {id} bind:this={handler} />
    {:else if dataSource === 'twitter'}
      <Twitter {id} bind:this={handler} />
    {:else if dataSource === 'wiki'}
      <Wiki {id} bind:this={handler} />
    {:else if dataSource === 'quidel'}
      <Quidel {id} bind:this={handler} />
    {:else if dataSource === 'nidss_denque'}
      <NidssDengue {id} bind:this={handler} />
    {:else if dataSource === 'nidss_flu'}
      <NidssFlu {id} bind:this={handler} />
    {/if}
  </form>

  <button slot="footer" class="uk-button" type="submit" form={id}>Fetch Data</button>
</Dialog>
