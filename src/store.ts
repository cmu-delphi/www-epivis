import { get, writable } from 'svelte/store';
import DataSet, { DataGroup, flatten } from './data/DataSet';
import deriveLinkDefaults, { getDirectLinkImpl } from './deriveLinkDefaults';
import FormSelections from './components/dialogs/formSelections';
import { apiKey, expandedDataGroups, storeApiKeys } from './apiState';

// Re-exported so consumers can keep importing them from the store, even though they
// are declared in a leaf module to keep the module graph acyclic (see apiState.ts).
export { apiKey, expandedDataGroups, storeApiKeys };

declare const __VERSION__: string;

export const version = __VERSION__;

const defaults = deriveLinkDefaults();

export const datasetTree = writable<DataGroup>(defaults.group);
export const activeDatasets = writable(defaults.active);
// Must stay above the `defaults.loader` call at the bottom of this module: that
// call reaches EpiData importers which read this store synchronously.
expandedDataGroups.set([defaults.group]);

export const isShowingPoints = writable(defaults.showPoints);
export const initialViewport = writable(defaults.viewport);
export const navMode = writable(defaults.navMode);
export const isHoverTooltip = writable(defaults.isHoverTooltip);

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

const MAX_DEFAULT_ENABLED_DATASETS = 10;

export function addDataSet(dataset: DataSet | DataGroup): void {
  const root = get(datasetTree);
  root.datasets.push(dataset);
  datasetTree.set(root); // set tree to trigger updates
  // const ds = flatten(dataset);

  if (dataset instanceof DataGroup) {
    // auto expand
    expandedDataGroups.set([...get(expandedDataGroups), dataset]);
    // add defaultEnabled datasets to the list of active datasets, capped so a
    // group with many datasets (e.g. NWSS with many sewersheds) doesn't enable
    // everything at once; the rest stay togglable via the eye icon
    const toActivate: DataSet[] = [];
    for (const ds of dataset.datasets) {
      if (toActivate.length >= MAX_DEFAULT_ENABLED_DATASETS) {
        break;
      }
      if (ds instanceof DataSet && dataset.defaultEnabled.includes(ds.title)) {
        toActivate.push(ds);
      }
    }
    activeDatasets.set([...get(activeDatasets), ...toActivate]);
  } else {
    activeDatasets.set([...get(activeDatasets), dataset]);
  }
}

function collectGroups(node: DataSet | DataGroup, out: DataGroup[]): void {
  if (node instanceof DataGroup) {
    out.push(node);
    node.datasets.forEach((child) => collectGroups(child, out));
  }
}

export function removeDataSet(item: DataSet | DataGroup): void {
  const root = get(datasetTree);
  const index = root.datasets.indexOf(item);
  if (index === -1) {
    return;
  }
  root.datasets.splice(index, 1);
  datasetTree.set(root);

  const groupsToRemove: DataGroup[] = [];
  collectGroups(item, groupsToRemove);
  if (groupsToRemove.length > 0) {
    expandedDataGroups.set(get(expandedDataGroups).filter((g) => !groupsToRemove.includes(g)));
  }

  const leavesToRemove = flatten(item);
  activeDatasets.set(get(activeDatasets).filter((d) => !leavesToRemove.includes(d)));
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
    isHoverTooltip: get(isHoverTooltip),
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
