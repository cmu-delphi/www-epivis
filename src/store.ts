import { get, writable } from 'svelte/store';
import DataSet, { DataGroup } from './data/DataSet';
import deriveLinkDefaults, { getDirectLinkImpl } from './deriveLinkDefaults';
import FormSelections from './components/dialogs/formSelections';

declare const __VERSION__: string;

export const version = __VERSION__;

const defaults = deriveLinkDefaults();

export const datasetTree = writable<DataGroup>(defaults.group);
export const activeDatasets = writable(defaults.active);
export const expandedDataGroups = writable([defaults.group]);

export const isShowingPoints = writable(defaults.showPoints);
export const initialViewport = writable(defaults.viewport);
export const navMode = writable(defaults.navMode);

export function getFormSelections() {
  try {
    if (sessionStorage.getItem('form')) {
      return JSON.parse(sessionStorage.getItem('form')!) as FormSelections;
    }
  } catch {
    // we are probably here because parsing failed, so remove bad JSON from sessionStorage
    sessionStorage.removeItem('form');
  }
  return new FormSelections();
}

export const formSelections = writable(getFormSelections());
formSelections.subscribe((val) => {
  sessionStorage.setItem('form', JSON.stringify(val));
});

export const apiKey = writable(localStorage.getItem('api-key')! || '');
apiKey.subscribe((val) => {
  // always keep key in session storage (resets on window close)
  sessionStorage.setItem('api-key', val);
  if (localStorage.getItem('store-api-key') === 'true') {
    // if flag set, also store key in local persistent storage
    localStorage.setItem('api-key', val);
  }
});

export const storeApiKeys = writable(localStorage.getItem('store-api-key') === 'true');
storeApiKeys.subscribe((val) => {
  localStorage.setItem('store-api-key', val.toString());
  if (val) {
    // persist key from session to local storage
    localStorage.setItem('api-key', sessionStorage.getItem('api-key') || '');
  } else {
    // remove key from local storage
    localStorage.removeItem('api-key');
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
    // add defaultEnabled datasets to the list of active datasets
    for (const ds of dataset.datasets) {
      if (ds instanceof DataSet && dataset.defaultEnabled.includes(ds.title)) {
        activeDatasets.set([...get(activeDatasets), ds]);
      }
    }
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
    navMode: get(navMode),
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
