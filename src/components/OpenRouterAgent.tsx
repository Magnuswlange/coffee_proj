import { OpenRouter } from "@openrouter/sdk";
import { Bot } from "lucide-react";
import { motion } from "motion/react";
import Button from "./Button";
import { useOpenRouterAgent } from "../hooks/useOpenRouterAgent";
import { agentName } from "../ai/agentModels";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  openRouter: OpenRouter;
};

export default function OpenRouterAgent({ openRouter }: Props) {
  const { query, setQuery, response, loading, error, handleQuery } =
    useOpenRouterAgent({ openRouter });

  return (
    <motion.div
      className="text-primary-foreground bg-primary flex flex-col w-1/2 h-full mx-auto squircle items-center p-4"
      whileHover={{
        backgroundColor: "var(--color-secondary)",
        color: "var(--color-secondary-foreground)",
        border: "2px solid var(--color-highlight)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <h2 className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-3xl">Ask {agentName}</span>
        <Bot size={24} />
      </h2>
      <textarea
        value={query}
        placeholder="idk what i want, recommend me a coffee with oat milk..."
        className="w-full mx-auto h-25 min-h-20 max-h-50 bg-primary squircle px-4 py-2 mb-6"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleQuery();
          }
        }}
      />
      <Button onClick={handleQuery} disabled={loading} className="w-full mb-4">
        {loading ? "Thinking..." : "Send"}
      </Button>
      <div className="w-full text-wrap">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-3">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
          }}
        >
          {response}
        </ReactMarkdown>
      </div>
      {error && <p className="text-500-red">{error}</p>}
    </motion.div>
  );
}
