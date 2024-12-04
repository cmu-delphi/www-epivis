import {
  importCDC,
  importCOVIDHosp,
  importCOVIDcast,
  importFluSurv,
  importFluView,
  importGFT,
  importGHT,
  importNIDSSDengue,
  importNIDSSFlu,
  importNowcast,
  importQuidel,
  importSensors,
  importTwitter,
  importWiki,
} from './api/EpiData';
import DataSet, { DataGroup, DEFAULT_GROUP, flatten, DEFAULT_VIEWPORT } from './data/DataSet';
import EpiDate from './data/EpiDate';
import EpiPoint from './data/EpiPoint';

export interface ILinkConfig {
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

export interface SharedState {
  group: DataGroup;
  active: DataSet[];
  viewport: null | [number, number, number, number];
  showPoints: boolean;
}

const DEFAULT_VALUES: SharedState = {
  group: DEFAULT_GROUP,
  active: [],
  viewport: DEFAULT_VIEWPORT,
  showPoints: false,
};

const lookups = {
  cdc: importCDC,
  cdcp: importCDC,
  covid_hosp: importCOVIDHosp,
  covidcast: importCOVIDcast,
  flusurv: importFluSurv,
  fluview: importFluView,
  gft: importGFT,
  ght: importGHT,
  nidss_dengue: importNIDSSDengue,
  nidss_flu: importNIDSSFlu,
  nowcast: importNowcast,
  quidel: importQuidel,
  sensors: importSensors,
  twtr: importTwitter,
  twitter: importTwitter,
  wiki: importWiki,
} as unknown as Record<string, (args: Record<string, unknown>) => Promise<DataGroup | null>>;

const argOrders: Record<string, string[]> = {
  cdc: ['auth', 'locations'],
  cdcp: ['auth', 'locations'],
  covidcast: ['data_source', 'signal', 'time_type', 'geo_type', 'geo_value'],
  covid_hosp: ['states', 'issues'],
  flusurv: ['locations', 'issues', 'lag'],
  fluview: ['regions', 'issues', 'lag', 'auth'],
  gft: ['locations'],
  ght: ['auth', 'locations', 'query'],
  nidss_dengue: ['locations'],
  nidss_flu: ['regions', 'issues', 'lag'],
  nowcast: ['locations'],
  quidel: ['auth', 'locations'],
  sensors: ['auth', 'names', 'locations'],
  twitter: ['auth', 'locations', 'resolution'],
  twtr: ['auth', 'locations', 'resolution'],
  wiki: ['articles', 'resolution', 'hour'],
};

function endpointParams(endpoint: string, params: unknown[]): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  const args = argOrders[endpoint];
  if (args) {
    args.forEach((arg, i) => {
      r[arg] = params[i];
    });
  }
  return r;
}

function patchDataSet(title: string, color: string) {
  return (dg: DataGroup | null) => {
    if (!dg) {
      return null;
    }
    const datasets = flatten(dg);
    const d = datasets.find((di) => di.title === title);
    if (d) {
      d.color = color;
    }
    return d;
  };
}

export function initialLoader(datasets: ILinkConfig['datasets']) {
  return (add: (dataset: DataSet | DataGroup) => void): Promise<DataSet[]> => {
    const resolvedDataSets: (Promise<DataSet | null | undefined> | DataSet)[] = [];
    const loadingDataSets: Map<string, Promise<DataGroup | null>> = new Map();

    function loadImpl(title: string, color: string, endpoint: string, params: Record<string, unknown>) {
      const func = lookups[endpoint];
      if (!func) {
        console.warn('cannot load data', params);
        return;
      }
      const key = `${endpoint}:${JSON.stringify(params)}`;
      const existing = loadingDataSets.get(key);
      if (existing) {
        resolvedDataSets.push(existing.then(patchDataSet(title, color)));
      } else {
        const loadingDataSet = func(params);
        loadingDataSets.set(key, loadingDataSet);
        resolvedDataSets.push(loadingDataSet.then(patchDataSet(title, color)));
      }
    }

    for (const ds of datasets) {
      if (ds.params && ds.params._type === 'line') {
        const d = new DataSet(
          [
            new EpiPoint(EpiDate.fromIndex(ds.params.x0 as number), ds.params.v0 as number),
            new EpiPoint(EpiDate.fromIndex(ds.params.x1 as number), ds.params.v1 as number),
          ],
          ds.title,
          ds.params,
          ds.color,
        );
        add(d);
        resolvedDataSets.push(d);
        continue;
      }
      if (ds.params && ds.params._endpoint) {
        loadImpl(ds.title, ds.color, ds.params._endpoint as string, ds.params);
      } else if (ds.params && Array.isArray(ds.params)) {
        // old version
        const endpoint = ds.params.shift() as string;
        loadImpl(ds.title, ds.color, endpoint, endpointParams(endpoint, ds.params));
      }
    }

    return Promise.all(resolvedDataSets).then((data) => {
      const cleaned = data.filter((d): d is DataSet => d != null);
      cleaned.forEach((d) => {
        if (d.params && !Array.isArray(d.params) && d.params._custom_title) {
          // use custom title string if provided in encoded parameters
          d.title = d.params._custom_title;
        } else if (d.params && !Array.isArray(d.params) && d.params._endpoint) {
          // otherwise, construct title from relevant parameters
          /* eslint-disable @typescript-eslint/restrict-template-expressions */
          const col_name = d.title;
          d.title = `${d.params._endpoint}`;
          if (d.params.data_source && d.params.signal) {
            d.title += ` > ${d.params.data_source}:${d.params.signal}`;
          }
          if (d.params.geo_type && d.params.geo_value) {
            d.title += ` > ${d.params.geo_type}:${d.params.geo_value}`;
          }
          if (d.params.regions) {
            d.title += ` > ${d.params.regions}`;
          }
          d.title += ` > ${col_name}`;
          /* eslint-enable @typescript-eslint/restrict-template-expressions */
        }
        add(d);
      });
      return cleaned;
    });
  };
}

export default function deriveLinkDefaults(): SharedState & { loader?: ReturnType<typeof initialLoader> } {
  const url = new URL(location.href);
  const hash = url.hash.slice(1);
  if (!hash) {
    return DEFAULT_VALUES;
  }
  try {
    const parsed = JSON.parse(atob(hash)) as ILinkConfig;
    return {
      ...DEFAULT_VALUES,
      active: [],
      showPoints: parsed.chart?.showPoints ?? DEFAULT_VALUES.showPoints,
      viewport: parsed.chart?.viewport ?? DEFAULT_VALUES.viewport,
      loader: initialLoader(parsed.datasets),
    };
  } catch (err) {
    history.pushState(null, document.title, '#');
    console.warn('invalid state in url', err);
    return DEFAULT_VALUES;
  }
}

export function getDirectLinkImpl(state: SharedState): { url: URL; anySkipped: boolean } {
  const config: ILinkConfig = {
    chart: {
      viewport: state.viewport ?? [0, 0, 0, 0],
      showPoints: state.showPoints,
    },
    datasets: [],
  };
  let anySkipped = false;
  state.active.forEach((data) => {
    if (data.params) {
      config.datasets.push({
        color: data.color,
        title: data.title,
        params: data.params as unknown as Record<string, unknown>,
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
