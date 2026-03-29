export interface TranslationResult {
  original: string;
  translated: string;
  provider: Provider;
  timestamp: number;
}

async function translateWithMyMemory(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory failed: ${res.status}`);
  const json = (await res.json()) as {
    responseStatus: number;
    responseData: { translatedText: string };
    responseDetails?: string;
  };
  if (json.responseStatus !== 200) throw new Error(json.responseDetails ?? "Translation failed");
  return json.responseData.translatedText;
}

async function translateWithDeepL(text: string, apiKey: string): Promise<string> {
  if (!apiKey) throw new Error("DeepL API key missing — add it in preferences.");

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `DeepL-Auth-Key ${apiKey}` },
    body: JSON.stringify({ text: [text], source_lang: "JA", target_lang: "EN" }),
  });

  if (!res.ok) throw new Error(`DeepL failed: ${res.status}`);
  const json = (await res.json()) as { translations: { text: string }[] };

  const result = json.translations?.[0]?.text;
  if (!result) throw new Error("DeepL returned empty result");
  return result;
}

export async function translate(text: string, provider: Provider, deeplApiKey: string): Promise<TranslationResult> {
  const trimmed = text.trim();

  if (!trimmed) throw new Error("Input is empty");
  const translated =
    provider === "deepl" ? await translateWithDeepL(trimmed, deeplApiKey) : await translateWithMyMemory(trimmed);
  return { original: trimmed, translated, provider, timestamp: Date.now() };
}
