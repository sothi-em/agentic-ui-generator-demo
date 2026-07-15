export interface ComponentHistoryEntry {
  id: string;
  userMessage: string;
  payload: Record<string, unknown>;
  timestamp: Date;
}

export interface UiComponent {
  id: string;
  name: string;
  description: string;
  appJsx: string;
  history: ComponentHistoryEntry[];
}