export function getStoreApiKeys() {
  try {
    if (localStorage.getItem('store-api')) {
      return JSON.parse(localStorage.getItem('store-api')!) as boolean;
    }
    return false;
  } catch {
    localStorage.removeItem('store-api');
    return false;
  }
}

export function getApiKey() {
  try {
    if (localStorage.getItem('api')) {
      return JSON.parse(localStorage.getItem('api')!) as string;
    }
    return '';
  } catch {
    localStorage.removeItem('api');
    return '';
  }
}
