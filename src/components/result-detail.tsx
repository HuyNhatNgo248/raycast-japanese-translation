import { Action, ActionPanel, Detail, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import * as md from "ts-markdown-builder";
import { getReading } from "@/lib/reading";
import KanjiReadings from "./kanji-readings";

import type { TranslationResult } from "@/lib/translate";

export default function ResultDetail({ result, onBack }: { result: TranslationResult; onBack: () => void }) {
  const { push } = useNavigation();

  const markdown = md.joinBlocks([
    md.heading("Translation"),
    md.horizontalRule,
    md.heading("Japanese", { level: 4 }),
    md.blockquote(result.original),
    md.heading("English", { level: 4 }),
    md.blockquote(result.translated),
  ]);

  async function handleShowKanjiReading() {
    await showToast({ style: Toast.Style.Animated, title: "Analyzing readings…" });
    try {
      const tokens = await getReading(result.original);
      const annotated = tokens.map((t) => (t.isKanji ? `${t.surface}(${t.reading})` : t.surface)).join("");

      push(<KanjiReadings annotated={annotated} tokens={tokens} originalText={result.original} />);
      await showToast({ style: Toast.Style.Success, title: "Done" });
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Reading failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Translation" content={result.translated} />

          <Action.CopyToClipboard
            title="Copy Original"
            content={result.original}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />

          <ActionPanel.Section>
            <Action
              title="Show Kanji Readings"
              icon={Icon.Text}
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              onAction={handleShowKanjiReading}
            />
            <Action title="Translate Again" icon={Icon.ArrowLeft} onAction={onBack} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
