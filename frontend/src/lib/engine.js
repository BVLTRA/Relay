// Very optional, may not include (AI proof of concept, not a core feature):
// The Dictionary. The keys are the exact 9-slot state.
const RECIPE_BOOK = {
  // Top row wood, middle stick, bottom stick
  "oak_planks,oak_planks,oak_planks,empty,stick,empty,empty,stick,empty": {
    id: "wooden_pickaxe",
    name: "Wooden Pickaxe",
    icon: "⛏️"
  },
  // 2x2 wood in the top left
  "oak_planks,oak_planks,empty,oak_planks,oak_planks,empty,empty,empty,empty": {
    id: "crafting_table",
    name: "Crafting Table",
    icon: "🧰"
  }
};

// END

// Thinking part
export const validateRecipe = (gridArray) => {
  // Normalize the array into a string
  // If a slot is empty, make it... 'empty'. Otherwise, grab the item id.
  const serializedGrid = gridArray.map(slot => slot ? slot.id : 'empty').join(',');

  // [OPTIONAL] Look it up in the dictionary
  const result = RECIPE_BOOK[serializedGrid];
  
  return result || null;
};