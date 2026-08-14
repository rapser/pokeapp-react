import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CachedEnvelope<T> {
  payload: T;
  cachedAt: number;
}

const KEY_PREFIX = 'pokemon_cache_';

export async function getCached<T>(key: string): Promise<T | undefined> {
  const raw = await AsyncStorage.getItem(KEY_PREFIX + key);
  if (!raw) {
    return undefined;
  }
  try {
    const envelope: CachedEnvelope<T> = JSON.parse(raw);
    return envelope.payload;
  } catch {
    return undefined;
  }
}

export async function setCached<T>(key: string, payload: T): Promise<void> {
  const envelope: CachedEnvelope<T> = { payload, cachedAt: Date.now() };
  await AsyncStorage.setItem(KEY_PREFIX + key, JSON.stringify(envelope));
}
