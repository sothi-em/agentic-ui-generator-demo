import { useState, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Send, Settings, Loader2 } from "lucide-react";
import { useComponentStore } from "@/stores/componentStore";
import apiClient from "@/api/client";

export function ComponentEditor() {
  const { components, selectedId, updateComponent } = useComponentStore();
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

    setMessage("");
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
    } catch (err) {
      console.error("[ComponentEditor] Send failed:", err);
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, selectedId, selectedComponent, updateComponent]);

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

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
            Name
          </label>
          <input
            type="text"
            value={selectedComponent.name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
            Description
          </label>
          <textarea
            value={selectedComponent.description}
            onChange={handleDescriptionChange}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 outline-none resize-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
          />
        </div>
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
            className="flex-1 bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 max-h-24 overflow-y-auto"
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
  );
}