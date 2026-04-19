import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuestStore } from '../../stores/questStore';
import { formatTime } from '../../utils/mealTimer';
import { PixelButton } from './PixelButton';
import type { MealSlot } from '../../types';

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

const MEAL_FLAVOUR: Record<string, string> = {
  breakfast: 'Start your day strong. Roll for your first quest!',
  lunch: 'Midday refuel incoming. What shall the dice decide?',
  dinner: 'Day\'s end feast. Roll your final quest!',
  snack: 'Snack o\'clock. A quick roll for a light dish!',
};

interface MealTimePopupProps {
  slot: MealSlot;
}

export function MealTimePopup({ slot }: MealTimePopupProps) {
  const navigate = useNavigate();
  const { dismissMealSlot, setActiveMealSlot } = useQuestStore();

  function handleRoll() {
    dismissMealSlot(slot.slot);
    setActiveMealSlot(slot.slot);
    navigate('/tavern');
  }

  function handleDismiss() {
    dismissMealSlot(slot.slot);
  }

  const icon = MEAL_ICONS[slot.tag] ?? '🍽️';
  const flavour = MEAL_FLAVOUR[slot.tag] ?? 'Time to roll!';
  const displayName = slot.label ?? slot.slot.replace(/_/g, ' ').toUpperCase();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center pb-6 px-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleDismiss}
    >
      <motion.div
        className="w-full max-w-sm pixel-border"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--accent-1)',
          borderWidth: 2,
          boxShadow: '0 0 32px color-mix(in srgb, var(--accent-1) 40%, transparent)',
        }}
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent strip */}
        <div className="h-1 w-full" style={{ background: 'var(--accent-1)' }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              {icon}
            </motion.div>
            <div>
              <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--accent-3)' }}>
                ⏰ MEAL TIME
              </div>
              <div className="font-pixel" style={{ fontSize: '13px', color: 'var(--accent-1)' }}>
                {displayName}
              </div>
              {slot.time && (
                <div className="font-vt323 text-base" style={{ color: 'var(--text-secondary)' }}>
                  {formatTime(slot.time)}
                </div>
              )}
            </div>
          </div>

          <p className="font-vt323 text-lg mb-5" style={{ color: 'var(--text-secondary)' }}>
            {flavour}
          </p>

          {/* Blinking indicator */}
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-sm"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--accent-1)' }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <span className="font-pixel" style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
              ROLL USES YOUR CURRENT INVENTORY + EQUIPMENT
            </span>
          </div>

          <div className="space-y-2">
            <PixelButton
              onClick={handleRoll}
              variant="primary"
              glow
              className="w-full"
              size="lg"
            >
              🎲 ROLL FOR {displayName}
            </PixelButton>
            <PixelButton
              onClick={handleDismiss}
              variant="secondary"
              className="w-full"
              size="sm"
            >
              ✗ REMIND LATER
            </PixelButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
