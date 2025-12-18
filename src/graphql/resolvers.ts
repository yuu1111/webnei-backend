import { sql } from "../db";
import type {
  NEI_Item,
  NEI_Fluid,
  NEI_Base_Recipe,
  NEI_GT_Recipe,
  NEI_All_Dimensions,
  SidebarItem,
  AssociatedRecipes,
} from "./types";

async function getItemInputs(recipeId: string): Promise<NEI_Item[]> {
  const rows = await sql`
    SELECT
      item.id,
      item.image_file_path,
      item.internal_name,
      item.item_damage,
      item.item_id,
      item.localized_name,
      item.max_damage,
      item.max_stack_size,
      item.mod_id,
      item.nbt,
      item.tooltip,
      item.unlocalized_name,
      recipe_item_group.item_inputs_key as position,
      item_group_item_stacks.item_stacks_stack_size as stack_size
    FROM item
    JOIN item_group_item_stacks ON item_group_item_stacks.item_stacks_item_id = item.id
    JOIN recipe_item_group ON recipe_item_group.item_inputs_id = item_group_item_stacks.item_group_id
    WHERE recipe_item_group.recipe_id = ${recipeId}
  `;

  return rows.map((r) => ({
    id: r.id,
    itemId: r.item_id,
    position: r.position,
    stackSize: r.stack_size,
    imageFilePath: r.image_file_path,
    internalName: r.internal_name,
    itemDamage: r.item_damage,
    localizedName: r.localized_name,
    maxDamage: r.max_damage,
    maxStackSize: r.max_stack_size,
    modId: r.mod_id,
    nbt: r.nbt,
    tooltip: r.tooltip,
    unlocalizedName: r.unlocalized_name,
    input: true,
    outputProbability: -1,
  }));
}

async function getFluidInputs(recipeId: string): Promise<NEI_Fluid[]> {
  const rows = await sql`
    SELECT
      fluid.id,
      fluid.density,
      fluid.fluid_id,
      fluid.gaseous,
      fluid.image_file_path,
      fluid.internal_name,
      fluid.localized_name,
      fluid.luminosity,
      fluid.mod_id,
      fluid.nbt,
      fluid.temperature,
      fluid.unlocalized_name,
      fluid.viscosity,
      recipe_fluid_group.fluid_inputs_key as position,
      fluid_group_fluid_stacks.fluid_stacks_amount as liters
    FROM fluid
    JOIN fluid_group_fluid_stacks ON fluid_group_fluid_stacks.fluid_stacks_fluid_id = fluid.id
    JOIN recipe_fluid_group ON recipe_fluid_group.fluid_inputs_id = fluid_group_fluid_stacks.fluid_group_id
    WHERE recipe_fluid_group.recipe_id = ${recipeId}
  `;

  return rows.map((r) => ({
    id: r.id,
    fluidId: r.fluid_id,
    position: r.position,
    liters: r.liters,
    density: r.density,
    gaseous: r.gaseous,
    imageFilePath: r.image_file_path,
    internalName: r.internal_name,
    localizedName: r.localized_name,
    luminosity: r.luminosity,
    modId: r.mod_id,
    nbt: r.nbt,
    temperature: r.temperature,
    unlocalizedName: r.unlocalized_name,
    viscosity: r.viscosity,
    input: true,
    outputProbability: -1,
  }));
}

async function getItemOutputs(recipeId: string): Promise<NEI_Item[]> {
  const rows = await sql`
    SELECT
      item.id,
      item.image_file_path,
      item.internal_name,
      item.item_damage,
      item.item_id,
      item.localized_name,
      item.max_damage,
      item.max_stack_size,
      item.mod_id,
      item.nbt,
      item.tooltip,
      item.unlocalized_name,
      recipe_item_outputs.item_outputs_value_probability as output_probability,
      recipe_item_outputs.item_outputs_value_stack_size as stack_size,
      recipe_item_outputs.item_outputs_key as position
    FROM item
    JOIN recipe_item_outputs ON recipe_item_outputs.item_outputs_value_item_id = item.id
    WHERE recipe_item_outputs.recipe_id = ${recipeId}
  `;

  return rows.map((r) => ({
    id: r.id,
    itemId: r.item_id,
    position: r.position,
    stackSize: r.stack_size,
    imageFilePath: r.image_file_path,
    internalName: r.internal_name,
    itemDamage: r.item_damage,
    localizedName: r.localized_name,
    maxDamage: r.max_damage,
    maxStackSize: r.max_stack_size,
    modId: r.mod_id,
    nbt: r.nbt,
    tooltip: r.tooltip,
    unlocalizedName: r.unlocalized_name,
    input: false,
    outputProbability: r.output_probability,
  }));
}

async function getFluidOutputs(recipeId: string): Promise<NEI_Fluid[]> {
  const rows = await sql`
    SELECT
      fluid.id,
      fluid.density,
      fluid.fluid_id,
      fluid.gaseous,
      fluid.image_file_path,
      fluid.internal_name,
      fluid.localized_name,
      fluid.luminosity,
      fluid.mod_id,
      fluid.nbt,
      fluid.temperature,
      fluid.unlocalized_name,
      fluid.viscosity,
      recipe_fluid_outputs.fluid_outputs_value_amount as liters,
      recipe_fluid_outputs.fluid_outputs_value_probability as output_probability,
      recipe_fluid_outputs.fluid_outputs_key as position
    FROM fluid
    JOIN recipe_fluid_outputs ON recipe_fluid_outputs.fluid_outputs_value_fluid_id = fluid.id
    WHERE recipe_fluid_outputs.recipe_id = ${recipeId}
  `;

  return rows.map((r) => ({
    id: r.id,
    fluidId: r.fluid_id,
    position: r.position,
    liters: r.liters,
    density: r.density,
    gaseous: r.gaseous,
    imageFilePath: r.image_file_path,
    internalName: r.internal_name,
    localizedName: r.localized_name,
    luminosity: r.luminosity,
    modId: r.mod_id,
    nbt: r.nbt,
    temperature: r.temperature,
    unlocalizedName: r.unlocalized_name,
    viscosity: r.viscosity,
    input: false,
    outputProbability: r.output_probability,
  }));
}

async function getRecipeTypeInfo(
  recipeId: string
): Promise<{ recipeType: string; iconId: string; dimensions: NEI_All_Dimensions }> {
  const rows = await sql`
    SELECT
      recipe_type.type,
      recipe_type.icon_id,
      recipe_type.fluid_input_dimension_height,
      recipe_type.fluid_input_dimension_width,
      recipe_type.fluid_output_dimension_height,
      recipe_type.fluid_output_dimension_width,
      recipe_type.item_input_dimension_height,
      recipe_type.item_input_dimension_width,
      recipe_type.item_output_dimension_height,
      recipe_type.item_output_dimension_width
    FROM recipe_type
    JOIN recipe ON recipe.recipe_type_id = recipe_type.id
    WHERE recipe.id = ${recipeId}
  `;

  const r = rows[0];
  return {
    recipeType: r.type,
    iconId: r.icon_id,
    dimensions: {
      fluidInputDims: {
        height: r.fluid_input_dimension_height,
        width: r.fluid_input_dimension_width,
      },
      fluidOutputDims: {
        height: r.fluid_output_dimension_height,
        width: r.fluid_output_dimension_width,
      },
      itemInputDims: {
        height: r.item_input_dimension_height,
        width: r.item_input_dimension_width,
      },
      itemOutputDims: {
        height: r.item_output_dimension_height,
        width: r.item_output_dimension_width,
      },
    },
  };
}

async function getBaseRecipe(recipeId: string): Promise<NEI_Base_Recipe> {
  const [inputItems, inputFluids, outputItems, outputFluids, typeInfo] =
    await Promise.all([
      getItemInputs(recipeId),
      getFluidInputs(recipeId),
      getItemOutputs(recipeId),
      getFluidOutputs(recipeId),
      getRecipeTypeInfo(recipeId),
    ]);

  return {
    recipeId,
    recipeType: typeInfo.recipeType,
    iconId: typeInfo.iconId,
    dimensions: typeInfo.dimensions,
    inputItems,
    outputItems,
    inputFluids,
    outputFluids,
  };
}

export async function getGTRecipeByRecipeId(
  recipeId: string
): Promise<NEI_GT_Recipe> {
  const [baseRecipe, gtInfo] = await Promise.all([
    getBaseRecipe(recipeId),
    sql`
      SELECT
        recipe_type.id,
        recipe_type.icon_info,
        recipe_type.shapeless,
        recipe_type.type,
        recipe_type.icon_id,
        greg_tech_recipe.additional_info,
        greg_tech_recipe.amperage,
        greg_tech_recipe.duration,
        greg_tech_recipe.requires_cleanroom,
        greg_tech_recipe.requires_low_gravity,
        greg_tech_recipe.voltage,
        greg_tech_recipe.voltage_tier,
        greg_tech_recipe.recipe_id
      FROM recipe_type
      JOIN recipe ON recipe_type.id = recipe.recipe_type_id
      JOIN greg_tech_recipe ON greg_tech_recipe.recipe_id = recipe.id
      WHERE recipe.id = ${recipeId}
    `,
  ]);

  const r = gtInfo[0];
  return {
    recipeId,
    baseRecipe,
    localizedMachineName: r.type,
    iconInfo: r.icon_info,
    iconId: r.icon_id,
    shapeless: r.shapeless,
    additionalInfo: r.additional_info,
    amperage: r.amperage,
    durationTicks: r.duration,
    requiresCleanroom: r.requires_cleanroom,
    requiresLowGravity: r.requires_low_gravity,
    voltage: r.voltage,
    voltageTier: r.voltage_tier,
  };
}

function preprocessSearch(search: string): string {
  const reserved = ["_", "\\", "%"];
  let result = "%";
  for (const char of search.toLowerCase()) {
    if (reserved.includes(char)) {
      result += "\\" + char;
    } else {
      result += char;
    }
  }
  return result + "%";
}

export async function getSidebarItems(
  limit: number,
  search: string,
  mode: string
): Promise<SidebarItem[]> {
  let rows;

  if (mode === "contains") {
    if (search === "") {
      rows = await sql`
        SELECT id, image_file_path, localized_name, tooltip
        FROM item
        ORDER BY item_id
        LIMIT ${limit}
      `;
    } else {
      const processedSearch = preprocessSearch(search);
      rows = await sql`
        SELECT id, image_file_path, localized_name, tooltip
        FROM item
        WHERE LOWER(localized_name) LIKE ${processedSearch}
        AND localized_name != ''
        ORDER BY item_id
        LIMIT ${limit}
      `;
    }
  } else {
    rows = await sql`
      SELECT id, image_file_path, localized_name, tooltip
      FROM item
      WHERE localized_name ~* ${search}
      LIMIT ${limit}
    `;
  }

  return rows.map((r) => ({
    itemId: r.id,
    imageFilePath: r.image_file_path,
    localizedName: r.localized_name,
    tooltip: r.tooltip,
  }));
}

async function splitRecipesByType(
  recipeIds: string[]
): Promise<{ gt: NEI_GT_Recipe[]; other: NEI_Base_Recipe[] }> {
  if (recipeIds.length === 0) {
    return { gt: [], other: [] };
  }

  const recipeLimit = 100;

  const gtRows = await sql`
    SELECT recipe.id
    FROM recipe_type
    JOIN recipe ON recipe.recipe_type_id = recipe_type.id
    WHERE recipe.id = ANY(${recipeIds})
    AND recipe_type.category = 'gregtech'
    LIMIT ${recipeLimit}
  `;

  const otherRows = await sql`
    SELECT recipe.id
    FROM recipe_type
    JOIN recipe ON recipe.recipe_type_id = recipe_type.id
    WHERE recipe.id = ANY(${recipeIds})
    AND recipe_type.category != 'gregtech'
    LIMIT ${recipeLimit}
  `;

  const [gtRecipes, otherRecipes] = await Promise.all([
    Promise.all(gtRows.map((r) => getGTRecipeByRecipeId(r.id))),
    Promise.all(otherRows.map((r) => getBaseRecipe(r.id))),
  ]);

  return { gt: gtRecipes, other: otherRecipes };
}

export async function getRecipesThatMakeSingleId(
  singleId: string
): Promise<AssociatedRecipes> {
  let rows = await sql`
    SELECT recipe_id FROM recipe_item_outputs
    WHERE item_outputs_value_item_id = ${singleId}
  `;

  if (rows.length === 0) {
    rows = await sql`
      SELECT recipe_id FROM recipe_fluid_outputs
      WHERE fluid_outputs_value_fluid_id = ${singleId}
    `;
  }

  const recipeIds = rows.map((r) => r.recipe_id);
  const { gt, other } = await splitRecipesByType(recipeIds);

  return {
    singleId,
    gtRecipes: gt,
    otherRecipes: other,
  };
}

export async function getRecipesThatUseSingleId(
  singleId: string
): Promise<AssociatedRecipes> {
  let rows = await sql`
    SELECT recipe_id FROM recipe_item_inputs_items
    WHERE item_inputs_items_id = ${singleId}
  `;

  if (rows.length === 0) {
    rows = await sql`
      SELECT recipe_id FROM recipe_fluid_inputs_fluids
      WHERE fluid_inputs_fluids_id = ${singleId}
    `;
  }

  const recipeIds = rows.map((r) => r.recipe_id);
  const { gt, other } = await splitRecipesByType(recipeIds);

  return {
    singleId,
    gtRecipes: gt,
    otherRecipes: other,
  };
}
