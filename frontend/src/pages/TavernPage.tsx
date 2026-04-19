import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/playerStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { useQuestStore } from '../stores/questStore';
import { rollMeals } from '../utils/lootTable';
import { RECIPES } from '../data/recipes';
import { PixelButton } from '../components/ui/PixelButton';
import { RarityChip } from '../components/ui/RarityChip';
import { Sound } from '../utils/sound';
import type { QuestSlot, QuestLog } from '../types';

const SPIN_MS = 1500;       // spin before reel 0 settles
const REEL_STAGGER_MS = 650; // delay between each reel settling
const TICK_INTERVAL_MS = 80; // sound tick rate during spin

const REEL_SYMBOLS = ['🍛', '🥘', '🌶️', '🍳', '🫒', '🌮', '✨', '🎲', '⚔️', '🌟'];
const STRIP = Array.from({ length: 40 }, (_, i) => REEL_SYMBOLS[i % REEL_SYMBOLS.length]);

const cuisineEmoji: Record<string, string> = {
  indian_north: '🍛', indian_south: '🥘', thai: '🌶️',
  continental: '🍳', mediterranean: '🫒', mexican: '🌮', fusion: '✨',
};

function getSymbol(slot: QuestSlot | undefined) {
  if (!slot || !slot.recipe) return '🎲';
  return cuisineEmoji[slot.recipe.cuisine_type] ?? '🍽️';
}

// Reel: spinning = CSS-based infinite scroll; settled = spring snap to result
function Reel({ spinning, symbol, reelKey }: {
  spinning: boolean;
  symbol: string;
  reelKey: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-sm"
      style={{
        width: 70, height: 80,
        background: 'var(--bg-tertiary)',
        border: '2px solid var(--border)',
        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)',
      }}
    >
      {/* top/bottom fade */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--bg-tertiary) 0%, transparent 28%, transparent 72%, var(--bg-tertiary) 100%)' }}
      />
      {/* center window */}
      <div
        className="absolute inset-x-0 z-10 pointer-events-none"
        style={{
          top: '50%', transform: 'translateY(-50%)', height: 34,
          border: '1px solid var(--accent-1)',
          boxShadow: '0 0 8px var(--accent-1)',
        }}
      />

      <AnimatePresence mode="wait">
        {spinning ? (
          <motion.div
            key={`spin-${reelKey}`}
            className="flex flex-col items-center"
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            animate={{ y: [0, -40 * 20] }}
            transition={{ duration: 0.8, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
          >
            {STRIP.map((s, i) => (
              <div key={i} className="h-10 flex items-center justify-center text-2xl w-full select-none">
                {s}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`settled-${reelKey}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
            initial={{ y: -30, opacity: 0, scale: 1.2 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          >
            <span className="text-2xl leading-none">{symbol}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const rarityColors: Record<string, string> = {
  legendary: '#FFD700', rare: '#9B59B6', uncommon: '#00ADB5', common: '#A8A8B8',
};

function RarityFlash({ rarity }: { rarity: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={{ background: `radial-gradient(circle, ${rarityColors[rarity] ?? '#fff'}44 0%, transparent 65%)` }}
    >
      {rarity === 'legendary' && (
        <motion.div
          className="font-pixel text-center"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{ fontSize: '24px', color: rarityColors.legendary, textShadow: `0 0 40px ${rarityColors.legendary}` }}
        >
          ★ LEGENDARY ★
        </motion.div>
      )}
    </motion.div>
  );
}

type Phase = 'idle' | 'spinning' | 'done';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function TavernPage() {
  const { player } = usePlayerStore();
  const { items } = useInventoryStore();
  const storedLog = useQuestStore((s) => s.logsByDate[todayStr()] ?? null);
  const { setQuestLog, setIsRolling, useReroll } = useQuestStore();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('idle');
  const [slots, setSlots] = useState<QuestSlot[]>([]);
  const [settledMask, setSettledMask] = useState<boolean[]>([]);
  const [flashRarity, setFlashRarity] = useState<string | null>(null);
  const [rollKey, setRollKey] = useState(0); // forces Reel remount on new roll
  const [rollResult, setRollResult] = useState<QuestLog | null>(null);

  // Use local result if available, fall back to store
  const questLog = rollResult ?? storedLog;

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const REEL_COUNT = player.meal_structure.meals.length;
  const rerolls = questLog?.rerolls_remaining ?? 3;
  const canRoll = phase === 'idle' || phase === 'done';

  function clearAll() {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  const handleRoll = useCallback((isReroll = false) => {
    if (!canRoll) return;
    clearAll();

    if (isReroll) useReroll();

    const newKey = rollKey + 1;
    setRollKey(newKey);
    setPhase('spinning');
    setIsRolling(true);
    setSlots([]);
    setSettledMask(Array(REEL_COUNT).fill(false));
    setFlashRarity(null);

    Sound.tap();

    const result = rollMeals(RECIPES, player, items);
    const quests = result.quests;

    // Tick during spin
    tickRef.current = setInterval(() => Sound.scroll(), TICK_INTERVAL_MS);

    // Settle each reel sequentially
    quests.forEach((quest, i) => {
      const t = setTimeout(() => {
        // Stop tick when first reel settles
        if (i === 0) {
          if (tickRef.current) clearInterval(tickRef.current);
          tickRef.current = null;
        }

        setSlots(prev => {
          const next = [...prev];
          next[i] = quest;
          return next;
        });
        setSettledMask(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });

        Sound.transition();
        setFlashRarity(quest.recipe?.rarity ?? null);
        setTimeout(() => setFlashRarity(null), 1200);

        // All settled → done
        if (i === quests.length - 1) {
          const doneT = setTimeout(() => {
            setRollResult(result);
            setPhase('done');
            setIsRolling(false);
            setQuestLog(result);
            Sound.tap();
          }, 700);
          timeoutsRef.current.push(doneT);
        }
      }, SPIN_MS + i * REEL_STAGGER_MS);

      timeoutsRef.current.push(t);
    });
  }, [canRoll, rollKey, REEL_COUNT, player, items, useReroll, setIsRolling, setQuestLog]);

  return (
    <div className="pb-20 min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <AnimatePresence>
        {flashRarity && <RarityFlash key={flashRarity + Date.now()} rarity={flashRarity} />}
      </AnimatePresence>

      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <div className="font-pixel text-[var(--accent-1)] mb-1" style={{ fontSize: '14px' }}>
          ⚗ MEAL TAVERN
        </div>
        <div className="font-vt323 text-[var(--text-secondary)] text-lg">
          Roll for today's quest meals
        </div>
      </div>

      {/* Slot Machine */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div
          className="pixel-border rounded-sm p-6 w-full max-w-sm scanlines relative"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* Machine top label */}
          <div className="text-center mb-4">
            <div className="font-pixel" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
              INSERT COIN TO ROLL
            </div>
            <div className="font-pixel blink mt-1" style={{ fontSize: '7px', color: 'var(--accent-3)' }}>
              {phase === 'spinning' ? '⚡ ROLLING...' : '▼▼▼'}
            </div>
          </div>

          {/* Reels */}
          <div className="flex gap-3 justify-center mb-6 flex-wrap">
            {Array.from({ length: REEL_COUNT }, (_, i) => (
              <Reel
                key={`reel-${i}`}
                spinning={!settledMask[i]}
                symbol={getSymbol(slots[i])}
                reelKey={`${rollKey}-${i}`}
              />
            ))}
          </div>

          {/* Roll button */}
          <PixelButton
            onClick={() => handleRoll(false)}
            disabled={!canRoll}
            variant="primary"
            glow={canRoll}
            size="lg"
            className="w-full mb-3"
          >
            {phase === 'idle'
              ? '🎲 ROLL MEALS'
              : phase === 'done'
              ? '🎲 ROLL AGAIN'
              : '⚡ ROLLING...'}
          </PixelButton>

          {/* Reroll button */}
          {phase === 'done' && questLog && (
            <PixelButton
              onClick={() => handleRoll(true)}
              disabled={rerolls <= 0}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              🔄 REROLL ({rerolls} left)
            </PixelButton>
          )}
        </div>

        {/* Results */}
        <AnimatePresence>
          {phase === 'done' && questLog && (
            <motion.div
              className="w-full max-w-sm mt-4 space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {questLog.quests.map((q, i) => (
                <motion.div
                  key={q.slot}
                  className="pixel-border rounded-sm p-3 flex items-center gap-3"
                  style={{ background: 'var(--bg-secondary)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 80, damping: 15 }}
                >
                  <span className="text-2xl">{q.recipe ? cuisineEmoji[q.recipe.cuisine_type] ?? '🍽️' : '🍽️'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel truncate" style={{ fontSize: '8px', color: 'var(--text-primary)' }}>
                      {q.recipe?.title ?? 'No Recipe Found'}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {q.recipe && <RarityChip rarity={q.recipe.rarity} />}
                      <span className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {q.slot}
                      </span>
                    </div>
                  </div>
                  {q.recipe && (
                    <div className="font-vt323 text-lg" style={{ color: 'var(--success)' }}>
                      +{q.recipe.stat_buffs.calories}HP
                    </div>
                  )}
                </motion.div>
              ))}

              {questLog.missing_materials.length > 0 && (
                <div
                  className="pixel-border rounded-sm p-3"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--warning)' }}
                >
                  <div className="font-pixel mb-1" style={{ fontSize: '7px', color: 'var(--warning)' }}>
                    ⚠ MISSING MATERIALS — SHOP RUN NEEDED
                  </div>
                  <div className="font-vt323" style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                    {questLog.missing_materials.join(' • ')}
                  </div>
                </div>
              )}

              <PixelButton
                onClick={() => navigate('/quests')}
                variant="success"
                size="md"
                className="w-full"
              >
                📜 VIEW QUEST LOG →
              </PixelButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
