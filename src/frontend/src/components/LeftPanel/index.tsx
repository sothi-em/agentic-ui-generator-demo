import { cn } from "@/utils/cn";
import { PanelLeft } from "lucide-react";

interface LeftPanelProps {
  className?: string;
}

export function LeftPanel({ className }: LeftPanelProps) {
  return (
    <div
      className={cn(
        "w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex-shrink-0 overflow-y-auto flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <PanelLeft className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Panels
        </span>
      </div>

      {/* Content area — blank for now */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <PanelLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Component browser
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            (Coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}