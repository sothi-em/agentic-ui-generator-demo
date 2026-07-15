import { cn } from "@/utils/cn";
import {
  Save,
  Copy,
  Trash2,
  PanelLeft,
  PanelRight,
} from "lucide-react";

interface LayoutBarProps {
  className?: string;
  onToggleLeft?: () => void;
  onToggleRight?: () => void;
}

export function LayoutBar({
  className,
  onToggleLeft,
  onToggleRight,
}: LayoutBarProps) {
  return (
    <div
      className={cn(
        "h-[40px] flex items-center px-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <ToolbarButton icon={Save} label="Save" tooltip="Save changes" />
        <ToolbarButton icon={Copy} label="Copy" tooltip="Copy to clipboard" />
        <ToolbarButton icon={Trash2} label="Delete" tooltip="Delete selected" />
        <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <ToolbarButton
          icon={PanelLeft}
          label="Left Panel"
          tooltip="Toggle left panel"
          onClick={onToggleLeft}
        />
        <ToolbarButton
          icon={PanelRight}
          label="Settings"
          tooltip="Toggle settings panel"
          onClick={onToggleRight}
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  tooltip,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}