const express = require("express");
const router = express.Router();
const { getOpenRouter } = require("../lib/openrouter");
const { model } = require("../llm/model");
const { tools } = require("../llm/tools");
const { runTool } = require("../llm/toolHandler");
const { systemPrompt } = require("../llm/systemPrompt");

router.post("/", async (req, res) => {
  try {
    const openRouter = await getOpenRouter();
    const newMessage = req.body.messages;

    if (!Array.isArray(newMessage)) {
      return res.status(400).json({ error: "Messages must be an array" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res
        .status(500)
        .json({ error: "Missing OPENROUTER_API_KEY on server" });
    }

    const safeHistory = newMessage.filter(
      (msg) =>
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string",
    );

    const messages = [
      { role: "system", content: systemPrompt },
      ...safeHistory,
    ];

    const firstRes = await openRouter.chat.send({
      chatRequest: {
        model,
        messages,
        tools,
        toolChoice: "auto",
      },
    });

    const assistantMessage = firstRes.choices[0].message;

    if (!assistantMessage) {
      return res.status(500).json({ error: "No assistant response received" });
    }

    const toolCalls = assistantMessage.toolCalls ?? [];

    if (toolCalls.length === 0) {
      const finalRes =
        typeof assistantMessage.content === "string"
          ? assistantMessage.content
          : "";

      return res.json({ response: finalRes });
    }

    const assistantToolCallMessage = {
      role: "assistant",
      content: assistantMessage.content ?? null,
      toolCalls,
    };

    const toolMessages = [];

    for (const toolCall of toolCalls) {
      const rawArgs = toolCall.function?.arguments;
      const args =
        typeof rawArgs === "string"
          ? JSON.parse(rawArgs || "{}")
          : (rawArgs ?? {});

      const result = await runTool(toolCall.function.name, args);
      console.log("tool result:", result);

      toolMessages.push({
        role: "tool",
        toolCallId: toolCall.id,
        name: toolCall.function.name,
        content: JSON.stringify(result ?? null),
      });
    }

    const secondMessages = [
      ...messages,
      assistantToolCallMessage,
      ...toolMessages,
    ];

    console.dir(secondMessages, { depth: null });

    const secondResponse = await openRouter.chat.send({
      chatRequest: {
        model,
        messages: secondMessages,
        tools,
        toolChoice: "auto",
      },
    });

    const finalMessage = secondResponse.choices[0].message;
    const finalRes =
      typeof finalMessage.content === "string" ? finalMessage.content : "";

    return res.json({ response: finalRes });
  } catch (e) {
    console.error("agent route error: ", e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : "Internal server error",
    });
  }
});

module.exports = router;
