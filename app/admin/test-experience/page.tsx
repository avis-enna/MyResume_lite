"use client";

import { useState, useEffect } from "react";

interface ExperienceItem {
  _id?: string;
  [key: string]: unknown;
}

export default function TestExperience() {
  const [data, setData] = useState<ExperienceItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log("TEST: Starting fetch...");
      const response = await fetch("/api/admin/experience");
      console.log("TEST: Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("TEST: Data received:", result);
        setData(Array.isArray(result) ? result : []);
      } else {
        setError(`Failed to load: ${response.status}`);
      }
    } catch (err: unknown) {
      console.error("TEST: Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-8">Experience Data Test</h1>

      <div className="mb-4">
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reload Data
        </button>
      </div>

      <div className="mb-4">
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error}</p>
        <p>Data length: {Array.isArray(data) ? data.length : "null"}</p>
      </div>

      {Array.isArray(data) && (
        <div>
          <h2 className="text-xl mb-4">Raw Data:</h2>
          <pre className="bg-gray-800 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
