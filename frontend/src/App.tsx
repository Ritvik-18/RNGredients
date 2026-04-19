import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { usePlayerStore } from './stores/playerStore';
import { useQuestStore } from './stores/questStore';
import { NavBar } from './components/layout/NavBar';
import { OnboardingPage } from './pages/OnboardingPage';
import { InventoryPage } from './pages/InventoryPage';
import { TavernPage } from './pages/TavernPage';
import { QuestLogPage } from './pages/QuestLogPage';
import { MealTimePopup } from './components/ui/MealTimePopup';
import { applyTheme } from './data/themes';
import { isDueMealSlot } from './utils/mealTimer';
import type { MealSlot } from './types';

// Checks every 60s if any meal slot is due and not yet dismissed today
function useMealTimer() {
  const { player } = usePlayerStore();
  const { showMealPopup, dismissedSlotsToday, lastDismissedDate, setShowMealPopup, setActiveMealSlot } = useQuestStore();
  const [dueMealSlot, setDueMealSlot] = useState<MealSlot | null>(null);

  useEffect(() => {
    function check() {
      const today = new Date().toISOString().split('T')[0];
      const dismissedToday = lastDismissedDate === today ? dismissedSlotsToday : [];
      const slots = player.meal_structure.meals;

      for (const slot of slots) {
        if (dismissedToday.includes(slot.slot)) continue;
        if (isDueMealSlot(slot, 60)) {
          setDueMealSlot(slot);
          setActiveMealSlot(slot.slot);
          setShowMealPopup(true);
          return;
        }
      }
      // Nothing due — clear popup if it was showing
      if (showMealPopup) {
        setDueMealSlot(null);
        setShowMealPopup(false);
      }
    }

    check(); // immediate on mount
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [player.meal_structure.meals, dismissedSlotsToday, lastDismissedDate]); // eslint-disable-line

  return { dueMealSlot, showMealPopup };
}

function AppRoutes() {
  const { hasOnboarded } = usePlayerStore();
  const { dueMealSlot, showMealPopup } = useMealTimer();

  if (!hasOnboarded) {
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/tavern" replace />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/tavern" element={<TavernPage />} />
        <Route path="/quests" element={<QuestLogPage />} />
        <Route path="*" element={<Navigate to="/tavern" replace />} />
      </Routes>
      <NavBar />
      <AnimatePresence>
        {showMealPopup && dueMealSlot && (
          <MealTimePopup key={dueMealSlot.slot} slot={dueMealSlot} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const { player } = usePlayerStore();

  useEffect(() => {
    applyTheme(player.theme);
  }, [player.theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
