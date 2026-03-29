type Provider = "mymemory" | "deepl";

interface Preferences {
  apiProvider: Provider;
  deeplApiKey: string;
}
