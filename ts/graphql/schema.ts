export const typeDefs = /* GraphQL */ `
  type NEI_Item {
    id: String!
    itemId: Int!
    position: Int!
    stackSize: Int!
    imageFilePath: String!
    internalName: String!
    itemDamage: Int!
    localizedName: String!
    maxDamage: Int!
    maxStackSize: Int!
    modId: String!
    nbt: String!
    tooltip: String!
    unlocalizedName: String!
    input: Boolean!
    outputProbability: Float!
  }

  type NEI_Fluid {
    id: String!
    fluidId: Int!
    position: Int!
    liters: Int!
    density: Int!
    gaseous: Boolean!
    imageFilePath: String!
    internalName: String!
    localizedName: String!
    luminosity: Int!
    modId: String!
    nbt: String!
    temperature: Int!
    unlocalizedName: String!
    viscosity: Int!
    input: Boolean!
    outputProbability: Float!
  }

  type NEI_Recipe_Dimensions {
    height: Int!
    width: Int!
  }

  type NEI_All_Dimensions {
    fluidInputDims: NEI_Recipe_Dimensions!
    fluidOutputDims: NEI_Recipe_Dimensions!
    itemInputDims: NEI_Recipe_Dimensions!
    itemOutputDims: NEI_Recipe_Dimensions!
  }

  type NEI_Base_Recipe {
    recipeId: String!
    recipeType: String!
    iconId: String!
    dimensions: NEI_All_Dimensions!
    inputItems: [NEI_Item!]!
    outputItems: [NEI_Item!]!
    inputFluids: [NEI_Fluid!]!
    outputFluids: [NEI_Fluid!]!
  }

  type NEI_GT_Recipe {
    recipeId: String!
    baseRecipe: NEI_Base_Recipe!
    localizedMachineName: String!
    iconInfo: String!
    iconId: String!
    shapeless: Boolean!
    additionalInfo: String!
    amperage: Int!
    durationTicks: Int!
    requiresCleanroom: Boolean!
    requiresLowGravity: Boolean!
    voltage: Int!
    voltageTier: String!
  }

  type SidebarItem {
    itemId: String!
    imageFilePath: String!
    localizedName: String!
    tooltip: String!
  }

  type AssociatedRecipes {
    singleId: String!
    gtRecipes: [NEI_GT_Recipe!]!
    otherRecipes: [NEI_Base_Recipe!]!
  }

  type Query {
    getGTRecipeByRecipeId(recipeId: String!): NEI_GT_Recipe!
    getNSidebarItems(limit: Int!, search: String!, mode: String!): [SidebarItem!]!
    getRecipesThatMakeSingleId(itemId: String!): AssociatedRecipes!
    getRecipesThatUseSingleId(itemId: String!): AssociatedRecipes!
  }
`;
