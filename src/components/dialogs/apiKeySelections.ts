export default class ApiKeySelections {
  cdc = '';
  fluView = '';
  ght = '';
  quidel = '';
  sensors = '';
  twitter = '';
}

export function getStoreApiKeys() {
  try {
    if (localStorage.getItem('store-api')) {
      return JSON.parse(localStorage.getItem('store-api')!) as boolean;
    }
    return true;
  } catch {
    localStorage.removeItem('store-api');
    return true;
  }
}

export function getApiKeySelections() {
  try {
    if (localStorage.getItem('api')) {
      return JSON.parse(localStorage.getItem('api')!) as ApiKeySelections;
    }
    return new ApiKeySelections();
  } catch {
    localStorage.removeItem('api');
    return new ApiKeySelections();
  }
}
