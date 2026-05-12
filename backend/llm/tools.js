const tools = [
  {
    type: "function",
    function: {
      name: "getDrinks",
      description:
        "Retrieves the list of available drink variations, including drink name, description, size, cup size, whether it's hot or cold, sweetness, intensity and popularity. Use this when the user wants recommendations or to see what is available.",
      parameters: {
        type: "object",
        properties: {}, // No input parameters needed for this simple example
        required: [],
      },
    },
  },
];

module.exports = { tools };
