import { cn } from "@/utils/cn";

interface MainAreaProps {
  className?: string;
}

export function MainArea({ className }: MainAreaProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-hidden min-w-0 bg-zinc-50 dark:bg-zinc-950",
        className
      )}
    >
      {/* Blank main content area */}
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
            Main Canvas
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Components will appear here
          </p>
        </div>
      </div>
    </div>
  );
}