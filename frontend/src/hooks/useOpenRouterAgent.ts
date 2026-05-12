import { useState } from "react";
import type { ChatMessages } from "@openrouter/sdk/models";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000/api/agent"
  : "/api/agent";

export function useOpenRouterAgent() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ChatMessages[]>([]);

  const handleQuery = async () => {
    const newQuery = query.trim();
    if (!newQuery || loading) return;

    const userMessage: ChatMessages = {
      role: "user",
      content: newQuery,
    };

    const messages: ChatMessages[] = [...history, userMessage];
    console.log("sending messages: ", messages);

    setQuery("");
    setLoading(true);
    setResponse("");
    setError("");
    setHistory(messages); // instantly set new message so UI is responsive

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response ?? "");
      setHistory([
        ...messages,
        { role: "assistant", content: data.response ?? "" },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { query, setQuery, response, loading, error, handleQuery, history };
}
