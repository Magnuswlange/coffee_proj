import { useState } from "react";
import type { OpenRouter } from "@openrouter/sdk";
import type { ChatMessages } from "@openrouter/sdk/models";
import { systemPrompt } from "../ai/agentPrompt";
import { model } from "../ai/agentModels";
import { tools } from "../ai/agentTools";
import { runTool } from "../ai/toolHandlers";

type Props = {
  openRouter: OpenRouter;
};

export function useOpenRouterAgent({ openRouter }: Props) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ChatMessages[]>([
    {
      role: "system",
      content: systemPrompt,
    },
  ]);

  const handleQuery = async () => {
    const newQuery = query.trim();
    if (!newQuery || loading) return;

    setQuery("");
    setLoading(true);
    setResponse("");
    setError("");

    const userMessage: ChatMessages = {
      role: "user",
      content: newQuery,
    };

    const messages: ChatMessages[] = [...history, userMessage];

    try {
      const firstResponse = await openRouter.chat.send({
        chatRequest: {
          model: model,
          messages: messages,
          tools: tools,
          toolChoice: "auto",
        },
      });

      const assistantMessage = firstResponse.choices?.[0]?.message;
      if (!assistantMessage) throw new Error("No assistant response received");

      const toolCalls = assistantMessage.toolCalls ?? [];

      if (toolCalls.length === 0) {
        const finalResponse = assistantMessage.content ?? "";
        setResponse(finalResponse);
        setHistory([
          ...messages,
          { role: "assistant", content: finalResponse },
        ]);
        return;
      }

      const toolMessages: ChatMessages[] = [];

      for (const toolCall of toolCalls) {
        const res = await runTool(toolCall.function.name);
        toolMessages.push({
          role: "tool",
          toolCallId: toolCall.id,
          content: JSON.stringify(res),
        });
      }

      const secondResponse = await openRouter.chat.send({
        chatRequest: {
          model: model,
          messages: [...messages, assistantMessage, ...toolMessages],
          tools: tools,
          toolChoice: "auto",
        },
      });

      const finalMessage = secondResponse.choices?.[0]?.message;
      const finalResponse = finalMessage?.content ?? "";

      setResponse(finalResponse);

      if (finalMessage) {
        setHistory([
          ...messages,
          assistantMessage,
          ...toolMessages,
          finalMessage,
        ]);
      } else {
        setHistory([...messages, assistantMessage, ...toolMessages]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { query, setQuery, response, loading, error, handleQuery };
}
