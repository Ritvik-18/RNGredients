import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuestLog, QuestSlot, Player, Recipe } from '../types';
import { buildEmptyQuestLog, rollSingleMeal, rebuildCraftingFromQuests } from '../utils/lootTable';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

interface QuestStore {
  // date → log (today + history)
  logsByDate: Record<string, QuestLog>;

  // UI state (ephemeral)
  isRolling: boolean;
  activeMealSlot: string | null;
  showMealPopup: boolean;
  autoRollSlot: string | null; // set by meal popup → consumed by tavern

  // dismissal
  dismissedSlotsToday: string[];
  lastDismissedDate: string | null;

  // selectors / actions
  ensureTodayLog: (player: Player) => void;
  getTodayLog: () => QuestLog | null;
  setQuestLog: (log: QuestLog) => void;

  rollSlot: (slotKey: string, player: Player, recipes: Recipe[], inventory: import('../types').InventoryItem[]) => QuestSlot | null;
  markSlotDone: (slotKey: string) => void;
  useReroll: () => void;

  setIsRolling: (v: boolean) => void;
  setActiveMealSlot: (s: string | null) => void;
  setShowMealPopup: (v: boolean) => void;
  setAutoRollSlot: (s: string | null) => void;

  dismissMealSlot: (slot: string) => void;
  clearHistory: () => void;
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      logsByDate: {},
      isRolling: false,
      activeMealSlot: null,
      showMealPopup: false,
      autoRollSlot: null,
      dismissedSlotsToday: [],
      lastDismissedDate: null,

      ensureTodayLog: (player) => set((s) => {
        const today = todayStr();
        if (s.logsByDate[today]) return s;
        return { logsByDate: { ...s.logsByDate, [today]: buildEmptyQuestLog(player, today) } };
      }),

      getTodayLog: () => {
        const s = get();
        return s.logsByDate[todayStr()] ?? null;
      },

      setQuestLog: (log) => set((s) => ({
        logsByDate: { ...s.logsByDate, [log.date]: log },
      })),

      rollSlot: (slotKey, player, recipes, inventory) => {
        const today = todayStr();
        const log = get().logsByDate[today];
        if (!log) return null;

        const slot = player.meal_structure.meals.find(m => m.slot === slotKey);
        if (!slot) return null;

        const excludeIds = log.quests
          .filter(q => q.slot !== slotKey && q.recipe?.id)
          .map(q => q.recipe.id);

        const rolled = rollSingleMeal(recipes, player, inventory, slot, excludeIds);
        if (!rolled) return null;

        const newQuests = log.quests.map(q =>
          q.slot === slotKey ? rolled : q,
        );

        const total_buffs = newQuests
          .filter(q => q.status !== 'pending' && q.recipe)
          .reduce((acc, q) => ({
            calories: acc.calories + q.recipe.stat_buffs.calories,
            protein:  acc.protein  + q.recipe.stat_buffs.protein,
            carbs:    acc.carbs    + q.recipe.stat_buffs.carbs,
            fat:      acc.fat      + q.recipe.stat_buffs.fat,
          }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        const rolledQuests = newQuests.filter(q => q.status !== 'pending' && q.recipe);
        const allReq = new Set(rolledQuests.flatMap(q => q.recipe.required_materials.map(m => m.id)));
        const invIds = new Set(inventory.map(i => i.ingredient_id).filter(Boolean) as string[]);
        const missing_materials = [...allReq]
          .filter(id => !invIds.has(id))
          .map(id => {
            const mat = rolledQuests.flatMap(q => q.recipe.required_materials).find(m => m.id === id);
            return mat?.common_name ?? id;
          });

        const updatedLog: QuestLog = {
          ...log,
          quests: newQuests,
          total_buffs,
          missing_materials: [...new Set(missing_materials)],
          crafting_queue: rebuildCraftingFromQuests(rolledQuests),
        };

        set({ logsByDate: { ...get().logsByDate, [today]: updatedLog } });
        return rolled;
      },

      markSlotDone: (slotKey) => set((s) => {
        const today = todayStr();
        const log = s.logsByDate[today];
        if (!log) return s;
        return {
          logsByDate: {
            ...s.logsByDate,
            [today]: {
              ...log,
              quests: log.quests.map(q => q.slot === slotKey ? { ...q, status: 'done' as const } : q),
            },
          },
        };
      }),

      useReroll: () => set((s) => {
        const today = todayStr();
        const log = s.logsByDate[today];
        if (!log || log.rerolls_remaining <= 0) return s;
        return {
          logsByDate: {
            ...s.logsByDate,
            [today]: { ...log, rerolls_remaining: log.rerolls_remaining - 1 },
          },
        };
      }),

      setIsRolling: (v) => set({ isRolling: v }),
      setActiveMealSlot: (slot) => set({ activeMealSlot: slot }),
      setShowMealPopup: (v) => set({ showMealPopup: v }),
      setAutoRollSlot: (s) => set({ autoRollSlot: s }),

      dismissMealSlot: (slot) => set((s) => {
        const today = todayStr();
        const dismissed = s.lastDismissedDate !== today ? [] : s.dismissedSlotsToday;
        return {
          showMealPopup: false,
          activeMealSlot: null,
          dismissedSlotsToday: dismissed.includes(slot) ? dismissed : [...dismissed, slot],
          lastDismissedDate: today,
        };
      }),

      clearHistory: () => set({ logsByDate: {} }),
    }),
    {
      name: 'rngredients-quest',
      partialize: (s) => ({
        logsByDate: s.logsByDate,
        dismissedSlotsToday: s.dismissedSlotsToday,
        lastDismissedDate: s.lastDismissedDate,
      }),
    },
  ),
);
