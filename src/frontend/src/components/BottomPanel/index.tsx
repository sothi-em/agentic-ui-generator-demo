import { useState, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import { FolderOpen, FileJson, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useComponentStore, type LoadedFile } from "@/stores/componentStore";

function itemCount(data: unknown): string {
  if (Array.isArray(data)) return `${data.length} items`;
  if (data !== null && typeof data === "object") return `${Object.keys(data).length} keys`;
  return "primitive";
}

function formatPreview(data: unknown): string {
  const json = JSON.stringify(data, null, 2);
  if (json.length <= 2000) return json;
  return json.slice(0, 2000) + "\n... (truncated)";
}

function FileCard({
  file,
  isSelected,
  onRemove,
  onSelect,
}: {
  file: LoadedFile;
  isSelected: boolean;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => onSelect(file.id)}
      className={cn(
        "rounded-lg border overflow-hidden cursor-pointer transition-colors",
        isSelected
          ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
          : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((e) => !e); }}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        <FileJson className={cn(
          "w-3.5 h-3.5",
          isSelected ? "text-indigo-500 dark:text-indigo-400" : "text-zinc-400"
        )} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
            {file.name}
          </p>
        </div>

        <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
          {itemCount(file.data)}
        </span>

        <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
          {file.loadedAt.toLocaleTimeString()}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
          className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Remove file"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && (
        <pre className="px-3 pb-3 pl-10 text-xs text-zinc-600 dark:text-zinc-400 overflow-auto max-h-[200px] bg-zinc-100 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-700">
          {formatPreview(file.data)}
        </pre>
      )}
    </div>
  );
}

export function BottomPanel() {
  const { dataFiles, selectedDataFileId, addDataFile, removeDataFile, selectDataFile } = useComponentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileOpen = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        const loaded: LoadedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          data,
          loadedAt: new Date(),
        };
        addDataFile(loaded);
      } catch (err) {
        alert(`Failed to parse ${file.name}: ${err instanceof Error ? err.message : "Invalid JSON"}`);
      }
    };
    reader.readAsText(file);
    // Reset so re-selecting the same file triggers onChange
    e.target.value = "";
  }, [addDataFile]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            JSON Files
          </span>
          {dataFiles.length > 0 && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              ({dataFiles.length} loaded)
            </span>
          )}
        </div>

        <button
          onClick={handleFileOpen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Open File</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-3">
        {dataFiles.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                <FolderOpen
                  className="w-5 h-5 text-zinc-400 dark:text-zinc-500"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                No files loaded
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Click "Open File" to load a JSON file
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {dataFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={file.id === selectedDataFileId}
                onRemove={removeDataFile}
                onSelect={selectDataFile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}