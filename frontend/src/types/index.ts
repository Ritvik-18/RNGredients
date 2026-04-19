// ─── Grimoire Nomenclature (STRICT — matches recipes_grimoire.md) ─────────────

export type CuisineType =
  | 'indian_north' | 'indian_south' | 'thai'
  | 'continental' | 'mediterranean' | 'mexican' | 'fusion';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';

export type DietaryTag =
  | 'vegetarian' | 'vegan' | 'gluten_free'
  | 'high_protein' | 'low_carb' | 'dairy_free';

export type Appliance =
  | 'stovetop' | 'oven' | 'microwave'
  | 'blender' | 'pressure_cooker' | 'air_fryer' | 'toaster'
  | 'slow_cooker' | 'grill' | 'rice_cooker' | 'food_processor';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type IngredientId = string;

export type ThemeId =
  | 'gameboy' | 'nes' | 'snes' | 'genesis' | 'pokemon'
  | 'zelda' | 'street_fighter' | 'pacman' | 'tetris' | 'final_fantasy'
  | 'castlevania' | 'mega_man' | 'earthbound' | 'dkc' | 'pico8';

export type ActivityLevel =
  | 'sedentary' | 'lightly_active' | 'moderately_active'
  | 'very_active' | 'extra_active';

export type FitnessTarget =
  | 'lose_weight_fast' | 'lose_weight' | 'lose_weight_slow'
  | 'maintain' | 'lean_bulk' | 'bulk' | 'aggressive_bulk';

export type MealPreset =
  | 'balanced' | 'high_protein' | 'vegan' | 'keto'
  | 'diabetic' | 'low_fat' | 'mediterranean' | 'custom';

export type Gender = 'male' | 'female' | 'other';

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface ThemeVars {
  'bg-primary': string;
  'bg-secondary': string;
  'bg-tertiary': string;
  'text-primary': string;
  'text-secondary': string;
  'accent-1': string;
  'accent-2': string;
  'accent-3': string;
  success: string;
  warning: string;
  error: string;
  border: string;
  'rarity-common': string;
  'rarity-uncommon': string;
  'rarity-rare': string;
  'rarity-legendary': string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  era: string;
  preview: string[];
  vars: ThemeVars;
}

// ─── Ingredient ───────────────────────────────────────────────────────────────

export interface RecipeIngredient {
  id: IngredientId;
  common_name: string;
  quantity: number;
  unit: string;
  note?: string;
}

// ─── Recipe ───────────────────────────────────────────────────────────────────

export interface Recipe {
  id: string;
  title: string;
  asset?: string;
  cuisine_type: CuisineType;
  meal_type: MealType[];
  dietary_tags: DietaryTag[];
  appliances_required: Appliance[];
  prep_time_passive: number;
  cook_time_active: number;
  rarity: Rarity;
  stat_buffs: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  required_materials: RecipeIngredient[];
  crafting_steps: string[];
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryItem {
  id: string;
  user_id: string;
  item_name: string;
  ingredient_id?: IngredientId;
  quantity: number;
  unit: string;
  category: 'protein' | 'vegetable' | 'carb' | 'spice' | 'dairy' | 'base' | 'other';
  decay_timer: string;
  rarity: Rarity;
  is_pantry_staple?: boolean;
}

// ─── Body Stats & Calorie ─────────────────────────────────────────────────────

export interface BodyStats {
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  target_weight_kg?: number;
  unit_preference: 'metric' | 'imperial';
}

export interface CalculatedStats {
  bmr: number;
  tdee: number;
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

// ─── Meal Slot with Time ──────────────────────────────────────────────────────

export interface MealSlot {
  slot: string;
  tag: MealType;
  calorie_pct: number;
  time?: string;        // "HH:MM" — when to show meal popup
  label?: string;       // display name override
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  username: string;
  body_stats: BodyStats;
  activity_level: ActivityLevel;
  fitness_target: FitnessTarget;
  meal_preset: MealPreset;
  dietary_restrictions: DietaryTag[];
  allergies: string[];
  intolerances: string[];
  custom_exclusions: string[];
  religious_diet: string | null;
  health_conditions: string[];
  meal_structure: {
    preset: string;
    meals: MealSlot[];
    fasting_window: null | { start: string; end: string };
  };
  stat_goals: {
    hp_calories: number;
    str_protein: number;
    macro_preset: string;
    macros: { carbs_pct: number; protein_pct: number; fat_pct: number };
  };
  cuisine_preferences: string[];
  cooking: {
    skill_level: 'novice' | 'intermediate' | 'advanced';
    max_daily_prep_min: number;
    equipment: Appliance[];
    preferred_methods: string[];
  };
  servings: number;
  level: number;
  current_streak: number;
  theme: ThemeId;
}

// ─── Quest Log ────────────────────────────────────────────────────────────────

export interface CraftingTask {
  time_offset_min: number;
  task: string;
  used_in: string[];
  passive: boolean;
}

export interface QuestSlot {
  slot: string;
  tag: MealType;
  recipe: Recipe | null;  // null when status === 'pending'
  calorie_target: number;
  status: 'pending' | 'rolled' | 'locked' | 'done';
  time?: string;
}

export interface QuestLog {
  id: string;
  user_id: string;
  date: string;
  meal_count: number;
  quests: QuestSlot[];
  crafting_queue: CraftingTask[];
  total_buffs: { calories: number; protein: number; carbs: number; fat: number };
  missing_materials: string[];
  rerolls_remaining: number;
}

// ─── Loot Table ───────────────────────────────────────────────────────────────

export interface ScoredRecipe {
  recipe: Recipe;
  score: number;
  decay_urgency: number;
  inventory_match: number;
  stat_alignment: number;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingState {
  step: number;
  username: string;
  body_stats: Partial<BodyStats>;
  activity_level: ActivityLevel;
  fitness_target: FitnessTarget;
  meal_preset: MealPreset;
  dietary_restrictions: string[];
  allergies: string[];
  custom_exclusions: string[];
  meals_per_day: number;
  meal_slots: MealSlot[];
  equipment: Appliance[];
  pantry_checked: string[];
  theme: ThemeId;
}
