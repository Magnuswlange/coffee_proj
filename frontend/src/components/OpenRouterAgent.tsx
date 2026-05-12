import { Bot } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Button from "./Button";
import { useOpenRouterAgent } from "../hooks/useOpenRouterAgent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import useAutoScroll from "../hooks/useAutoScroll";

const agentName: string = "Frank";

type Props = {
  className?: string;
};

export default function OpenRouterAgent({ className = "" }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { query, setQuery, loading, error, handleQuery, history } =
    useOpenRouterAgent();

  const visibleMessages = history.filter((msg) => {
    const role = msg.role;
    const message = typeof msg.content === "string" ? msg.content.trim() : "";
    const shouldBeDisplayed = role === "user" || role === "assistant";
    const isToolCallMessage =
      role === "assistant" &&
      Array.isArray(msg.toolCalls) &&
      msg.toolCalls.length > 0 &&
      !message;

    return shouldBeDisplayed && message && !isToolCallMessage;
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(scrollRef, visibleMessages.length);

  return (
    <motion.div
      className={`fixed bottom-0 right-0 z-100 text-secondary-foreground bg-secondary squircle-tl px-6 py-4 ${className}`}
      animate={{ width: isOpen ? "min(100vw, 800px)" : 120 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={!isOpen ? { scale: 1.05 } : undefined}
    >
      <motion.h2
        className="flex items-center justify-center gap-2 mb-4"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{
          cursor: "pointer",
        }}
      >
        {isOpen && (
          <span className="font-semibold text-3xl">
            {agentName} Knows-It-All AI &trade;
          </span>
        )}
        <Bot size={24} />
      </motion.h2>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="chat-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full overflow-hidden flex flex-col gap-6 bg-primary max-h-[50vh] squircle"
          >
            <div className="min-h-[25vh] overflow-y-auto overscroll-contain px-4">
              {visibleMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mt-3 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-500 text-right"
                        : "bg-white/10 text-left"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-semibold mt-4 mb-2 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold mt-4 mb-2 first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold mt-3 mb-1 first:mt-0">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="leading-relaxed mt-3 first:mt-0">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc space-y-1 list-inside ml-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal space-y-1 list-inside ml-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  <div ref={scrollRef} />
                </div>
              ))}
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <textarea
              style={{ resize: "none" }}
              value={query}
              placeholder="Type your question here"
              className="h-20 shrink-0 bg-white/10 squircle px-4 py-2 mx-4"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleQuery();
                }
              }}
            />

            <div className="w-full px-4 pb-6">
              <Button
                onClick={handleQuery}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Thinking..." : "Send"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
