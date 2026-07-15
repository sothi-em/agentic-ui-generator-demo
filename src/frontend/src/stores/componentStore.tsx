import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type UiComponent, type ComponentHistoryEntry } from "@/types/component";

export interface LoadedFile {
  id: string;
  name: string;
  data: unknown;
  loadedAt: Date;
}

interface ComponentStoreContextValue {
  components: UiComponent[];
  selectedId: string | null;
  selectComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<Pick<UiComponent, "name" | "description" | "appJsx">>) => void;
  addComponent: () => void;
  deleteComponent: (id: string) => void;
  replaceComponents: (components: UiComponent[]) => void;
  addHistoryEntry: (componentId: string, entry: Omit<ComponentHistoryEntry, "id" | "timestamp">) => void;
  dataFiles: LoadedFile[];
  selectedDataFileId: string | null;
  addDataFile: (file: LoadedFile) => void;
  removeDataFile: (id: string) => void;
  selectDataFile: (id: string) => void;
}

const ComponentStoreContext = createContext<ComponentStoreContextValue | null>(null);

export function ComponentProvider({ children }: { children: ReactNode }) {
  const [components, setComponents] = useState<UiComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dataFiles, setDataFiles] = useState<LoadedFile[]>([]);
  const [selectedDataFileId, setSelectedDataFileId] = useState<string | null>(null);

  const selectComponent = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Pick<UiComponent, "name" | "description" | "appJsx">>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const addComponent = useCallback(() => {
    const newComponent: UiComponent = {
      id: crypto.randomUUID(),
      name: "Untitled",
      description: "",
      appJsx: "",
      history: [],
    };
    setComponents((prev) => [...prev, newComponent]);
    setSelectedId(newComponent.id);
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => {
      const newComponents = prev.filter((c) => c.id !== id);
      if (selectedId === id) {
        setSelectedId(newComponents.length > 0 ? newComponents[0].id : null);
      }
      return newComponents;
    });
  }, [selectedId]);

  const replaceComponents = useCallback((newComponents: UiComponent[]) => {
    const normalized = newComponents.map((c) => ({
      ...c,
      history: c.history.map((entry) => ({
        ...entry,
        timestamp:
          entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp as unknown as string),
      })),
    }));
    setComponents(normalized);
    setSelectedId(normalized.length > 0 ? normalized[0].id : null);
  }, []);

  const addHistoryEntry = useCallback((componentId: string, entry: Omit<ComponentHistoryEntry, "id" | "timestamp">) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === componentId
          ? { ...c, history: [...c.history, { ...entry, id: crypto.randomUUID(), timestamp: new Date() }] }
          : c
      )
    );
  }, []);

  const addDataFile = useCallback((file: LoadedFile) => {
    setDataFiles((prev) => [...prev, file]);
  }, []);

  const removeDataFile = useCallback((id: string) => {
    setDataFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file && selectedDataFileId === id) {
        // Auto-select next file or clear selection
        const next = prev.find((f) => f.id !== id);
        setSelectedDataFileId(next ? next.id : null);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, [selectedDataFileId]);

  const selectDataFile = useCallback((id: string) => {
    setSelectedDataFileId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <ComponentStoreContext.Provider
      value={{ components, selectedId, selectComponent, updateComponent, addComponent, deleteComponent, replaceComponents, addHistoryEntry, dataFiles, selectedDataFileId, addDataFile, removeDataFile, selectDataFile }}
    >
      {children}
    </ComponentStoreContext.Provider>
  );
}

export function useComponentStore(): ComponentStoreContextValue {
  const ctx = useContext(ComponentStoreContext);
  if (!ctx) throw new Error("useComponentStore must be used within ComponentProvider");
  return ctx;
}