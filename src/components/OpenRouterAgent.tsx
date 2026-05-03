import { OpenRouter } from "@openrouter/sdk";
import { Bot } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Button from "./Button";
import { useOpenRouterAgent } from "../hooks/useOpenRouterAgent";
import { agentName } from "../ai/agentModels";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import useAutoScroll from "../hooks/useAutoScroll";

const parentVariant2: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      type: "tween",
      ease: "easeOut",
      duration: 0.2,
      staggerDirection: -1,
      staggerChildren: 0, // after removing children delay
      delayChildren: 0.1, // per child delay
    },
  },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      type: "tween",
      ease: "easeOut",
      duration: 0.2,
      staggerChildren: 0.1, // per child delay
      delayChildren: 0, // delay before children
    },
  },
};

const childVariant2: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: { type: "tween", ease: "easeOut", duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.2,
    },
  },
};

type Props = {
  openRouter: OpenRouter;
  className?: string;
};

export default function OpenRouterAgent({ openRouter, className = "" }: Props) {
  const [isExpanded, setisExpanded] = useState<boolean>(false);
  const { query, setQuery, loading, error, handleQuery, history } =
    useOpenRouterAgent({ openRouter });

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
      className={`fixed bottom-0 right-0 z-100 text-secondary-foreground bg-secondary flex flex-col squircle-tl items-center p-4 overflow-hidden ${className}`}
      whileHover={{
        scale: 1.05,
        backgroundColor: "var(--color-secondary)",
        color: "var(--color-secondary-foreground)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{
        y: 20,
        opacity: 0,
      }}
      animate={{
        transition: { duration: 0.2, ease: "easeOut" },
        y: 0,
        opacity: 1,
        width: isExpanded ? 450 : 100,
        height: isExpanded ? 650 : 60,
      }}
      exit={{ y: 20, opacity: 0 }}
    >
      <motion.h2
        className="flex items-center justify-center gap-2 mb-2 min-h-5"
        onClick={() => setisExpanded((prev) => !prev)}
        whileHover={{
          cursor: "pointer",
        }}
      >
        {isExpanded && (
          <span className="font-semibold text-3xl">Ask {agentName}</span>
        )}
        <Bot size={24} />
      </motion.h2>

      <AnimatePresence initial={true} mode="wait">
        {isExpanded && (
          <motion.div
            className="w-full"
            variants={parentVariant2}
            key="key"
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              variants={childVariant2}
              className="w-full text-wrap h-100 bg-primary squircle px-4 py-2 overflow-y-auto mb-4"
            >
              {visibleMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white text-right"
                        : "bg-white/10 text-left"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-3 list-disc space-y-1 pl-5">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-3 list-decimal space-y-1 pl-5">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                    <div ref={scrollRef} />
                  </div>
                </div>
              ))}
              {error && <p className="text-500-red">{error}</p>}
            </motion.div>

            <motion.textarea
              variants={childVariant2}
              style={{ resize: "none" }}
              value={query}
              placeholder="idk what i want, recommend me a coffee with oat milk..."
              className="w-full mx-auto h-20 bg-primary squircle px-4 py-2"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleQuery();
                }
              }}
            />

            <motion.div variants={childVariant2} className="w-full">
              <Button
                onClick={handleQuery}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Thinking..." : "Send"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
