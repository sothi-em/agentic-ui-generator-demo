import { cn } from "@/utils/cn";
import { Package, Plus } from "lucide-react";
import { useComponentStore } from "@/stores/componentStore";

export function LeftPanel() {
  const { components, selectedId, selectComponent, addComponent } = useComponentStore();

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex-shrink-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Components
          </span>
        </div>
        <button
          onClick={addComponent}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Add component"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto py-2">
        {components.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No components yet
            </p>
          </div>
        ) : (
          <ul className="space-y-0.5 px-2">
            {components.map((comp) => (
              <li key={comp.id}>
                <button
                  onClick={() => selectComponent(comp.id)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2.5 transition-colors",
                    selectedId === comp.id
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <p className="text-sm font-medium truncate">{comp.name}</p>
                  {comp.description && (
                    <p className={cn(
                      "text-xs mt-0.5 truncate",
                      selectedId === comp.id
                        ? "text-indigo-500 dark:text-indigo-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    )}>
                      {comp.description}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}