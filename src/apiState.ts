import { writable } from 'svelte/store';
import type { DataGroup } from './data/DataSet';

// State shared between the API layer (api/EpiData.ts) and the UI.
//
// These three stores live here rather than in store.ts to keep the module graph
// acyclic. store.ts imports deriveLinkDefaults, which imports EpiData for its
// `lookups` table; when EpiData imported these stores back out of store.ts that
// closed a cycle (store -> deriveLinkDefaults -> EpiData -> store). It worked, but
// only by declaration order: store.ts invokes the shared-link loader at the bottom
// of its own module body, and that call reaches EpiData importers which read these
// stores synchronously. Anything that moved a declaration below that call - or the
// call above a declaration - would have failed with a "cannot access before
// initialization" error pointing at a file that had done nothing wrong.
//
// As a leaf module this is guaranteed to finish evaluating before either store.ts
// or EpiData.ts begins, so the ordering hazard is gone rather than merely avoided.

// Seeded by store.ts with the shared-link defaults as soon as it has parsed them,
// which happens before anything can read it: the dataset tree mounts later, and
// loadDataSet only reads it from inside an import.
export const expandedDataGroups = writable<DataGroup[]>([]);

export const apiKey = writable(localStorage.getItem('api-key')! || '');
apiKey.subscribe((val) => {
  // always keep key in session storage (resets on window close)
  sessionStorage.setItem('api-key', val);
  if (localStorage.getItem('store-api-key') === 'true') {
    // if flag set, also store key in local persistent storage
    localStorage.setItem('api-key', val);
  }
});

export const storeApiKeys = writable(localStorage.getItem('store-api-key') === 'true');
storeApiKeys.subscribe((val) => {
  localStorage.setItem('store-api-key', val.toString());
  if (val) {
    // persist key from session to local storage
    localStorage.setItem('api-key', sessionStorage.getItem('api-key') || '');
  } else {
    // remove key from local storage
    localStorage.removeItem('api-key');
  }
});
