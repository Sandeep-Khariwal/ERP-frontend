export enum LocalStorageKey {
  Token = "shikshaPayToken",
}

export function GetValueFromLocalStorage<T>(
  key: LocalStorageKey
): T | string | null {
  if (typeof window !== "undefined") {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue) as T;
      } catch (error) {
        return storedValue;
      }
    }
  }
  return null;
}

export function GetUserToken() {
  const localStorageValue = GetValueFromLocalStorage<string>(
    LocalStorageKey.Token
  );
  return localStorageValue;
}
