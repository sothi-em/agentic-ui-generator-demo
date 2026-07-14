import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Send, Bot, User, StopCircle, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your UI generation assistant. Describe what you'd like to build and I'll help create it.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    // Simulate agent response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `[Stub] Processing: "${trimmed}"`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsSending(false);
    }, 500);
  }, [input, isSending]);

  const handleStop = useCallback(() => {
    setIsSending(false);
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Agent Chat
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isSending && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Stop agent"
            >
              <StopCircle className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.1s]" />
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-3">
        <div className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            rows={6}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 max-h-24 overflow-y-auto"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className={cn(
              "p-2 rounded-md transition-colors flex-shrink-0",
              input.trim() && !isSending
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 px-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "")}>
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-indigo-100 dark:bg-indigo-900"
            : "bg-zinc-100 dark:bg-zinc-800"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        ) : (
          <Bot className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[90%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-indigo-50 dark:bg-indigo-950 text-zinc-800 dark:text-zinc-200 border border-indigo-100 dark:border-indigo-900"
            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}