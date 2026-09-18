/**
 * dedupeInFlightRequest
 *
 * A handful of GET endpoints (batches list, students list, teachers list,
 * subjects list, account info) are called from several different
 * components/pages independently. When more than one of those components
 * mounts around the same time — e.g. switching between the Overview,
 * Students and Teachers tabs inside a batch, or the double-mount React
 * does in development — each one fires its own request for the exact
 * same data, at the exact same moment.
 *
 * This helper doesn't change what any caller does with the response (the
 * returned Promise resolves/rejects exactly as before); it only makes
 * sure that if a request for the same `key` is already in flight, later
 * callers await that same network call instead of starting a new one.
 *
 * This is intentionally NOT a time-based cache: a fresh call some time
 * after the in-flight one has settled always hits the network again, so
 * data you'd expect to be fresh after an add/edit/delete (or just
 * revisiting a tab later) is never served stale. `graceMs` only keeps
 * the just-settled entry around briefly so truly-simultaneous mounts
 * (the common case this targets) share one response.
 *
 * This generalizes the same in-flight-sharing pattern already used for
 * GetAccountByToken() in axios/institute/instituteSlice.ts.
 */

type InFlightEntry<T> = {
  promise: Promise<T>;
};

const inFlight = new Map<string, InFlightEntry<any>>();

export function dedupeInFlightRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  graceMs: number = 1000,
): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) {
    return existing.promise;
  }

  const promise = fetcher().finally(() => {
    // Keep it briefly after settling so calls that started within the
    // same short window still share this result, then clear it so any
    // later, genuinely-separate call always goes to the network.
    setTimeout(() => {
      if (inFlight.get(key)?.promise === promise) {
        inFlight.delete(key);
      }
    }, graceMs);
  });

  inFlight.set(key, { promise });

  return promise;
}
