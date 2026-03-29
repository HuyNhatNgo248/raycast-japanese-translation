import { LocalStorage } from "@raycast/api";
import type { TranslationResult } from "./translate";

const KEY = "translation-history";
const MAX = 50;

export async function loadHistory(): Promise<TranslationResult[]> {
  const raw = await LocalStorage.getItem<string>(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TranslationResult[];
  } catch {
    return [];
  }
}

export async function saveToHistory(result: TranslationResult): Promise<void> {
  const history = await loadHistory();
  const deduped = history.filter((h) => h.original !== result.original);
  await LocalStorage.setItem(KEY, JSON.stringify([result, ...deduped].slice(0, MAX)));
}

export async function deleteFromHistory(timestamp: number): Promise<void> {
  const history = await loadHistory();
  await LocalStorage.setItem(KEY, JSON.stringify(history.filter((h) => h.timestamp !== timestamp)));
}

export async function clearHistory(): Promise<void> {
  await LocalStorage.removeItem(KEY);
}
