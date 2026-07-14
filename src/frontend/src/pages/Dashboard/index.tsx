import { useState, useCallback } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LayoutBar } from "@/components/LayoutBar";
import { LeftPanel } from "@/components/LeftPanel";
import { MainArea } from "@/components/MainArea";
import { ComponentEditor } from "@/components/ComponentEditor";
import { ComponentProvider } from "@/stores/componentStore";

function DashboardLayout() {
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
        {/* Left panel — component list */}
        {showLeft && <LeftPanel />}

        {/* Main area */}
        <MainArea />

        {/* Right panel — component settings */}
        {showRight && (
          <div className="w-[400px] flex-shrink-0 border-l border-zinc-200 dark:border-zinc-700">
            <ComponentEditor />
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <ComponentProvider>
      <DashboardLayout />
    </ComponentProvider>
  );
}