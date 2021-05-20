import { get, writable } from 'svelte/store';
import { NavMode } from './components/Chart';
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

export function getDirectLink(): { url: URL; anySkipped: boolean } {
  const config: ILinkConfig = {
    chart: {
      viewport: [0, 0, 0, 0], // TODO: chart.getViewport(),
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
