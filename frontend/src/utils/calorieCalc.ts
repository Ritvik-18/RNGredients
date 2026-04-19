import type { ActivityLevel, FitnessTarget, MealPreset, Gender } from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const FITNESS_ADJUSTMENTS: Record<FitnessTarget, number> = {
  lose_weight_fast: -750,
  lose_weight: -500,
  lose_weight_slow: -250,
  maintain: 0,
  lean_bulk: 250,
  bulk: 500,
  aggressive_bulk: 750,
};

export const MEAL_PRESETS: Record<MealPreset, { label: string; desc: string; carbs_pct: number; protein_pct: number; fat_pct: number; dietary?: string }> = {
  balanced:        { label: 'Balanced',        desc: 'Standard healthy eating',      carbs_pct: 50, protein_pct: 25, fat_pct: 25 },
  high_protein:    { label: 'High Protein',     desc: 'Muscle building, fitness',     carbs_pct: 30, protein_pct: 40, fat_pct: 30 },
  vegan:           { label: 'Vegan',            desc: 'Plant-based nutrition',        carbs_pct: 55, protein_pct: 20, fat_pct: 25 },
  keto:            { label: 'Keto',             desc: 'Very low carb, high fat',      carbs_pct: 5,  protein_pct: 25, fat_pct: 70 },
  diabetic:        { label: 'Diabetic-Friendly',desc: 'Low GI, controlled carbs',    carbs_pct: 40, protein_pct: 30, fat_pct: 30 },
  low_fat:         { label: 'Low Fat',          desc: 'Heart-healthy focused',        carbs_pct: 60, protein_pct: 25, fat_pct: 15 },
  mediterranean:   { label: 'Mediterranean',    desc: 'Healthy fats, lean protein',   carbs_pct: 45, protein_pct: 20, fat_pct: 35 },
  custom:          { label: 'Custom',           desc: 'Set your own macro targets',   carbs_pct: 50, protein_pct: 25, fat_pct: 25 },
};

export const FITNESS_TARGET_LABELS: Record<FitnessTarget, { label: string; icon: string; adj: number }> = {
  lose_weight_fast:  { label: 'Aggressive Cut',   icon: '🏃', adj: -750 },
  lose_weight:       { label: 'Lose Weight',       icon: '🏃', adj: -500 },
  lose_weight_slow:  { label: 'Slow Cut',          icon: '🧘', adj: -250 },
  maintain:          { label: 'Maintain',          icon: '⚖️', adj: 0 },
  lean_bulk:         { label: 'Lean Bulk',         icon: '💪', adj: 250 },
  bulk:              { label: 'Bulk',              icon: '💪', adj: 500 },
  aggressive_bulk:   { label: 'Aggressive Bulk',   icon: '💪', adj: 750 },
};

export const ACTIVITY_LABELS: Record<ActivityLevel, { label: string; desc: string }> = {
  sedentary:          { label: 'Sedentary',          desc: 'Desk job, little exercise' },
  lightly_active:     { label: 'Lightly Active',     desc: 'Light exercise 1–3 days/week' },
  moderately_active:  { label: 'Moderately Active',  desc: 'Moderate exercise 3–5 days/week' },
  very_active:        { label: 'Very Active',         desc: 'Hard exercise 6–7 days/week' },
  extra_active:       { label: 'Extra Active',        desc: 'Very hard exercise + physical job' },
};

export function calcBmr(gender: Gender, weight_kg: number, height_cm: number, age: number): number {
  if (gender === 'male')   return Math.round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5);
  if (gender === 'female') return Math.round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161);
  const m = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  const f = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  return Math.round((m + f) / 2);
}

export function calcTdee(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

export function calcDailyCalories(tdee: number, target: FitnessTarget, gender: Gender): number {
  const floor = gender === 'female' ? 1200 : 1500;
  return Math.max(floor, Math.round(tdee + FITNESS_ADJUSTMENTS[target]));
}

export function calcMacros(calories: number, preset: MealPreset) {
  const p = MEAL_PRESETS[preset];
  return {
    protein_g: Math.round((calories * p.protein_pct / 100) / 4),
    carbs_g:   Math.round((calories * p.carbs_pct   / 100) / 4),
    fat_g:     Math.round((calories * p.fat_pct     / 100) / 9),
  };
}

export function lbsToKg(lbs: number)     { return Math.round(lbs * 0.4536 * 10) / 10; }
export function kgToLbs(kg: number)       { return Math.round(kg / 0.4536 * 10) / 10; }
export function cmToFtIn(cm: number)      { const totalIn = cm / 2.54; return { ft: Math.floor(totalIn / 12), inches: Math.round(totalIn % 12) }; }
export function ftInToCm(ft: number, inches: number) { return Math.round((ft * 30.48) + (inches * 2.54)); }
