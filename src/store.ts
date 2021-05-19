import { writable } from 'svelte/store';
import { DataGroup, SAMPLE_DATASET } from './data/DataSet';

const defaultGroup: DataGroup = { title: 'All Datasets', datasets: [SAMPLE_DATASET], level: 0 };
export const datasetTree = writable<DataGroup>(defaultGroup);
export const activeDatasets = writable([SAMPLE_DATASET]);
export const expandedDataGroups = writable([defaultGroup]);
