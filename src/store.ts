import { get, writable } from 'svelte/store';
import { NavMode } from './components/chartUtils';
import { DataGroup, SAMPLE_DATASET } from './data/DataSet';

const defaultGroup: DataGroup = { title: 'All Datasets', datasets: [SAMPLE_DATASET], level: 0 };
export const datasetTree = writable<DataGroup>(defaultGroup);
export const activeDatasets = writable([SAMPLE_DATASET]);
export const expandedDataGroups = writable([defaultGroup]);

export const isShowingPoints = writable(false);
export const navMode = writable(NavMode.crop);

interface ILinkConfig {
  chart: {
    viewport: [number, number, number, number];
    showPoints: boolean;
  };
  datasets: {
    color: string;
    title: string;
    parentTitle: string;
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
        parentTitle: data.parentTitle,
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