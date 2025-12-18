export interface NEI_Item {
  id: string;
  itemId: number;
  position: number;
  stackSize: number;
  imageFilePath: string;
  internalName: string;
  itemDamage: number;
  localizedName: string;
  maxDamage: number;
  maxStackSize: number;
  modId: string;
  nbt: string;
  tooltip: string;
  unlocalizedName: string;
  input: boolean;
  outputProbability: number;
}

export interface NEI_Fluid {
  id: string;
  fluidId: number;
  position: number;
  liters: number;
  density: number;
  gaseous: boolean;
  imageFilePath: string;
  internalName: string;
  localizedName: string;
  luminosity: number;
  modId: string;
  nbt: string;
  temperature: number;
  unlocalizedName: string;
  viscosity: number;
  input: boolean;
  outputProbability: number;
}

export interface NEI_Recipe_Dimensions {
  height: number;
  width: number;
}

export interface NEI_All_Dimensions {
  fluidInputDims: NEI_Recipe_Dimensions;
  fluidOutputDims: NEI_Recipe_Dimensions;
  itemInputDims: NEI_Recipe_Dimensions;
  itemOutputDims: NEI_Recipe_Dimensions;
}

export interface NEI_Base_Recipe {
  recipeId: string;
  recipeType: string;
  iconId: string;
  dimensions: NEI_All_Dimensions;
  inputItems: NEI_Item[];
  outputItems: NEI_Item[];
  inputFluids: NEI_Fluid[];
  outputFluids: NEI_Fluid[];
}

export interface NEI_GT_Recipe {
  recipeId: string;
  baseRecipe: NEI_Base_Recipe;
  localizedMachineName: string;
  iconInfo: string;
  iconId: string;
  shapeless: boolean;
  additionalInfo: string;
  amperage: number;
  durationTicks: number;
  requiresCleanroom: boolean;
  requiresLowGravity: boolean;
  voltage: number;
  voltageTier: string;
}

export interface SidebarItem {
  itemId: string;
  imageFilePath: string;
  localizedName: string;
  tooltip: string;
}

export interface AssociatedRecipes {
  singleId: string;
  gtRecipes: NEI_GT_Recipe[];
  otherRecipes: NEI_Base_Recipe[];
}
