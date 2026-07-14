import { useEffect, useState } from "react";
import apiClient from "@/api/client";

interface HealthResponse {
  status: string;
}

export function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<HealthResponse>(`/health`)
      .then((res) => setHealth(res.data))
      .catch(() => setHealth({ status: "unavailable" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Agentic UI Generator
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Demo — dynamically generated dashboard UI components
      </p>
      <div className="mt-6 px-4 py-2 rounded-lg border border-border">
        {loading ? (
          <span className="text-muted-foreground">Loading...</span>
        ) : health ? (
          <span className="text-green-600">
            Backend: {health.status}
          </span>
        ) : (
          <span className="text-red-500">Backend: unavailable</span>
        )}
      </div>
    </div>
  );
}