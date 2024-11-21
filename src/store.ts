import { get, writable } from 'svelte/store';
import { NavMode } from './components/chartUtils';
import DataSet, { DataGroup } from './data/DataSet';
import deriveLinkDefaults, { getDirectLinkImpl } from './deriveLinkDefaults';

declare const __VERSION__: string;

export const version = __VERSION__;

const defaults = deriveLinkDefaults();

export const datasetTree = writable<DataGroup>(defaults.group);
export const activeDatasets = writable(defaults.active);
export const expandedDataGroups = writable([defaults.group]);

export const isShowingPoints = writable(defaults.showPoints);
export const initialViewport = writable(defaults.viewport);
export const navMode = writable(NavMode.autofit);

export function getStoreApiKeys() {
  if (localStorage.getItem('store-api-key')) {
    try {
      // if we saved it, return it (as a boolean)
      return localStorage.getItem('store-api-key') === 'true';
    } catch {
      // if parsing fails, saved value is bad, so clear it out
      localStorage.removeItem('store-api-key');
    }
  }
  // if parsing fails, return default of 'false'
  return false;
}

export function getApiKey() {
  if (localStorage.getItem('api-key')) {
    try {
      return localStorage.getItem('api-key')!;
    } catch {
      localStorage.removeItem('api-key');
    }
  }
  return '';
}

export const storeApiKeys = writable(getStoreApiKeys());
storeApiKeys.subscribe((val) => {
  if (!val) {
    // reset local storage if user decides not to store API keys
    localStorage.removeItem('api-key');
  } else {
    // persist API key if user decides to store API keys
    const apiKey = sessionStorage.getItem('api-key')!;
    if (apiKey) {
      localStorage.setItem('api-key', apiKey);
    }
  }
  // store the preference either way
  localStorage.setItem('store-api-key', val.toString());
});

export const apiKey = writable(getApiKey());
apiKey.subscribe((val) => {
  if (localStorage.getItem('store-api-key') === 'true') {
    // store it in local storage (persistent)
    localStorage.setItem('api-key', val.toString());
  } else {
    // keep it around in session storage (resets on page refresh)
    sessionStorage.setItem('api-key', val.toString());
  }
});

export function addDataSet(dataset: DataSet | DataGroup): void {
  const root = get(datasetTree);
  root.datasets.push(dataset);
  datasetTree.set(root); // set tree to trigger updates
  // const ds = flatten(dataset);

  if (dataset instanceof DataGroup) {
    // auto expand
    expandedDataGroups.set([...get(expandedDataGroups), dataset]);
  } else {
    activeDatasets.set([...get(activeDatasets), dataset]);
  }
}

if (defaults.loader) {
  void defaults.loader(addDataSet).then((ds) => {
    datasetTree.set(get(datasetTree));
    activeDatasets.set(ds);
    initialViewport.set(get(initialViewport)); // trigger update
  });
}

export interface IChart {
  fitData(animate?: boolean): boolean;
  getViewport(): [number, number, number, number];
  getCanvas(): HTMLCanvasElement;
}

export function getDirectLink(chart: IChart): { url: URL; anySkipped: boolean } {
  return getDirectLinkImpl({
    group: get(datasetTree),
    active: get(activeDatasets),
    showPoints: get(isShowingPoints),
    viewport: chart.getViewport(),
  });
}

export function randomizeColors(): void {
  activeDatasets.set(
    get(activeDatasets).map((dataset) => {
      dataset.randomize();
      return dataset;
    }),
  );
}

export function reset(): void {
  activeDatasets.set(
    get(activeDatasets).map((dataset) => {
      dataset.reset();
      return dataset;
    }),
  );
}

export function scaleMean(): void {
  activeDatasets.set(
    get(activeDatasets).map((dataset) => {
      dataset.scaleMean();
      return dataset;
    }),
  );
}
