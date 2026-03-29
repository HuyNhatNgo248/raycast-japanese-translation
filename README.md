# Japanese → English Translator

A Raycast extension for translating Japanese text to English, with kanji reading annotation.

## Features

- Translate Japanese text to English via DeepL or MyMemory
- Automatic fallback to MyMemory if DeepL is unavailable or fails
- Kanji reading annotation using Jisho API (e.g. `漢字(かんじ)`)
- Translation history with search, copy, and delete
- Copy without closing the Raycast window

## Setup

```bash
pnpm install
pnpm dev
```

## Preferences

| Preference | Default | Description |
| --- | --- | --- |
| Translation Provider | DeepL | DeepL or MyMemory. DeepL falls back to MyMemory if key is missing or request fails. |
| DeepL API Key | — | Get a free key at [deepl.com/pro-api](https://www.deepl.com/pro-api). Free tier gives 500k characters/month. Free keys end in `:fx`. |

## Configuration

### Setting your DeepL API Key

1. Get a free key at [deepl.com/pro-api](https://www.deepl.com/pro-api) — free tier gives 500k characters/month. Free keys end in `:fx`.
2. Open Raycast and search for **Translate Japanese Text**
3. Press `⌘⇧,` to open extension preferences, or click the `⌘⇧,` hint at the bottom right of the result
4. Paste your key into the **DeepL API Key** field
5. Optionally switch the **Translation Provider** dropdown — it defaults to DeepL and falls back to MyMemory automatically if the key is missing or the request fails

### Setting a Global Hotkey

A hotkey lets you open the translator from anywhere on your Mac without switching to Raycast first.

1. Open Raycast and search for **Translate Japanese Text**
2. Press `⌘K` to open the action panel
3. Select **Configure Command**
4. Click the **Hotkey** field and press your desired key combination (e.g. `⌥T` or `⌃⌘T`)
5. Press `↵` to save

After setting the hotkey, you can highlight Japanese text in any app, copy it (`⌘C`), trigger the hotkey, then paste (`⌘V`) to translate in one quick flow.

## Commands

Only one command: **Translate Japanese Text**.

| Action | Shortcut | Description |
| --- | --- | --- |
| Translate | `↵` | Translate the input text |
| Paste from Clipboard | `⌘V` | Paste clipboard into the text field |
| View History | `⌘H` | Browse past translations |
| Show Kanji Readings | `⌘R` | Annotate kanji with hiragana readings (on result screen) |
| Copy Translation | `⌘C` | Copy translated text |
| Copy Original | `⌘⇧C` | Copy original Japanese text |
| Copy Both | `⌘⌥C` | Copy original and translation together |

## APIs Used

| API | Auth | Usage |
| --- | --- | --- |
| [DeepL](https://www.deepl.com/pro-api) | API key | Primary translation |
| [MyMemory](https://mymemory.translated.net) | None | Free fallback translation |
