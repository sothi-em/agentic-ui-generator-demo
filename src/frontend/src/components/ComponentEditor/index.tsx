import { useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Send, Settings, Loader2, Clock, ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { useComponentStore } from "@/stores/componentStore";
import { type ComponentHistoryEntry } from "@/types/component";
import apiClient from "@/api/client";

function CollapsibleSection({
  label,
  icon,
  defaultOpen = false,
  count,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
        {count !== undefined && (
          <span className="text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">{count}</span>
        )}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export function ComponentEditor() {
  const { components, selectedId, updateComponent, addHistoryEntry } = useComponentStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const selectedComponent = components.find((c) => c.id === selectedId);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedId) {
        updateComponent(selectedId, { name: e.target.value });
      }
    },
    [selectedId, updateComponent]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (selectedId) {
        updateComponent(selectedId, { description: e.target.value });
      }
    },
    [selectedId, updateComponent]
  );

  const handleSend = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);

    try {
      const payload: Record<string, unknown> = { message: trimmed };
      if (selectedComponent) {
        payload.component = {
          name: selectedComponent.name,
          description: selectedComponent.description,
          appJsx: selectedComponent.appJsx,
        };
      }

      const response = await apiClient.post("/generate", payload);

      // If we got a response with generated files, update the selected component
      if (selectedId && response.data?.jsx) {
        updateComponent(selectedId, {
          appJsx: response.data.jsx,
        });
      }

      // Record the history entry
      if (selectedId) {
        addHistoryEntry(selectedId, {
          userMessage: trimmed,
          payload: response.data ?? {},
        });
      }
    } catch (err) {
      console.error("[ComponentEditor] Send failed:", err);
      if (selectedId) {
        addHistoryEntry(selectedId, {
          userMessage: trimmed,
          payload: { error: "Request failed" },
        });
      }
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, selectedId, selectedComponent, updateComponent, addHistoryEntry]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!selectedComponent) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 items-center justify-center p-4">
        <Settings className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center">
          Select a component to edit
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Component Settings
        </span>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Name */}
          <CollapsibleSection label="Name" defaultOpen={true}>
            <input
              type="text"
              value={selectedComponent.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            />
          </CollapsibleSection>

          {/* Description */}
          <CollapsibleSection label="Description" defaultOpen={false}>
            <textarea
              value={selectedComponent.description}
              onChange={handleDescriptionChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 outline-none resize-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            />
          </CollapsibleSection>

          {/* History Section — always shown, defaults collapsed */}
          <HistorySection history={selectedComponent.history} />
        </div>

        {/* Message Input */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 p-3">
          <div className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what to build..."
              rows={4}
              className={cn(
                "flex-1 bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 max-h-24 overflow-y-auto",
                isSending && "cursor-wait opacity-60"
              )}
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className={cn(
                "p-2 rounded-md transition-colors flex-shrink-0",
                message.trim() && !isSending
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"
              )}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 px-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function HistorySection({ history }: { history: ComponentHistoryEntry[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <CollapsibleSection
      label="Interaction History"
      defaultOpen={false}
      count={history.length}
      icon={<MessageSquare className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />}
    >
      {history.length === 0 ? (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">No interactions yet</p>
      ) : (
        <div className="space-y-2">
          {[...history].reverse().map((entry) => {
            const isExpanded = expandedIds.has(entry.id);
            return (
              <div
                key={entry.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800/50"
              >
                {/* Entry Header */}
                <button
                  onClick={() => toggleExpand(entry.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                  )}

                  <Clock className="w-3 h-3 text-zinc-400 flex-shrink-0" />

                  <span className="flex-1 min-w-0 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {entry.userMessage}
                  </span>

                  <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </button>

                {/* Entry Detail */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 pb-1">
                      <span className="font-medium">Message:</span> {entry.userMessage}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 pb-1">
                        Response:
                      </p>
                      <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-auto max-h-[200px] bg-white dark:bg-zinc-900 rounded-md p-2 border border-zinc-200 dark:border-zinc-700">
                        {JSON.stringify(entry.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}