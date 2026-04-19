import type { InventoryItem, Player } from '../types';
import { addDays, format } from 'date-fns';

const today = new Date();
const d = (offset: number) => format(addDays(today, offset), 'yyyy-MM-dd');

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_001', user_id: 'player_01',
    item_name: 'Chicken Breast', ingredient_id: 'protein_chicken_breast',
    quantity: 500, unit: 'grams', category: 'protein',
    decay_timer: d(1), rarity: 'rare',
  },
  {
    id: 'inv_002', user_id: 'player_01',
    item_name: 'Paneer', ingredient_id: 'protein_paneer',
    quantity: 250, unit: 'grams', category: 'protein',
    decay_timer: d(3), rarity: 'rare',
  },
  {
    id: 'inv_003', user_id: 'player_01',
    item_name: 'Canned Chickpeas', ingredient_id: 'protein_chickpeas_canned',
    quantity: 2, unit: 'cans', category: 'protein',
    decay_timer: d(120), rarity: 'common',
  },
  {
    id: 'inv_004', user_id: 'player_01',
    item_name: 'Red Onion', ingredient_id: 'veg_onion_red',
    quantity: 4, unit: 'medium', category: 'vegetable',
    decay_timer: d(10), rarity: 'common',
  },
  {
    id: 'inv_005', user_id: 'player_01',
    item_name: 'Fresh Tomatoes', ingredient_id: 'veg_tomato_fresh',
    quantity: 6, unit: 'medium', category: 'vegetable',
    decay_timer: d(2), rarity: 'common',
  },
  {
    id: 'inv_006', user_id: 'player_01',
    item_name: 'Fresh Spinach', ingredient_id: 'veg_spinach_fresh',
    quantity: 200, unit: 'grams', category: 'vegetable',
    decay_timer: d(1), rarity: 'uncommon',
  },
  {
    id: 'inv_007', user_id: 'player_01',
    item_name: 'Broccoli', ingredient_id: 'veg_broccoli_head',
    quantity: 1, unit: 'head', category: 'vegetable',
    decay_timer: d(4), rarity: 'common',
  },
  {
    id: 'inv_008', user_id: 'player_01',
    item_name: 'Basmati Rice', ingredient_id: 'carb_rice_basmati',
    quantity: 1000, unit: 'grams', category: 'carb',
    decay_timer: d(180), rarity: 'common',
  },
  {
    id: 'inv_009', user_id: 'player_01',
    item_name: 'Rolled Oats', ingredient_id: 'carb_oats_rolled',
    quantity: 500, unit: 'grams', category: 'carb',
    decay_timer: d(90), rarity: 'common',
  },
  {
    id: 'inv_010', user_id: 'player_01',
    item_name: 'Garam Masala', ingredient_id: 'spice_garam_masala',
    quantity: 50, unit: 'grams', category: 'spice',
    decay_timer: d(365), rarity: 'common',
  },
  {
    id: 'inv_011', user_id: 'player_01',
    item_name: 'Turmeric Powder', ingredient_id: 'spice_turmeric_powder',
    quantity: 50, unit: 'grams', category: 'spice',
    decay_timer: d(365), rarity: 'common',
  },
  {
    id: 'inv_012', user_id: 'player_01',
    item_name: 'Vegetable Oil', ingredient_id: 'base_oil_vegetable',
    quantity: 500, unit: 'ml', category: 'base',
    decay_timer: d(60), rarity: 'common',
  },
  {
    id: 'inv_013', user_id: 'player_01',
    item_name: 'Coconut Milk', ingredient_id: 'base_coconut_milk_canned',
    quantity: 1, unit: 'can', category: 'base',
    decay_timer: d(200), rarity: 'uncommon',
  },
  {
    id: 'inv_014', user_id: 'player_01',
    item_name: 'Firm Tofu', ingredient_id: 'protein_tofu',
    quantity: 400, unit: 'grams', category: 'protein',
    decay_timer: d(5), rarity: 'uncommon',
  },
];

export const MOCK_PLAYER: Player = {
  id: 'player_01',
  username: 'ChefMage',
  body_stats: { age: 25, gender: 'male', height_cm: 175, weight_kg: 70, unit_preference: 'metric' },
  activity_level: 'moderately_active',
  fitness_target: 'maintain',
  meal_preset: 'balanced',
  dietary_restrictions: ['vegetarian'],
  allergies: [],
  intolerances: [],
  custom_exclusions: [],
  religious_diet: null,
  health_conditions: [],
  meal_structure: {
    preset: '3_meals_1_snack',
    meals: [
      { slot: 'breakfast', tag: 'breakfast', calorie_pct: 20 },
      { slot: 'lunch',     tag: 'lunch',     calorie_pct: 30 },
      { slot: 'dinner',    tag: 'dinner',    calorie_pct: 35 },
      { slot: 'snack_pm',  tag: 'snack',     calorie_pct: 15 },
    ],
    fasting_window: null,
  },
  stat_goals: {
    hp_calories: 2000,
    str_protein: 120,
    macro_preset: 'balanced',
    macros: { carbs_pct: 50, protein_pct: 25, fat_pct: 25 },
  },
  cuisine_preferences: ['indian_north', 'mediterranean'],
  cooking: {
    skill_level: 'intermediate',
    max_daily_prep_min: 60,
    equipment: ['stovetop', 'blender', 'toaster'],
    preferred_methods: ['stir-fry', 'one-pot'],
  },
  servings: 2,
  level: 5,
  current_streak: 3,
  theme: 'snes',
};
