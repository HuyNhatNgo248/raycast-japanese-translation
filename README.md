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
