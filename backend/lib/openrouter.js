let client = null;

async function getOpenRouter() {
  if (client) {
    return client;
  }

  const { OpenRouter } = await import("@openrouter/sdk");

  client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  return client;
}

module.exports = { getOpenRouter };
