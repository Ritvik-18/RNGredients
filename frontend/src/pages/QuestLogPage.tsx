import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuestStore } from '../stores/questStore';
import { usePlayerStore } from '../stores/playerStore';
import { RecipeCard } from '../components/ui/RecipeCard';
import { StatChip } from '../components/ui/StatChip';
import { PixelButton } from '../components/ui/PixelButton';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function QuestLogPage() {
  const questLog = useQuestStore((s) => s.logsByDate[todayStr()] ?? null);
  const { player } = usePlayerStore();
  const navigate = useNavigate();

  if (!questLog) {
    return (
      <div className="pb-20 min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--bg-primary)' }}>
        <div className="text-4xl mb-4 float">📜</div>
        <div className="font-pixel text-center mb-2" style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
          NO ACTIVE QUEST
        </div>
        <div className="font-vt323 text-center text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Visit the Tavern to roll your meals
        </div>
        <PixelButton onClick={() => navigate('/tavern')} variant="primary" glow>
          ⚗ GO TO TAVERN
        </PixelButton>
      </div>
    );
  }

  const { quests, crafting_queue, total_buffs, missing_materials, rerolls_remaining } = questLog;
  const goalCals = player.stat_goals.hp_calories;
  const goalProtein = player.stat_goals.str_protein;
  const calPct = Math.min(100, (total_buffs.calories / goalCals) * 100);
  const proteinPct = Math.min(100, (total_buffs.protein / goalProtein) * 100);

  return (
    <div className="pb-20 min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-pixel text-[var(--text-primary)]" style={{ fontSize: '12px' }}>📜 QUEST LOG</div>
            <div className="font-vt323 text-[var(--text-secondary)]">{questLog.date} · {quests.length} meals</div>
          </div>
          <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--accent-3)' }}>
            🔄 {rerolls_remaining} rerolls
          </div>
        </div>

        {/* Stat totals */}
        <div className="flex gap-2 mb-4">
          <StatChip label="HP" value={total_buffs.calories} color="var(--success)" />
          <StatChip label="STR" value={total_buffs.protein} unit="g" color="var(--accent-1)" />
          <StatChip label="STA" value={total_buffs.carbs} unit="g" color="var(--warning)" />
          <StatChip label="DEF" value={total_buffs.fat} unit="g" color="var(--accent-2)" />
        </div>

        {/* Progress bars toward goals */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between font-pixel mb-1" style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
              <span>CALORIES vs GOAL</span>
              <span>{Math.round(total_buffs.calories)} / {goalCals} kcal</span>
            </div>
            <div className="w-full rounded-sm overflow-hidden" style={{ height: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <motion.div
                className="h-full"
                style={{ background: 'var(--success)' }}
                initial={{ width: 0 }}
                animate={{ width: `${calPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between font-pixel mb-1" style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
              <span>PROTEIN vs GOAL</span>
              <span>{Math.round(total_buffs.protein)}g / {goalProtein}g</span>
            </div>
            <div className="w-full rounded-sm overflow-hidden" style={{ height: 8, background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <motion.div
                className="h-full"
                style={{ background: 'var(--accent-1)' }}
                initial={{ width: 0 }}
                animate={{ width: `${proteinPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Meal cards */}
        <div className="space-y-4">
          {quests.map((q, i) => (
            <motion.div
              key={q.slot}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <RecipeCard
                recipe={q.recipe}
                slot={q.slot}
                calorieTarget={q.calorie_target}
                missing={missing_materials}
              />
            </motion.div>
          ))}
        </div>

        {/* Missing materials */}
        {missing_materials.length > 0 && (
          <div className="pixel-border rounded-sm p-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--warning)' }}>
            <div className="font-pixel mb-3" style={{ fontSize: '9px', color: 'var(--warning)' }}>
              🛒 SHOP RUN REQUIRED
            </div>
            <div className="flex flex-wrap gap-2">
              {missing_materials.map(mat => (
                <span
                  key={mat}
                  className="font-vt323 px-2 py-0.5 rounded-sm"
                  style={{
                    fontSize: '16px',
                    background: 'color-mix(in srgb, var(--warning) 15%, transparent)',
                    border: '1px solid var(--warning)',
                    color: 'var(--warning)',
                  }}
                >
                  + {mat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Crafting Queue (CPM) */}
        {crafting_queue.length > 0 && (
          <div>
            <div className="font-pixel mb-3" style={{ fontSize: '10px', color: 'var(--accent-3)' }}>
              ⚙ CRAFTING SCHEDULE
            </div>
            <div className="space-y-2">
              {crafting_queue.map((task, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 pixel-border rounded-sm p-3"
                  style={{ background: 'var(--bg-secondary)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <div
                    className="font-pixel text-center flex-shrink-0 px-2 py-1 rounded-sm"
                    style={{
                      fontSize: '7px',
                      minWidth: 40,
                      background: 'var(--bg-tertiary)',
                      color: task.passive ? 'var(--warning)' : 'var(--accent-3)',
                    }}
                  >
                    +{task.time_offset_min}m
                  </div>
                  <div className="flex-1">
                    <div className="font-vt323" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                      {task.passive ? '⏳ ' : '🔥 '}{task.task}
                    </div>
                    <div className="font-pixel" style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
                      for: {task.used_in.join(', ')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Reroll CTA */}
        <PixelButton
          onClick={() => navigate('/tavern')}
          variant="secondary"
          className="w-full mb-4"
        >
          ← BACK TO TAVERN
        </PixelButton>
      </div>
    </div>
  );
}
