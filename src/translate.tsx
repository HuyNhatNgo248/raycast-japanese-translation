import {
  Action,
  ActionPanel,
  Clipboard,
  Form,
  getPreferenceValues,
  Icon,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";
import { saveToHistory } from "./lib/history";
import { translate } from "./lib/translate";
import ResultDetail from "./components/result-detail";
import HistoryList from "./components/history-list";

export default function TranslateCommand() {
  const prefs = getPreferenceValues<Preferences>();
  const { push } = useNavigation();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePaste() {
    const { text: clip } = await Clipboard.read();
    if (clip) setText(clip);
    else await showToast({ style: Toast.Style.Failure, title: "Clipboard is empty" });
  }

  async function handleTranslate() {
    if (!text.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Nothing to translate" });
      return;
    }
    setIsLoading(true);
    await showToast({ style: Toast.Style.Animated, title: "Translating…" });
    try {
      const result = await translate(text, prefs.apiProvider, prefs.deeplApiKey);
      await saveToHistory(result);
      await showToast({ style: Toast.Style.Success, title: "Done" });
      push(<ResultDetail result={result} onBack={() => push(<TranslateCommand />)} />);
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Translation failed",
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Translate" onSubmit={handleTranslate} />
          <Action
            title="Paste from Clipboard"
            icon={Icon.Clipboard}
            shortcut={{ modifiers: ["cmd"], key: "v" }}
            onAction={handlePaste}
          />
          <ActionPanel.Section title="History">
            <Action
              title="View History"
              icon={Icon.Clock}
              shortcut={{ modifiers: ["cmd"], key: "h" }}
              onAction={() =>
                push(
                  <HistoryList
                    onSelect={(item) => push(<ResultDetail result={item} onBack={() => push(<TranslateCommand />)} />)}
                  />,
                )
              }
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="text"
        title="Japanese"
        placeholder="日本語を入力してください…"
        value={text}
        onChange={setText}
        autoFocus
      />
    </Form>
  );
}
