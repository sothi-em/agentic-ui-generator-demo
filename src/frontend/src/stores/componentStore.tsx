import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type UiComponent } from "@/types/component";

interface ComponentStoreContextValue {
  components: UiComponent[];
  selectedId: string | null;
  selectComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<Pick<UiComponent, "name" | "description" | "appJsx" | "indexCss">>) => void;
  addComponent: () => void;
}

const ComponentStoreContext = createContext<ComponentStoreContextValue | null>(null);

const defaultComponents: UiComponent[] = [
  {
    id: "1",
    name: "Sample Card",
    description: "A sample card component for demonstration",
    appJsx: "",
    indexCss: "",
  },
];

export function ComponentProvider({ children }: { children: ReactNode }) {
  const [components, setComponents] = useState(defaultComponents);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectComponent = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Pick<UiComponent, "name" | "description" | "appJsx" | "indexCss">>) => {
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
      indexCss: "",
    };
    setComponents((prev) => [...prev, newComponent]);
    setSelectedId(newComponent.id);
  }, []);

  return (
    <ComponentStoreContext.Provider
      value={{ components, selectedId, selectComponent, updateComponent, addComponent }}
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