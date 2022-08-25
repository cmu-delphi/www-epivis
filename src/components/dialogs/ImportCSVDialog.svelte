<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import importDataSet from '../../data/importCSV';
  import type { CSVOptions } from '../../data/importCSV';

  import Dialog from './Dialog.svelte';
  import { randomId } from './utils';

  const dispatch = createEventDispatcher();

  const id = randomId();

  let file: File | null = null;
  let transpose = false;
  let hasHeader = true;
  let dateType: 'none' | CSVOptions['dateType'] = 'simple';
  let hasGroup = false;
  let groupColumn = '1';

  let fileContent = '';

  $: previewContent = fileContent.split('\n').slice(0, 5).join('\n');

  let dateColumn = '0';
  let dateColumn1 = '1';

  function onSubmit(e: Event) {
    e.preventDefault();
    dispatch(
      'imported',
      importDataSet(file!, fileContent, {
        transpose,
        hasHeader,
        dateType: dateType == 'none' ? null : dateType,
        dateFormat: dateType == 'simple' ? 'yyyy-MM-dd' : 'undefined',
        dateCol1: Number.parseInt(dateColumn, 10),
        dateCol2: Number.parseInt(dateColumn1, 10),
        hasGroup,
        groupColumn: Number.parseInt(groupColumn, 10),
      }),
    );
  }

  $: {
    if (file) {
      readFile(file);
    } else {
      fileContent = '';
    }
  }

  function resolveInlineConfig(fileContent: string): CSVOptions | null {
    const index = fileContent.indexOf('\n');
    if (index < 0) {
      return null;
    }
    const line = fileContent.slice(0, index).trim();
    if (!line.startsWith('#{') || !line.endsWith('}')) {
      return null;
    }
    return JSON.parse(line.slice(1));
  }

  $: {
    let inlineConfig = resolveInlineConfig(fileContent);
    if (inlineConfig) {
      dispatch('imported', importDataSet(file!, fileContent, inlineConfig));
    }
  }

  function readFile(file: File) {
    if (
      file.type !== 'text/csv' &&
      file.type !== 'application/vnd.ms-excel' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      if (
        !confirm(
          `*Unknown file type.*\n\nBrowser reports mime type of [${file.type}]; expected [text/csv].\n\nAttempt to load anyway?`,
        )
      ) {
        return;
      }
    }

    if (file.size > 1 << 20) {
      if (!confirm(`*Large file.*\n\nBrowser reports file size of [${file.size}bytes].\n\nAttempt to load anyway?`)) {
        return;
      }
    }
    const reader = new FileReader();
    reader.onload = function () {
      fileContent = reader.result!.toString();
    };
    reader.onerror = function () {
      alert('Failed to read file: ' + reader.error);
    };
    reader.readAsText(file);
  }

  function loadFile(e: Event) {
    file = (e.currentTarget as HTMLInputElement)!.files![0] || null;
  }
</script>

<Dialog title="Load from CSV File" on:close>
  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    <div>
      <label class="uk-form-label" for="{id}-f">Select Local File</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="file" required id="{id}-f" on:change={loadFile} />
      </div>
    </div>
    <div>
      <div class="uk-form-label">Preview</div>
      <div class="uk-form-controls">
        <textarea
          class="uk-textarea"
          placeholder="Select a file above to preview its contents."
          readonly
          rows="5"
          wrap="off"
          style="width: 100%;"
          value={previewContent}
        />
      </div>
    </div>
    <div>
      <div class="uk-form-label">Transpose Table</div>
      <div class="uk-form-controls uk-form-controls-text">
        <label
          ><input class="uk-checkbox" type="checkbox" bind:checked={transpose} /> Transpose (treat rows as columns and vice
          versa)</label
        >
      </div>
    </div>
    <div>
      <div class="uk-form-label">Has Header Row</div>
      <div class="uk-form-controls uk-form-controls-text">
        <label
          ><input class="uk-checkbox" type="checkbox" bind:checked={hasHeader} /> Has Header Row (extract column names, then
          discard first row)</label
        >
      </div>
    </div>
    <div>
      <div class="uk-form-label">Date Column Format</div>
      <div class="uk-form-controls uk-form-controls-text">
        <label
          ><input class="uk-radio" type="radio" name="dateType" bind:group={dateType} value="none" /> No Date Column (assume
          daily starting on 2000-01-01)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dateType" bind:group={dateType} value="simple" /> Date String (format:
          YYYY-MM-DD; ex: 2015-05-02)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dateType" bind:group={dateType} value="epiweek" /> Epiweek (format:
          YYYYWW; ex: 201522)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dateType" bind:group={dateType} value="epi" /> Epi Week (format: YYYY,
          WW; ex: 2015, 22)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dateType" bind:group={dateType} value="decimal" />Decimal Date
          (format: YYYY.YYY; ex: 2015.456)</label
        >
        <label
          ><input class="uk-radio" type="radio" name="dateType" bind:group={dateType} value="monthly" />Montly Data
          (format: YYYY, MM; ex: 2015, 05)</label
        >
      </div>
    </div>
    {#if dateType === 'simple'}
      <div>
        <label class="uk-form-label" for="{id}-yo">Which column contains dates?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-yo" bind:value={dateColumn} />
        </div>
      </div>
    {:else if dateType === 'epiweek'}
      <div>
        <label class="uk-form-label" for="{id}-yo"> Which column contains the epiweek?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-yo" bind:value={dateColumn} />
        </div>
      </div>
    {:else if dateType === 'epi'}
      <div>
        <label class="uk-form-label" for="{id}-yo"> Which column contains the epi year?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-yo" bind:value={dateColumn} />
        </div>
      </div>
      <div>
        <label class="uk-form-label" for="{id}-mo"> Which column contains the epi week?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-mo" bind:value={dateColumn1} />
        </div>
      </div>
    {:else if dateType === 'decimal'}
      <div>
        <label class="uk-form-label" for="{id}-yo"> Which column contains dates?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-yo" bind:value={dateColumn} />
        </div>
      </div>
    {:else if dateType === 'monthly'}
      <div>
        <label class="uk-form-label" for="{id}-yo"> Which column contains the year?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" for="{id}-yo" required bind:value={dateColumn} />
        </div>
      </div>
      <div>
        <label class="uk-form-label" for="{id}-mo"> Which column contains the month?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-mo" bind:value={dateColumn1} />
        </div>
      </div>
    {/if}
    <div>
      <div class="uk-form-label">Group By Column?</div>
      <div class="uk-form-controls uk-form-controls-text">
        <label
          ><input class="uk-checkbox" type="checkbox" bind:checked={hasGroup} /> Group By (for when multiple overlapping
          time series are in the same file; ex: FluView Regional data)</label
        >
      </div>
    </div>
    {#if hasGroup}
      <div>
        <label class="uk-form-label" for="{id}-gc">Which column should be grouped?</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" required id="{id}-gc" bind:value={groupColumn} />
        </div>
      </div>
    {/if}
  </form>

  <button slot="footer" class="uk-button uk-button-primary" type="submit" form={id}>Import File</button>
</Dialog>
