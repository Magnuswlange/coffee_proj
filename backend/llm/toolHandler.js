const drinksModule = require("../../shared/data/drinkTypes");
const { drinkTypes } = drinksModule;

const getDrinks = () => drinkTypes;

const runTool = async (toolName) => {
  switch (toolName) {
    case "getDrinks":
      return getDrinks();
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
};

module.exports = { getDrinks, runTool };
