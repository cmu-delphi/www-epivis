import { get, writable } from 'svelte/store';
import { NavMode } from './components/chartUtils';
import DataSet, { DataGroup, DEFAULT_GROUP, SAMPLE_DATASET } from './data/DataSet';

export const datasetTree = writable<DataGroup>(DEFAULT_GROUP);
export const activeDatasets = writable([SAMPLE_DATASET]);
export const expandedDataGroups = writable([DEFAULT_GROUP]);

export const isShowingPoints = writable(false);
export const navMode = writable(NavMode.pan);

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

interface ILinkConfig {
  chart: {
    viewport: [number, number, number, number];
    showPoints: boolean;
  };
  datasets: {
    color: string;
    title: string;
    params: Record<string, unknown>;
  }[];
}

export interface IChart {
  fitData(): boolean;
  getViewPort(): [number, number, number, number];
  getCanvas(): HTMLCanvasElement;
}

export function getDirectLink(chart: IChart): { url: URL; anySkipped: boolean } {
  const config: ILinkConfig = {
    chart: {
      viewport: chart.getViewPort(),
      showPoints: get(isShowingPoints),
    },
    datasets: [],
  };
  let anySkipped = false;
  get(activeDatasets).forEach((data) => {
    if (data.params) {
      config.datasets.push({
        color: data.color,
        title: data.title,
        params: data.params,
      });
    } else {
      console.log('unable to get direct link to dataset:', data.title);
      anySkipped = true;
    }
  });
  const url = new URL(window.location.href);
  url.hash = `#${btoa(JSON.stringify(config))}`;
  return {
    url,
    anySkipped,
  };
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
