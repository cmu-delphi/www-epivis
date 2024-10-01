import {
  cdcLocations,
  covidHospLocations,
  fluSurvRegions,
  fluViewRegions,
  gftLocations,
  ghtLocations,
  nidssDengueLocations,
  nidssFluLocations,
  nowcastLocations,
  quidelLocations,
  sensorLocations,
  sensorNames,
  twitterLocations,
  wikiArticles,
} from '../../data/data';
import { DEFAULT_ISSUE } from './utils';

export class CdcSelections {
  locations = cdcLocations[0].value;
}

export class CovidcastSelections {
  dataSource = '';
  signal = '';
  geoType = '';
  geoValue = '';
}

export class CovidHospSelections {
  states = covidHospLocations[0].value;
  issue = DEFAULT_ISSUE;
}

export class FluSurvSelections {
  locations = fluSurvRegions[0].value;
  issue = DEFAULT_ISSUE;
}

export class FluViewSelections {
  locations = fluViewRegions[0].value;
  issue = DEFAULT_ISSUE;
}

export class GftSelections {
  locations = gftLocations[0].value;
}

export class GhtSelections {
  locations = ghtLocations[0].value;
  query = '';
}

export class NidssDengueSelections {
  locations = nidssDengueLocations[0].value;
}

export class NidssFluSelections {
  locations = nidssFluLocations[0].value;
  issue = DEFAULT_ISSUE;
}

export class NowcastSelections {
  locations = nowcastLocations[0].value;
}

export class QuidelSelections {
  locations = quidelLocations[0].value;
}

export class SensorSelections {
  locations = sensorLocations[0].value;
  names = sensorNames[0].value;
}

export class TwitterSelections {
  locations = twitterLocations[0].value;
  resolution: 'daily' | 'weekly' = 'daily';
}

export class WikiSelections {
  articles = wikiArticles[0].value;
  resolution: 'daily' | 'weekly' = 'daily';
  hour = 0;
  useHour = false;
  language = 'en';
}

export default class FormSelections {
  dataSource:
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
  cdc = new CdcSelections();
  covidcast = new CovidcastSelections();
  covidHosp = new CovidHospSelections();
  fluSurv = new FluSurvSelections();
  fluView = new FluViewSelections();
  gft = new GftSelections();
  ght = new GhtSelections();
  nidssDengue = new NidssDengueSelections();
  nidssFlu = new NidssFluSelections();
  nowcast = new NowcastSelections();
  quidel = new QuidelSelections();
  sensors = new SensorSelections();
  twitter = new TwitterSelections();
  wiki = new WikiSelections();
}

export function getFormSelections() {
  try {
    if (sessionStorage.getItem('form')) {
      return JSON.parse(sessionStorage.getItem('form')!) as FormSelections;
    }
    return new FormSelections();
  } catch {
    sessionStorage.removeItem('form');
    return new FormSelections();
  }
}
