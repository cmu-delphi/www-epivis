// src/api/v5Availability.ts
declare const process: { env: Record<string, string> };
const CAST_API_V5_ENDPOINT = process.env.EPIDATA_CAST_API_V5_ENDPOINT_URL;

export type V5MetadataResponse = Record<string, { signals: string[] }>;

let metadataPromise: Promise<V5MetadataResponse> | null = null;

// Fetches v5's /metadata/ once per session and caches the result (including
// failures, as an empty object) so every subsequent call reuses the same
// promise instead of re-fetching.
export function getV5Metadata(): Promise<V5MetadataResponse> {
  if (!metadataPromise) {
    metadataPromise = fetch(`${CAST_API_V5_ENDPOINT}/metadata/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`[${response.status}] failed to fetch v5 metadata`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.json();
      })
      .catch((error) => {
        console.warn('failed fetching v5 metadata; all sources will fall back to v4', error);
        return {} as V5MetadataResponse;
      });
  }
  return metadataPromise;
}

// Existence check only: does v5 know about this exact (source, signal) pair?
// No geo_type/geo_value/date-range logic here by design (see spec).
// Array.isArray guards a malformed/unexpected entry (e.g. a source key present
// with no `signals` array) so this never throws - the spec's degrade-to-v4
// guarantee must hold even if the response shape isn't what's expected.
export function isAvailableInV5(source: string, signal: string): Promise<boolean> {
  return getV5Metadata().then((metadata) => {
    const entry = metadata[source];
    return entry != null && Array.isArray(entry.signals) && entry.signals.includes(signal);
  });
}
