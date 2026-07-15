import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LayoutBar } from "@/components/LayoutBar";
import { LeftPanel } from "@/components/LeftPanel";
import { ComponentEditor } from "@/components/ComponentEditor";
import { BottomPanel } from "@/components/BottomPanel";
import { ComponentProvider, useComponentStore } from "@/stores/componentStore";
import {SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

function DashboardLayout() {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const { components, selectedId } = useComponentStore();
  const selectedComponent = components.find((c) => c.id === selectedId);
  const hasCode = (selectedComponent?.appJsx?.trim().length ?? 0) > 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader />
      <LayoutBar onToggleLeft={() => setShowLeft((p) => !p)} onToggleRight={() => setShowRight((p) => !p)} />

      {/* Top section — main workspace */}
      <div className="flex-[2] flex overflow-hidden min-h-0">
        {showLeft && <LeftPanel />}

        {/* Main area — inline */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-zinc-50 dark:bg-zinc-950">
          {!selectedComponent && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-zinc-400 dark:text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25M12 17.25V6.75"
                    />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                  Select a component to preview
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Choose a component from the left panel
                </p>
              </div>
            </div>
          )}

          {selectedComponent && !hasCode && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-zinc-400 dark:text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                  No code yet
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Generate code using the editor on the right
                </p>
              </div>
            </div>
          )}

          {selectedComponent && hasCode && (
            <SandpackProvider template="react" className="flex-1 flex flex-col h-full" files={{ "/App.js": selectedComponent.appJsx! }} theme="light">
              <SandpackLayout className="flex-1 !flex !flex-col h-full !border-0 !rounded-none [&>div]:flex-1 [&>div]:h-full [&_iframe]:h-full">
                <SandpackPreview className="flex-1 h-full" style={{ height: "100%" }}/>
              </SandpackLayout>
            </SandpackProvider>
          )}
        </div>

        {showRight && (
          <div className="w-[400px] flex-shrink-0 border-l border-zinc-200 dark:border-zinc-700">
            <ComponentEditor />
          </div>
        )}
      </div>

      {/* Bottom panel — JSON file viewer */}
      <div className="flex-[1] min-h-0 border-t border-zinc-200 dark:border-zinc-700">
        <BottomPanel />
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