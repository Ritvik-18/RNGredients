/**
 * Loot Table Algorithm — RNGredients
 * Implements the weighting logic from meal_prep.md §5
 */
import { differenceInDays } from 'date-fns';
import type { Recipe, InventoryItem, Player, MealSlot, ScoredRecipe, QuestLog, CraftingTask, QuestSlot } from '../types';

// ─── Ingredient synonym normalization ────────────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  protein_chicken_breast:    ['protein_chicken_breast', 'protein_chicken'],
  protein_paneer:            ['protein_paneer'],
  protein_tofu:              ['protein_tofu'],
  protein_eggs:              ['protein_eggs', 'protein_egg'],
  protein_chickpeas_canned:  ['protein_chickpeas_canned', 'protein_chickpeas'],
  veg_onion_red:             ['veg_onion_red', 'veg_onion'],
  veg_tomato_fresh:          ['veg_tomato_fresh', 'veg_tomato'],
  veg_spinach_fresh:         ['veg_spinach_fresh', 'veg_spinach'],
  veg_bell_pepper_mixed:     ['veg_bell_pepper_mixed', 'veg_bell_pepper'],
  veg_broccoli_head:         ['veg_broccoli_head', 'veg_broccoli'],
  veg_cucumber:              ['veg_cucumber'],
  veg_lemon:                 ['veg_lemon'],
  carb_rice_basmati:         ['carb_rice_basmati', 'carb_rice'],
  carb_rice_jasmine:         ['carb_rice_jasmine', 'carb_rice'],
  carb_pasta_penne:          ['carb_pasta_penne', 'carb_pasta'],
  carb_bread_wholewheat:     ['carb_bread_wholewheat', 'carb_bread'],
  carb_oats_rolled:          ['carb_oats_rolled', 'carb_oats'],
  base_oil_vegetable:        ['base_oil_vegetable', 'base_oil'],
  base_oil_olive:            ['base_oil_olive', 'base_oil'],
  base_coconut_milk_canned:  ['base_coconut_milk_canned', 'base_coconut_milk'],
  base_tomato_puree:         ['base_tomato_puree'],
  spice_garam_masala:        ['spice_garam_masala'],
  spice_turmeric_powder:     ['spice_turmeric_powder', 'spice_turmeric'],
  spice_cumin_seeds:         ['spice_cumin_seeds', 'spice_cumin'],
  spice_curry_paste_green:   ['spice_curry_paste_green'],
  spice_salt:                ['spice_salt'],
  spice_pepper_black:        ['spice_pepper_black'],
  herb_cilantro_fresh:       ['herb_cilantro_fresh', 'herb_cilantro'],
  herb_basil_thai:           ['herb_basil_thai', 'herb_basil'],
  dairy_cream_heavy:         ['dairy_cream_heavy', 'dairy_cream'],
  dairy_yogurt_plain:        ['dairy_yogurt_plain', 'dairy_yogurt'],
};

function resolveToCanonical(id: string): string {
  for (const [canon, aliases] of Object.entries(SYNONYMS)) {
    if (aliases.includes(id)) return canon;
  }
  return id;
}

// Ingredients assumed always present (basics most kitchens have)
const ASSUMED_STAPLES = new Set([
  'spice_salt', 'spice_pepper_black',
  'base_oil_vegetable', 'base_oil_olive',
  'base_water',
]);

function inventorySet(inventory: InventoryItem[]): Set<string> {
  const out = new Set<string>(ASSUMED_STAPLES);
  for (const item of inventory) {
    if (item.ingredient_id) {
      out.add(resolveToCanonical(item.ingredient_id));
    }
  }
  return out;
}

// ─── HP% calculation ─────────────────────────────────────────────────────────
export function calcHpPct(decayTimer: string): number {
  const days = differenceInDays(new Date(decayTimer), new Date());
  return Math.max(0, Math.min(1, days / 7));
}

export function hpStatus(pct: number): 'healthy' | 'warning' | 'critical' | 'expired' {
  if (pct <= 0)   return 'expired';
  if (pct < 0.2)  return 'critical';
  if (pct < 0.5)  return 'warning';
  return 'healthy';
}

function passesDiet(recipe: Recipe, player: Player): boolean {
  for (const restriction of player.dietary_restrictions) {
    const tag = restriction as string;
    if (tag === 'vegetarian' && !recipe.dietary_tags.includes('vegetarian') && !recipe.dietary_tags.includes('vegan')) return false;
    if (tag === 'vegan' && !recipe.dietary_tags.includes('vegan')) return false;
    if (tag === 'gluten_free' && !recipe.dietary_tags.includes('gluten_free')) return false;
  }
  return true;
}

function passesEquipment(recipe: Recipe, player: Player): boolean {
  if (recipe.appliances_required.length === 0) return true;
  return recipe.appliances_required.some(a => player.cooking.equipment.includes(a));
}

// ─── Step 1: Constraint Filtering with fallback chain ────────────────────────
// Never returns empty if `recipes` has any entries. Tries strict → loose → anything.
function filterRecipes(
  recipes: Recipe[],
  slot: MealSlot,
  player: Player,
): Recipe[] {
  // Tier 1: meal_type + dietary + equipment
  const tier1 = recipes.filter(r =>
    r.meal_type.includes(slot.tag) &&
    passesDiet(r, player) &&
    passesEquipment(r, player),
  );
  if (tier1.length > 0) return tier1;

  // Tier 2: meal_type + dietary (ignore equipment)
  const tier2 = recipes.filter(r => r.meal_type.includes(slot.tag) && passesDiet(r, player));
  if (tier2.length > 0) return tier2;

  // Tier 3: dietary only (cross-meal-type — snack/breakfast overlap)
  const tier3 = recipes.filter(r => passesDiet(r, player));
  if (tier3.length > 0) return tier3;

  // Tier 4: anything
  return recipes;
}

// ─── Step 2: Weighting ───────────────────────────────────────────────────────
function scoreRecipe(
  recipe: Recipe,
  slot: MealSlot,
  player: Player,
  inventory: InventoryItem[],
  dailyCalories: number,
): ScoredRecipe {
  const invSet = inventorySet(inventory);
  const invMap = new Map(inventory.map(i => [resolveToCanonical(i.ingredient_id ?? ''), i]));

  // decay_urgency: how many ingredients are expiring soon?
  const urgencyItems = recipe.required_materials
    .map(m => invMap.get(resolveToCanonical(m.id)))
    .filter(Boolean) as InventoryItem[];
  const decayUrgencyRaw = urgencyItems.reduce((sum, item) => {
    const hpPct = calcHpPct(item.decay_timer);
    return sum + Math.max(0, 1 - hpPct);
  }, 0);
  const decay_urgency = Math.min(100, decayUrgencyRaw * 25);

  // inventory_match: % of ingredients already owned
  const matched = recipe.required_materials.filter(m => invSet.has(resolveToCanonical(m.id))).length;
  const inventory_match = (matched / Math.max(1, recipe.required_materials.length)) * 100;

  // stat_alignment: how close is calorie count to slot target?
  const slotCalTarget = dailyCalories * (slot.calorie_pct / 100);
  const stat_alignment = Math.max(0, 100 - Math.abs(recipe.stat_buffs.calories - slotCalTarget) * 0.3);

  // macro_fit: protein alignment
  const targetProteinPerMeal = player.stat_goals.str_protein / player.meal_structure.meals.length;
  const macro_fit = Math.max(0, 100 - Math.abs(recipe.stat_buffs.protein - targetProteinPerMeal) * 3);

  // cuisine_pref bonus
  const cuisine_pref = player.cuisine_preferences.includes(recipe.cuisine_type) ? 100 : 0;

  // time_penalty
  const remainingTime = player.cooking.max_daily_prep_min;
  const time_penalty = recipe.cook_time_active > remainingTime ? 50 : 0;

  const score =
    100 +
    decay_urgency    * 0.50 +
    inventory_match  * 0.30 +
    stat_alignment   * 0.20 +
    macro_fit        * 0.15 +
    cuisine_pref     * 0.10 -
    time_penalty     * 0.10;

  return { recipe, score, decay_urgency, inventory_match, stat_alignment };
}

// ─── Step 3: Weighted Random Pick ────────────────────────────────────────────
function weightedRandom<T extends { score: number }>(pool: T[]): T {
  const total = pool.reduce((s, r) => s + r.score, 0);
  let rand = Math.random() * total;
  for (const item of pool) {
    rand -= item.score;
    if (rand <= 0) return item;
  }
  return pool[pool.length - 1];
}

// ─── Step 5: Build Flat Crafting Queue ───────────────────────────────────────
function buildCraftingQueue(selected: QuestSlot[]): CraftingTask[] {
  const withRecipe = selected.filter((q): q is QuestSlot & { recipe: Recipe } => q.recipe !== null);
  const tasks: CraftingTask[] = [];
  let offset = 0;

  const ingredientMap = new Map<string, string[]>();
  for (const quest of withRecipe) {
    for (const mat of quest.recipe.required_materials) {
      const existing = ingredientMap.get(mat.id) ?? [];
      existing.push(quest.slot);
      ingredientMap.set(mat.id, existing);
    }
  }

  const batchIngredients = [...ingredientMap.entries()].filter(([, slots]) => slots.length > 1);

  if (batchIngredients.length > 0) {
    const batchNames = batchIngredients.map(([id]) => {
      const name = id.replace(/^(protein|veg|carb|spice|herb|dairy|base)_/, '').replace(/_/g, ' ');
      return name.charAt(0).toUpperCase() + name.slice(1);
    }).join(', ');

    tasks.push({
      time_offset_min: offset,
      task: `Batch prep: ${batchNames}`,
      used_in: [...new Set(batchIngredients.flatMap(([, slots]) => slots))],
      passive: false,
    });
    offset += 5;
  }

  const sorted = [...withRecipe].sort((a, b) => b.recipe.prep_time_passive - a.recipe.prep_time_passive);

  for (const quest of sorted) {
    if (quest.recipe.prep_time_passive > 0) {
      tasks.push({
        time_offset_min: offset,
        task: `Start passive prep: ${quest.recipe.title}`,
        used_in: [quest.slot],
        passive: true,
      });
      offset += quest.recipe.cook_time_active;
    } else {
      tasks.push({
        time_offset_min: offset,
        task: `Cook: ${quest.recipe.title}`,
        used_in: [quest.slot],
        passive: false,
      });
      offset += quest.recipe.cook_time_active;
    }
  }

  return tasks;
}

// ─── Build empty per-day skeleton ─────────────────────────────────────────────
export function buildEmptyQuestLog(player: Player, date: string): QuestLog {
  const quests: QuestSlot[] = player.meal_structure.meals.map(slot => ({
    slot: slot.slot,
    tag: slot.tag,
    recipe: null,
    calorie_target: player.stat_goals.hp_calories * (slot.calorie_pct / 100),
    status: 'pending' as const,
    time: slot.time,
  }));

  return {
    id: crypto.randomUUID(),
    user_id: player.id,
    date,
    meal_count: quests.length,
    quests,
    crafting_queue: [],
    total_buffs: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    missing_materials: [],
    rerolls_remaining: 3,
  };
}

// ─── Roll one slot ────────────────────────────────────────────────────────────
export function rollSingleMeal(
  recipes: Recipe[],
  player: Player,
  inventory: InventoryItem[],
  slot: MealSlot,
  excludeRecipeIds: string[] = [],
): QuestSlot | null {
  const pool = filterRecipes(recipes, slot, player);
  if (pool.length === 0) return null;

  const available = pool.filter(r => !excludeRecipeIds.includes(r.id));
  const candidates = available.length > 0 ? available : pool;

  const scored = candidates.map(r => scoreRecipe(r, slot, player, inventory, player.stat_goals.hp_calories));
  const topN = Math.max(2, Math.ceil(scored.length * 0.5));
  const topPool = scored.sort((a, b) => b.score - a.score).slice(0, topN);
  const picked = weightedRandom(topPool);

  return {
    slot: slot.slot,
    tag: slot.tag,
    recipe: picked.recipe,
    calorie_target: player.stat_goals.hp_calories * (slot.calorie_pct / 100),
    status: 'rolled',
    time: slot.time,
  };
}

// ─── Rebuild crafting queue from rolled quests ────────────────────────────────
export function rebuildCraftingFromQuests(rolled: QuestSlot[]): CraftingTask[] {
  return buildCraftingQueue(rolled);
}

// ─── Main Roll Function (legacy — rolls all slots at once) ────────────────────
export function rollMeals(
  allRecipes: Recipe[],
  player: Player,
  inventory: InventoryItem[],
): QuestLog {
  const { hp_calories } = player.stat_goals;
  const slots = player.meal_structure.meals;
  const selected: QuestSlot[] = [];
  const usedIds = new Set<string>();

  for (const slot of slots) {
    const pool = filterRecipes(allRecipes, slot, player);
    if (pool.length === 0) continue; // recipe data empty — skip slot

    // Exclude already-selected recipes
    const available = pool.filter(r => !usedIds.has(r.id));
    const fallback = available.length > 0 ? available : pool;

    const scored = fallback.map(r => scoreRecipe(r, slot, player, inventory, hp_calories));

    // Pick from top 50% (wider pool = more variety; min 2)
    const topN = Math.max(2, Math.ceil(scored.length * 0.5));
    const topPool = scored.sort((a, b) => b.score - a.score).slice(0, topN);
    const picked = weightedRandom(topPool);

    usedIds.add(picked.recipe.id);
    selected.push({
      slot: slot.slot,
      tag: slot.tag,
      recipe: picked.recipe,
      calorie_target: hp_calories * (slot.calorie_pct / 100),
      status: 'rolled' as const,
    });
  }

  const total_buffs = selected.reduce(
    (acc, q) => ({
      calories: acc.calories + q.recipe.stat_buffs.calories,
      protein:  acc.protein  + q.recipe.stat_buffs.protein,
      carbs:    acc.carbs    + q.recipe.stat_buffs.carbs,
      fat:      acc.fat      + q.recipe.stat_buffs.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const allRequiredIds = new Set(selected.flatMap(q => q.recipe.required_materials.map(m => m.id)));
  const inventoryIds = inventorySet(inventory);
  const missing_materials = [...allRequiredIds]
    .filter(id => !inventoryIds.has(resolveToCanonical(id)))
    .map(id => {
      const mat = selected
        .flatMap(q => q.recipe.required_materials)
        .find(m => m.id === id);
      return mat?.common_name ?? id;
    });

  const crafting_queue = buildCraftingQueue(selected);

  return {
    id: crypto.randomUUID(),
    user_id: player.id,
    date: new Date().toISOString().split('T')[0],
    meal_count: selected.length,
    quests: selected,
    crafting_queue,
    total_buffs,
    missing_materials: [...new Set(missing_materials)],
    rerolls_remaining: 3,
  };
}
