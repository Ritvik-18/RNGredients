import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, ThemeId } from '../types';
import { applyTheme } from '../data/themes';

const DEFAULT_PLAYER: Player = {
  id: 'player_01',
  username: 'ChefMage',
  body_stats: { age: 25, gender: 'male', height_cm: 175, weight_kg: 70, unit_preference: 'metric' },
  activity_level: 'moderately_active',
  fitness_target: 'maintain',
  meal_preset: 'balanced',
  dietary_restrictions: [],
  allergies: [],
  intolerances: [],
  custom_exclusions: [],
  religious_diet: null,
  health_conditions: [],
  meal_structure: {
    preset: '3_meals_1_snack',
    meals: [
      { slot: 'breakfast', tag: 'breakfast', calorie_pct: 20, time: '08:00' },
      { slot: 'lunch',     tag: 'lunch',     calorie_pct: 30, time: '13:00' },
      { slot: 'dinner',    tag: 'dinner',    calorie_pct: 35, time: '19:00' },
      { slot: 'snack_pm',  tag: 'snack',     calorie_pct: 15, time: '16:00' },
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
    equipment: ['stovetop', 'microwave'],
    preferred_methods: ['stir-fry', 'one-pot'],
  },
  servings: 2,
  level: 1,
  current_streak: 0,
  theme: 'snes',
};

interface PlayerStore {
  player: Player;
  hasOnboarded: boolean;
  setPlayer: (p: Player) => void;
  updatePlayer: (patch: Partial<Player>) => void;
  setUsername: (name: string) => void;
  setTheme: (theme: ThemeId) => void;
  setHasOnboarded: (v: boolean) => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      player: DEFAULT_PLAYER,
      hasOnboarded: false,
      setPlayer: (p) => { applyTheme(p.theme); set({ player: p }); },
      setUsername: (name) => set((s) => ({ player: { ...s.player, username: name } })),
      updatePlayer: (patch) => set((s) => {
        const updated = { ...s.player, ...patch };
        if (patch.theme) applyTheme(patch.theme);
        return { player: updated };
      }),
      setTheme: (theme) => { applyTheme(theme); set((s) => ({ player: { ...s.player, theme } })); },
      setHasOnboarded: (v) => set({ hasOnboarded: v }),
      resetPlayer: () => set({ player: DEFAULT_PLAYER, hasOnboarded: false }),
    }),
    { name: 'rngredients-player' },
  ),
);
