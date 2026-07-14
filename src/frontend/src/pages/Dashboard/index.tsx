import { useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import { AppHeader } from "@/components/AppHeader";
import { LayoutBar } from "@/components/LayoutBar";
import { LeftPanel } from "@/components/LeftPanel";
import { MainArea } from "@/components/MainArea";
import { ChatPanel } from "@/components/ChatPanel";

export function DashboardPage() {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const toggleLeft = useCallback(() => setShowLeft((p) => !p), []);
  const toggleRight = useCallback(() => setShowRight((p) => !p), []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* App Header */}
      <AppHeader />

      {/* Layout Bar */}
      <LayoutBar onToggleLeft={toggleLeft} onToggleRight={toggleRight} />

      {/* Three-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        {showLeft && <LeftPanel />}

        {/* Main area */}
        <MainArea />

        {/* Right panel — agent chat */}
        {showRight && (
          <div className="w-[512px] flex-shrink-0 border-l border-zinc-200 dark:border-zinc-700">
            <ChatPanel />
          </div>
        )}
      </div>
    </div>
  );
}