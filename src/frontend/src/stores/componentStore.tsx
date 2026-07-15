import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type UiComponent } from "@/types/component";

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
  dataFiles: LoadedFile[];
  selectedDataFileId: string | null;
  addDataFile: (file: LoadedFile) => void;
  removeDataFile: (id: string) => void;
  selectDataFile: (id: string) => void;
}

const ComponentStoreContext = createContext<ComponentStoreContextValue | null>(null);

const defaultComponents: UiComponent[] = [
  {
    id: "1",
    name: "Sample Card",
    description: "A sample card component for demonstration",
    appJsx: "",
  },
];

export function ComponentProvider({ children }: { children: ReactNode }) {
  const [components, setComponents] = useState(defaultComponents);
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
    };
    setComponents((prev) => [...prev, newComponent]);
    setSelectedId(newComponent.id);
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
    setSelectedDataFileId(id);
  }, []);

  return (
    <ComponentStoreContext.Provider
      value={{ components, selectedId, selectComponent, updateComponent, addComponent, dataFiles, selectedDataFileId, addDataFile, removeDataFile, selectDataFile }}
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