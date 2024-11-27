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
  import Cdc from './dataSources/CDC.svelte';
  import Sensors from './dataSources/Sensors.svelte';
  import NowCast from './dataSources/Nowcast.svelte';
  import CovidHosp from './dataSources/COVIDHosp.svelte';
  import CoviDcast from './dataSources/COVIDcast.svelte';
  import { navMode, storeApiKeys } from '../../store';
  import { NavMode } from '../chartUtils';

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
    | 'nidss_dengue'
    | 'sensors'
    | 'nowcast'
    | 'covidcast'
    | 'covid_hosp' = 'fluview';

  let loading = false;
  let handler: unknown = null;

  function onSubmit(e: Event) {
    e.preventDefault();
    if (!handler) {
      return;
    }
    // eslint-disable-next-line no-unused-vars
    loading = true;
    (handler as { importDataSet: () => Promise<DataGroup> }).importDataSet().then((ds) => {
      loading = false;
      if (ds) {
        dispatch('imported', ds);
        // reset viewport and make sure new data is displayed
        $navMode = NavMode.autofit;
      } else {
        dispatch('close');
      }
    });
  }
</script>

<Dialog title="Load from Epidata API" on:close>
  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    <div>
      <div class="uk-form-label">Data Source</div>
      <div class="uk-form-controls uk-form-controls-text">
        <label
          ><input class="uk-radio" type="radio" name="dataSource" bind:group={dataSource} value="fluview" />
          ILINet (aka FluView) (source:
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
    {:else if dataSource === 'nidss_dengue'}
      <NidssDengue {id} bind:this={handler} />
    {:else if dataSource === 'nidss_flu'}
      <NidssFlu {id} bind:this={handler} />
    {:else if dataSource === 'cdc'}
      <Cdc {id} bind:this={handler} />
    {:else if dataSource === 'sensors'}
      <Sensors {id} bind:this={handler} />
    {:else if dataSource === 'nowcast'}
      <NowCast {id} bind:this={handler} />
    {:else if dataSource === 'covid_hosp'}
      <CovidHosp {id} bind:this={handler} />
    {:else if dataSource === 'covidcast'}
      <CoviDcast {id} bind:this={handler} />
    {/if}
  </form>

  <div slot="footer">
    <div class="uk-form-controls uk-form-controls-text container">
      <button class="uk-button uk-button-primary" type="submit" form={id} disabled={loading}>
        Fetch Data
        {#if loading}
          <div uk-spinner />
        {/if}
      </button>
      <label
        ><input class="uk-checkbox" type="checkbox" bind:checked={$storeApiKeys} />
        Save API key (auth token) between visits</label
      >
    </div>
  </div>
</Dialog>

<style>
  .container {
    display: flex;
    align-items: center;
    column-gap: 2em;
  }
</style>
