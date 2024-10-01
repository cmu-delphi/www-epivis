export default class ApiKeySelections {
  cdc = '';
  fluView = '';
  ght = '';
  quidel = '';
  sensors = '';
  twitter = '';
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
