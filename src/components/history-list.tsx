import { Action, ActionPanel, Alert, confirmAlert, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { clearHistory, deleteFromHistory, loadHistory } from "@/lib/history";
import { format } from "timeago.js";

import type { TranslationResult } from "@/lib/translate";

export default function HistoryList({ onSelect }: { onSelect: (item: TranslationResult) => void }) {
  const [history, setHistory] = useState<TranslationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory().then((data) => {
      setHistory(data);
      setIsLoading(false);
    });
  }, []);

  async function handleDelete(timestamp: number) {
    await deleteFromHistory(timestamp);
    setHistory((prev) => prev.filter((h) => h.timestamp !== timestamp));
  }

  async function handleClearAll() {
    const ok = await confirmAlert({
      title: "Clear all history?",
      primaryAction: { title: "Clear All", style: Alert.ActionStyle.Destructive },
    });
    if (ok) {
      await clearHistory();
      setHistory([]);
    }
  }

  const filtered = history.filter(
    (h) => h.original.includes(search) || h.translated.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <List
      isLoading={isLoading}
      searchText={search}
      onSearchTextChange={setSearch}
      searchBarPlaceholder="Search history…"
      navigationTitle="Translation History"
    >
      {filtered.length === 0 && !isLoading ? (
        <List.EmptyView icon={Icon.Clock} title={search ? "No matches" : "No history yet"} />
      ) : (
        filtered.map((item) => (
          <List.Item
            key={item.timestamp}
            title={item.original}
            subtitle={item.translated}
            accessories={[{ text: format(item.timestamp) }]}
            actions={
              <ActionPanel>
                <Action title="Use This Translation" onAction={() => onSelect(item)} />
                <Action.CopyToClipboard title="Copy Translation" content={item.translated} />
                <Action.CopyToClipboard
                  title="Copy Original"
                  content={item.original}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                />
                <ActionPanel.Section>
                  <Action
                    title="Delete"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["ctrl"], key: "x" }}
                    onAction={() => handleDelete(item.timestamp)}
                  />
                  <Action
                    title="Clear All"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["ctrl", "shift"], key: "x" }}
                    onAction={handleClearAll}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
