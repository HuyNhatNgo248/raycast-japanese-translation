import * as md from "ts-markdown-builder";
import { Action, ActionPanel, Clipboard, Detail, Icon, showToast, Toast, useNavigation } from "@raycast/api";

import type { ReadingToken } from "@/lib/reading";

interface KanjiReadingsProps {
  annotated: string;
  tokens: ReadingToken[];
  originalText: string;
}

export default function KanjiReadings({ annotated, tokens, originalText }: KanjiReadingsProps) {
  const { pop } = useNavigation();

  const markdown = md.joinBlocks([
    md.heading("Kanji Readings"),
    md.horizontalRule,
    md.blockquote(annotated),
    md.heading("Breakdown", { level: 2 }),
    ...tokens.filter((t) => t.isKanji).map((t) => md.joinBlocks([md.bold(t.surface), ` → ${t.reading}`])),
    md.heading("Original", { level: 2 }),
    md.blockquote(originalText),
  ]);

  async function handleCopy() {
    await Clipboard.copy(annotated);
    await showToast({ style: Toast.Style.Success, title: "Copied!" });
  }

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action title="Copy Annotated Text" icon={Icon.CopyClipboard} onAction={handleCopy} />
          <Action title="Back" icon={Icon.ArrowLeft} onAction={pop} />
        </ActionPanel>
      }
    />
  );
}
