/// <reference types="vite/client" />

interface Window {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FileSystemHandle>;
}

interface FileSystemHandle {
  createWritable(): Promise<FileSystemWritable>;
}

interface FileSystemWritable {
  write(content: string): Promise<void>;
  close(): Promise<void>;
}