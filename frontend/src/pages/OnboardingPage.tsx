import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/playerStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { PixelButton } from '../components/ui/PixelButton';
import { THEMES, applyTheme } from '../data/themes';
import { APPLIANCES } from '../data/applianceData';
import { PANTRY_STAPLES } from '../data/pantryStaples';
import {
  calcBmr, calcTdee, calcDailyCalories, calcMacros,
  MEAL_PRESETS, FITNESS_TARGET_LABELS, ACTIVITY_LABELS,
  lbsToKg, kgToLbs, ftInToCm, cmToFtIn,
} from '../utils/calorieCalc';
import { DEFAULT_MEAL_TIMES } from '../utils/mealTimer';
import { Sound } from '../utils/sound';
import type { Player, ActivityLevel, FitnessTarget, MealPreset, Gender, Appliance, ThemeId, MealSlot } from '../types';
import { addDays, format } from 'date-fns';

const TOTAL_STEPS = 10;

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function StepProgress({ step }: { step: number }) {
  return (
    <div className="flex gap-1 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div key={i} className="flex-1 h-2 rounded-sm overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
          <motion.div
            className="h-full"
            style={{ background: i <= step ? 'var(--accent-1)' : 'transparent' }}
            initial={{ width: 0 }}
            animate={{ width: i <= step ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Step: Welcome ──────────────────────────────────────────────────────────────
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 80, damping: 15 }}>
        <img src="/images/flame-lit.gif" alt="flame" className="w-20 h-20 mx-auto mb-4" />
      </motion.div>
      <div className="font-pixel text-[var(--accent-1)] mb-2" style={{ fontSize: '18px' }}>RNGredients</div>
      <div className="font-vt323 text-[var(--text-secondary)] text-xl mb-2">The Gacha Meal Planner</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg mb-8 max-w-sm">
        Roll the dice for your next meal. Beat your nutrition targets. Level up your kitchen game.
      </p>
      <PixelButton onClick={onNext} variant="primary" glow size="lg">⚔ START YOUR ADVENTURE</PixelButton>
    </div>
  );
}

// ─── Step: Body Stats ───────────────────────────────────────────────────────────
function BodyStatsStep({ data, onChange }: {
  data: { age: number; gender: Gender; height_cm: number; weight_kg: number; target_weight_kg?: number; unit_preference: 'metric' | 'imperial' };
  onChange: (d: Partial<typeof data>) => void;
}) {
  const imperial = data.unit_preference === 'imperial';
  const { ft, inches } = cmToFtIn(data.height_cm);
  const lbs = kgToLbs(data.weight_kg);
  const targetLbs = data.target_weight_kg ? kgToLbs(data.target_weight_kg) : undefined;

  return (
    <div className="space-y-5">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>⚔ ADVENTURE STATS</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg">Tell us about your character.</p>

      {/* Unit toggle */}
      <div className="flex gap-2">
        {(['metric', 'imperial'] as const).map(u => (
          <button key={u} onClick={() => onChange({ unit_preference: u })}
            className="font-pixel px-3 py-1.5 rounded-sm cursor-pointer transition-all"
            style={{ fontSize: '8px', background: data.unit_preference === u ? 'var(--accent-1)' : 'var(--bg-tertiary)', color: data.unit_preference === u ? '#fff' : 'var(--text-secondary)', border: `2px solid ${data.unit_preference === u ? 'var(--accent-1)' : 'var(--border)'}` }}>
            {u.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Gender */}
      <div>
        <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>GENDER</label>
        <div className="flex gap-2">
          {([['male', '♂ Male'], ['female', '♀ Female'], ['other', '⊕ Other']] as [Gender, string][]).map(([g, label]) => (
            <button key={g} onClick={() => onChange({ gender: g })}
              className="flex-1 font-pixel py-2 rounded-sm cursor-pointer transition-all"
              style={{ fontSize: '8px', background: data.gender === g ? 'var(--accent-2)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', border: `2px solid ${data.gender === g ? 'var(--accent-1)' : 'var(--border)'}` }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="font-pixel block mb-1" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>AGE</label>
        <input type="number" min={13} max={120} value={data.age}
          onChange={e => onChange({ age: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 font-vt323 text-xl outline-none"
          style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
      </div>

      {/* Height */}
      <div>
        <label className="font-pixel block mb-1" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>HEIGHT</label>
        {imperial ? (
          <div className="flex gap-2">
            <input type="number" min={0} max={9} value={ft} placeholder="ft"
              onChange={e => onChange({ height_cm: ftInToCm(parseInt(e.target.value) || 0, inches) })}
              className="w-1/2 px-3 py-2 font-vt323 text-xl outline-none"
              style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
            <input type="number" min={0} max={11} value={inches} placeholder="in"
              onChange={e => onChange({ height_cm: ftInToCm(ft, parseInt(e.target.value) || 0) })}
              className="w-1/2 px-3 py-2 font-vt323 text-xl outline-none"
              style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
        ) : (
          <input type="number" min={100} max={250} value={data.height_cm} placeholder="cm"
            onChange={e => onChange({ height_cm: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 font-vt323 text-xl outline-none"
            style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
        )}
      </div>

      {/* Weight */}
      <div>
        <label className="font-pixel block mb-1" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
          CURRENT WEIGHT ({imperial ? 'lbs' : 'kg'})
        </label>
        <input type="number" min={30} max={400} value={imperial ? lbs : data.weight_kg}
          onChange={e => onChange({ weight_kg: imperial ? lbsToKg(parseFloat(e.target.value) || 0) : parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 font-vt323 text-xl outline-none"
          style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
      </div>

      {/* Target weight */}
      <div>
        <label className="font-pixel block mb-1" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
          TARGET WEIGHT ({imperial ? 'lbs' : 'kg'}) — OPTIONAL
        </label>
        <input type="number" min={30} max={400} value={imperial ? (targetLbs ?? '') : (data.target_weight_kg ?? '')} placeholder="optional"
          onChange={e => {
            const v = parseFloat(e.target.value) || undefined;
            onChange({ target_weight_kg: v ? (imperial ? lbsToKg(v) : v) : undefined });
          }}
          className="w-full px-3 py-2 font-vt323 text-xl outline-none"
          style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
      </div>
    </div>
  );
}

// ─── Step: Activity + Fitness Target ────────────────────────────────────────────
function ActivityStep({ activityLevel, fitnessTarget, bodyStats, onChange }: {
  activityLevel: ActivityLevel;
  fitnessTarget: FitnessTarget;
  bodyStats: { age: number; gender: Gender; height_cm: number; weight_kg: number };
  onChange: (a: ActivityLevel, f: FitnessTarget) => void;
}) {
  const bmr = calcBmr(bodyStats.gender, bodyStats.weight_kg, bodyStats.height_cm, bodyStats.age);
  const tdee = calcTdee(bmr, activityLevel);
  const calories = calcDailyCalories(tdee, fitnessTarget, bodyStats.gender);

  return (
    <div className="space-y-5">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>⚡ QUEST OBJECTIVE</div>

      {/* Activity */}
      <div>
        <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>ACTIVITY LEVEL</label>
        <div className="space-y-2">
          {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, { label: string; desc: string }][]).map(([id, info]) => (
            <button key={id} onClick={() => onChange(id, fitnessTarget)}
              className="w-full text-left px-3 py-2 rounded-sm cursor-pointer transition-all"
              style={{ background: activityLevel === id ? 'var(--accent-2)' : 'var(--bg-tertiary)', border: `2px solid ${activityLevel === id ? 'var(--accent-1)' : 'var(--border)'}` }}>
              <div className="font-pixel" style={{ fontSize: '8px', color: 'var(--text-primary)' }}>{info.label}</div>
              <div className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>{info.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fitness Target */}
      <div>
        <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>FITNESS TARGET</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(FITNESS_TARGET_LABELS) as [FitnessTarget, { label: string; icon: string; adj: number }][]).map(([id, info]) => (
            <button key={id} onClick={() => onChange(activityLevel, id)}
              className="text-left px-3 py-2 rounded-sm cursor-pointer transition-all"
              style={{ background: fitnessTarget === id ? 'var(--accent-2)' : 'var(--bg-tertiary)', border: `2px solid ${fitnessTarget === id ? 'var(--accent-1)' : 'var(--border)'}` }}>
              <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{info.icon} {info.label}</div>
              <div className="font-vt323 text-sm" style={{ color: info.adj > 0 ? 'var(--success)' : info.adj < 0 ? 'var(--error)' : 'var(--text-secondary)' }}>
                {info.adj > 0 ? `+${info.adj}` : info.adj} kcal/day
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live calc preview */}
      <motion.div key={calories} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="pixel-border rounded-sm p-4 text-center"
        style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--accent-1)' }}>
        <div className="font-pixel mb-1" style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>DAILY CALORIE TARGET</div>
        <div className="font-pixel" style={{ fontSize: '22px', color: 'var(--accent-1)' }}>{calories.toLocaleString()} kcal</div>
        <div className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>BMR {bmr} → TDEE {tdee}</div>
      </motion.div>
    </div>
  );
}

// ─── Step: Meal Preset ──────────────────────────────────────────────────────────
function MealPresetStep({ preset, calories, onSelect }: {
  preset: MealPreset; calories: number; onSelect: (p: MealPreset) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>🍽 MEAL STYLE</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg">Choose your macro strategy.</p>
      <div className="grid grid-cols-2 gap-3">
        {(Object.entries(MEAL_PRESETS) as [MealPreset, typeof MEAL_PRESETS[MealPreset]][]).map(([id, p]) => {
          const m = calcMacros(calories, id);
          return (
            <button key={id} onClick={() => onSelect(id)}
              className="text-left p-3 rounded-sm cursor-pointer transition-all"
              style={{ background: preset === id ? 'var(--accent-2)' : 'var(--bg-secondary)', border: `2px solid ${preset === id ? 'var(--accent-1)' : 'var(--border)'}` }}>
              <div className="font-pixel mb-1" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{p.label}</div>
              <div className="font-vt323 text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{p.desc}</div>
              <div className="font-vt323 text-xs" style={{ color: 'var(--accent-3)', fontSize: '13px' }}>
                P:{m.protein_g}g C:{m.carbs_g}g F:{m.fat_g}g
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step: Dietary Restrictions ─────────────────────────────────────────────────
const DIET_OPTIONS = [
  { id: 'vegetarian', label: '🌿 Vegetarian', desc: 'No meat or fish' },
  { id: 'vegan', label: '🌱 Vegan', desc: 'No animal products' },
  { id: 'gluten_free', label: '🌾 Gluten-Free', desc: 'No wheat/gluten' },
];
const ALLERGEN_OPTIONS = [
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Wheat', 'Soy',
  'Fish', 'Shellfish', 'Sesame', 'Celery', 'Mustard', 'Sulfites',
];

function DietaryStep({ dietary, allergies, onChangeDiet, onChangeAllergies }: {
  dietary: string[]; allergies: string[];
  onChangeDiet: (d: string[]) => void; onChangeAllergies: (a: string[]) => void;
}) {
  const toggle = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  return (
    <div className="space-y-5">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>🛡 SET YOUR WARDS</div>
      <div>
        <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>DIETARY PROFILE</label>
        <div className="space-y-2">
          {DIET_OPTIONS.map(o => (
            <button key={o.id} onClick={() => onChangeDiet(toggle(dietary, o.id))}
              className="w-full text-left px-3 py-2 rounded-sm cursor-pointer transition-all flex items-center gap-3"
              style={{ background: dietary.includes(o.id) ? 'var(--accent-2)' : 'var(--bg-tertiary)', border: `2px solid ${dietary.includes(o.id) ? 'var(--accent-1)' : 'var(--border)'}` }}>
              <div className="font-pixel text-lg">{dietary.includes(o.id) ? '☑' : '☐'}</div>
              <div>
                <div className="font-pixel" style={{ fontSize: '8px', color: 'var(--text-primary)' }}>{o.label}</div>
                <div className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>{o.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>ALLERGENS (hard blocks)</label>
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map(a => (
            <button key={a} onClick={() => onChangeAllergies(toggle(allergies, a))}
              className="font-pixel px-2 py-1 rounded-sm cursor-pointer transition-all"
              style={{ fontSize: '7px', background: allergies.includes(a) ? 'var(--error)' : 'var(--bg-tertiary)', color: allergies.includes(a) ? '#fff' : 'var(--text-secondary)', border: `1px solid ${allergies.includes(a) ? 'var(--error)' : 'var(--border)'}` }}>
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step: Meal Structure ───────────────────────────────────────────────────────
const MEAL_PRESETS_STRUCTURE = [
  { label: '2 Meals',       slots: [{ slot: 'lunch', tag: 'lunch' as const, calorie_pct: 45, time: '13:00' }, { slot: 'dinner', tag: 'dinner' as const, calorie_pct: 55, time: '19:00' }] },
  { label: '3 Meals',       slots: [{ slot: 'breakfast', tag: 'breakfast' as const, calorie_pct: 25, time: '08:00' }, { slot: 'lunch', tag: 'lunch' as const, calorie_pct: 35, time: '13:00' }, { slot: 'dinner', tag: 'dinner' as const, calorie_pct: 40, time: '19:00' }] },
  { label: '3 + Snack',     slots: [{ slot: 'breakfast', tag: 'breakfast' as const, calorie_pct: 20, time: '08:00' }, { slot: 'lunch', tag: 'lunch' as const, calorie_pct: 30, time: '13:00' }, { slot: 'dinner', tag: 'dinner' as const, calorie_pct: 35, time: '19:00' }, { slot: 'snack_pm', tag: 'snack' as const, calorie_pct: 15, time: '16:00' }] },
  { label: '3 + 2 Snacks',  slots: [{ slot: 'breakfast', tag: 'breakfast' as const, calorie_pct: 20, time: '08:00' }, { slot: 'snack_am', tag: 'snack' as const, calorie_pct: 10, time: '10:30' }, { slot: 'lunch', tag: 'lunch' as const, calorie_pct: 25, time: '13:00' }, { slot: 'snack_pm', tag: 'snack' as const, calorie_pct: 10, time: '16:00' }, { slot: 'dinner', tag: 'dinner' as const, calorie_pct: 35, time: '19:00' }] },
  { label: '5 Meals',       slots: [{ slot: 'breakfast', tag: 'breakfast' as const, calorie_pct: 20, time: '07:00' }, { slot: 'snack_am', tag: 'snack' as const, calorie_pct: 10, time: '10:00' }, { slot: 'lunch', tag: 'lunch' as const, calorie_pct: 25, time: '13:00' }, { slot: 'snack_pm', tag: 'snack' as const, calorie_pct: 10, time: '16:00' }, { slot: 'dinner', tag: 'dinner' as const, calorie_pct: 35, time: '19:00' }] },
];

function MealStructureStep({ slots, onSelect }: {
  slots: MealSlot[]; onSelect: (s: MealSlot[]) => void;
}) {
  const currentIdx = MEAL_PRESETS_STRUCTURE.findIndex(p => p.slots.length === slots.length);
  const [selected, setSelected] = useState(currentIdx >= 0 ? currentIdx : 2);
  const [customTimes, setCustomTimes] = useState<Record<string, string>>(
    Object.fromEntries(slots.map(s => [s.slot, s.time ?? DEFAULT_MEAL_TIMES[s.tag] ?? '12:00']))
  );

  function pick(idx: number) {
    setSelected(idx);
    const s = MEAL_PRESETS_STRUCTURE[idx].slots;
    const times = Object.fromEntries(s.map(sl => [sl.slot, sl.time ?? DEFAULT_MEAL_TIMES[sl.tag] ?? '12:00']));
    setCustomTimes(times);
    onSelect(s.map(sl => ({ ...sl, time: times[sl.slot] })));
  }

  function updateTime(slot: string, time: string) {
    const next = { ...customTimes, [slot]: time };
    setCustomTimes(next);
    onSelect(MEAL_PRESETS_STRUCTURE[selected].slots.map(sl => ({ ...sl, time: next[sl.slot] ?? sl.time })));
  }

  const currentSlots = MEAL_PRESETS_STRUCTURE[selected]?.slots ?? [];

  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>📅 DAILY QUEST STRUCTURE</div>
      <div className="grid grid-cols-2 gap-2">
        {MEAL_PRESETS_STRUCTURE.map((p, i) => (
          <button key={i} onClick={() => pick(i)}
            className="text-left px-3 py-2 rounded-sm cursor-pointer transition-all"
            style={{ background: selected === i ? 'var(--accent-2)' : 'var(--bg-tertiary)', border: `2px solid ${selected === i ? 'var(--accent-1)' : 'var(--border)'}` }}>
            <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{p.label}</div>
            <div className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>{p.slots.map(s => s.slot).join(' / ')}</div>
          </button>
        ))}
      </div>

      {/* Meal time pickers */}
      <div className="space-y-2">
        <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>SET MEAL TIMES (for notifications)</div>
        {currentSlots.map(sl => (
          <div key={sl.slot} className="flex items-center gap-3 px-3 py-2 rounded-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div className="flex-1 font-pixel" style={{ fontSize: '8px', color: 'var(--text-primary)' }}>{sl.slot.replace(/_/g, ' ').toUpperCase()}</div>
            <input type="time" value={customTimes[sl.slot] ?? sl.time}
              onChange={e => updateTime(sl.slot, e.target.value)}
              className="font-vt323 text-lg px-2 py-1 outline-none"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', colorScheme: 'dark' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step: Equipment ────────────────────────────────────────────────────────────
function EquipmentStep({ equipment, onToggle }: {
  equipment: Appliance[]; onToggle: (a: Appliance) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>⚙ EQUIP YOUR KITCHEN</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg">Select what you own. Recipes will match your equipment.</p>
      <div className="grid grid-cols-2 gap-2">
        {APPLIANCES.map(a => (
          <button key={a.id} onClick={() => onToggle(a.id)}
            className="text-left p-3 rounded-sm cursor-pointer transition-all"
            style={{ background: equipment.includes(a.id) ? 'var(--accent-2)' : 'var(--bg-secondary)', border: `2px solid ${equipment.includes(a.id) ? 'var(--accent-1)' : 'var(--border)'}` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{a.icon}</span>
              <span className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{a.label}</span>
            </div>
            <div className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>{a.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step: Pantry ────────────────────────────────────────────────────────────────
function PantryStep({ checked, onToggle }: { checked: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>📦 STOCK CHECK</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg">
        We've added pantry staples. <strong>Uncheck what you DON'T have.</strong>
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PANTRY_STAPLES.map(s => (
          <button key={s.id} onClick={() => onToggle(s.id)}
            className="text-left px-3 py-2 rounded-sm cursor-pointer transition-all flex items-center gap-2"
            style={{ background: checked.includes(s.id) ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'var(--bg-secondary)', border: `2px solid ${checked.includes(s.id) ? 'var(--success)' : 'var(--border)'}` }}>
            <span className="font-pixel text-sm">{checked.includes(s.id) ? '☑' : '☐'}</span>
            <div>
              <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{s.name}</div>
              <div className="font-vt323 text-xs" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{s.qty} {s.unit}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step: Ingredients ─────────────────────────────────────────────────────────
const COMMON_INGREDIENTS = [
  { id: 'protein_chicken_breast', name: 'Chicken Breast', category: 'protein', unit: 'grams', icon: '🍗' },
  { id: 'protein_paneer', name: 'Paneer', category: 'protein', unit: 'grams', icon: '🧀' },
  { id: 'protein_tofu', name: 'Tofu', category: 'protein', unit: 'grams', icon: '🟫' },
  { id: 'protein_eggs', name: 'Eggs', category: 'protein', unit: 'whole', icon: '🥚' },
  { id: 'protein_chickpeas_canned', name: 'Chickpeas', category: 'protein', unit: 'cans', icon: '🫘' },
  { id: 'veg_spinach_fresh', name: 'Spinach', category: 'vegetable', unit: 'grams', icon: '🥬' },
  { id: 'veg_tomato_fresh', name: 'Tomatoes', category: 'vegetable', unit: 'medium', icon: '🍅' },
  { id: 'veg_onion_red', name: 'Red Onion', category: 'vegetable', unit: 'medium', icon: '🧅' },
  { id: 'veg_broccoli_head', name: 'Broccoli', category: 'vegetable', unit: 'head', icon: '🥦' },
  { id: 'veg_bell_pepper_mixed', name: 'Bell Peppers', category: 'vegetable', unit: 'medium', icon: '🫑' },
  { id: 'veg_cucumber', name: 'Cucumber', category: 'vegetable', unit: 'medium', icon: '🥒' },
  { id: 'veg_lemon', name: 'Lemon', category: 'vegetable', unit: 'whole', icon: '🍋' },
  { id: 'dairy_yogurt_plain', name: 'Plain Yogurt', category: 'dairy', unit: 'grams', icon: '🥛' },
  { id: 'dairy_cream_heavy', name: 'Heavy Cream', category: 'dairy', unit: 'ml', icon: '🥛' },
];

function IngredientsStep({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>🛒 FRESH INGREDIENTS</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg">What did you buy recently?</p>
      <div className="grid grid-cols-2 gap-2">
        {COMMON_INGREDIENTS.map(ing => (
          <button key={ing.id} onClick={() => onToggle(ing.id)}
            className="text-left px-3 py-2 rounded-sm cursor-pointer transition-all flex items-center gap-2"
            style={{ background: selected.includes(ing.id) ? 'color-mix(in srgb, var(--accent-3) 20%, transparent)' : 'var(--bg-secondary)', border: `2px solid ${selected.includes(ing.id) ? 'var(--accent-3)' : 'var(--border)'}` }}>
            <span className="text-xl">{ing.icon}</span>
            <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{ing.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step: Theme ────────────────────────────────────────────────────────────────
function ThemeStep({ theme, onSelect }: { theme: ThemeId; onSelect: (t: ThemeId) => void }) {
  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>🎨 CHOOSE YOUR THEME</div>
      <p className="font-vt323 text-[var(--text-secondary)] text-lg">Pick your visual style. Change anytime in Settings.</p>
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map(t => (
          <button key={t.id} onClick={() => { onSelect(t.id); applyTheme(t.id); Sound.tap(); }}
            className="p-2 rounded-sm cursor-pointer transition-all"
            style={{ background: theme === t.id ? 'var(--accent-2)' : 'var(--bg-secondary)', border: `2px solid ${theme === t.id ? 'var(--accent-1)' : 'var(--border)'}` }}>
            {/* Color swatch row */}
            <div className="flex gap-0.5 mb-1 rounded-sm overflow-hidden h-4">
              {t.preview.slice(0, 5).map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="font-pixel text-center" style={{ fontSize: '5px', color: 'var(--text-primary)' }}>{t.name}</div>
            <div className="font-pixel text-center" style={{ fontSize: '4px', color: 'var(--text-secondary)' }}>{t.era}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step: Review ───────────────────────────────────────────────────────────────
function ReviewStep({ player, calories, macros }: {
  player: Partial<Player>; calories: number;
  macros: { protein_g: number; carbs_g: number; fat_g: number };
}) {
  return (
    <div className="space-y-4">
      <div className="font-pixel text-[var(--accent-3)]" style={{ fontSize: '11px' }}>📜 REVIEW & CONFIRM</div>
      <div className="space-y-3">
        <Row label="CHEF NAME" value={player.username ?? '—'} />
        <Row label="BODY STATS" value={`${player.body_stats?.weight_kg}kg · ${player.body_stats?.height_cm}cm · ${player.body_stats?.age}yr`} />
        <Row label="ACTIVITY" value={ACTIVITY_LABELS[player.activity_level!]?.label ?? '—'} />
        <Row label="TARGET" value={FITNESS_TARGET_LABELS[player.fitness_target!]?.label ?? '—'} />
        <div className="pixel-border rounded-sm p-3" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-1)' }}>
          <div className="font-pixel mb-2" style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>DAILY TARGETS</div>
          <div className="font-pixel" style={{ fontSize: '14px', color: 'var(--accent-1)' }}>{calories.toLocaleString()} kcal</div>
          <div className="font-vt323 text-lg" style={{ color: 'var(--text-secondary)' }}>
            {macros.protein_g}g protein · {macros.carbs_g}g carbs · {macros.fat_g}g fat
          </div>
        </div>
        <Row label="MEALS/DAY" value={`${player.meal_structure?.meals.length ?? 0} meals`} />
        <Row label="EQUIPMENT" value={`${player.cooking?.equipment.length ?? 0} appliances`} />
        <Row label="THEME" value={THEMES.find(t => t.id === player.theme)?.name ?? '—'} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-3 py-2 rounded-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <span className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>{label}</span>
      <span className="font-vt323 text-lg" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

// ─── Main Onboarding Wizard ──────────────────────────────────────────────────────
export function OnboardingPage() {
  const { setPlayer, setHasOnboarded } = usePlayerStore();
  const { setItems } = useInventoryStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('ChefMage');
  const [bodyStats, setBodyStats] = useState<{ age: number; gender: Gender; height_cm: number; weight_kg: number; target_weight_kg?: number; unit_preference: 'metric' | 'imperial' }>({ age: 25, gender: 'male', height_cm: 175, weight_kg: 70, unit_preference: 'metric' });
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [fitnessTarget, setFitnessTarget] = useState<FitnessTarget>('maintain');
  const [mealPreset, setMealPreset] = useState<MealPreset>('balanced');
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [mealSlots, setMealSlots] = useState<MealSlot[]>([
    { slot: 'breakfast', tag: 'breakfast', calorie_pct: 20, time: '08:00' },
    { slot: 'lunch', tag: 'lunch', calorie_pct: 30, time: '13:00' },
    { slot: 'dinner', tag: 'dinner', calorie_pct: 35, time: '19:00' },
    { slot: 'snack_pm', tag: 'snack', calorie_pct: 15, time: '16:00' },
  ]);
  const [equipment, setEquipment] = useState<Appliance[]>(['stovetop', 'microwave']);
  const [pantryChecked, setPantryChecked] = useState<string[]>(PANTRY_STAPLES.map(s => s.id));
  const [freshIngredients, setFreshIngredients] = useState<string[]>([]);
  const [theme, setTheme] = useState<ThemeId>('snes');

  const bmr = calcBmr(bodyStats.gender, bodyStats.weight_kg, bodyStats.height_cm, bodyStats.age);
  const tdee = calcTdee(bmr, activityLevel);
  const calories = calcDailyCalories(tdee, fitnessTarget, bodyStats.gender);
  const macros = calcMacros(calories, mealPreset);

  function nextStep() { Sound.transition(); setStep(s => Math.min(TOTAL_STEPS, s + 1)); }
  function prevStep() { Sound.back(); setStep(s => Math.max(0, s - 1)); }

  function toggleEquipment(a: Appliance) {
    Sound.tap();
    setEquipment(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  function finish() {
    const player: Player = {
      id: crypto.randomUUID(),
      username,
      body_stats: { ...bodyStats },
      activity_level: activityLevel,
      fitness_target: fitnessTarget,
      meal_preset: mealPreset,
      dietary_restrictions: dietary as Player['dietary_restrictions'],
      allergies,
      intolerances: [],
      custom_exclusions: [],
      religious_diet: null,
      health_conditions: [],
      meal_structure: {
        preset: 'custom',
        meals: mealSlots,
        fasting_window: null,
      },
      stat_goals: {
        hp_calories: calories,
        str_protein: macros.protein_g,
        macro_preset: mealPreset,
        macros: { carbs_pct: MEAL_PRESETS[mealPreset].carbs_pct, protein_pct: MEAL_PRESETS[mealPreset].protein_pct, fat_pct: MEAL_PRESETS[mealPreset].fat_pct },
      },
      cuisine_preferences: ['indian_north', 'mediterranean'],
      cooking: {
        skill_level: 'intermediate',
        max_daily_prep_min: 60,
        equipment,
        preferred_methods: ['stir-fry', 'one-pot'],
      },
      servings: 2,
      level: 1,
      current_streak: 0,
      theme,
    };

    // Build inventory from pantry + fresh ingredients
    const today = new Date();
    const inv = [
      ...PANTRY_STAPLES.filter(s => pantryChecked.includes(s.id)).map(s => ({
        id: crypto.randomUUID(), user_id: player.id,
        item_name: s.name, ingredient_id: s.ingredient_id,
        quantity: s.qty, unit: s.unit, category: s.category as InventoryItem['category'],
        decay_timer: format(addDays(today, s.shelfDays), 'yyyy-MM-dd'),
        rarity: 'common' as const, is_pantry_staple: true,
      })),
      ...freshIngredients.map(id => {
        const found = COMMON_INGREDIENTS_MAP[id];
        return found ? {
          id: crypto.randomUUID(), user_id: player.id,
          item_name: found.name, ingredient_id: id,
          quantity: 1, unit: found.unit, category: found.category as InventoryItem['category'],
          decay_timer: format(addDays(today, 5), 'yyyy-MM-dd'),
          rarity: 'common' as const,
        } : null;
      }).filter(Boolean) as InventoryItem[],
    ];

    applyTheme(theme);
    setPlayer(player);
    setItems(inv);
    setHasOnboarded(true);
    Sound.transition();
    navigate('/tavern');
  }

  type InventoryItem = import('../types').InventoryItem;

  const COMMON_INGREDIENTS_MAP: Record<string, { name: string; unit: string; category: string }> = {
    protein_chicken_breast: { name: 'Chicken Breast', unit: 'grams', category: 'protein' },
    protein_paneer:         { name: 'Paneer', unit: 'grams', category: 'protein' },
    protein_tofu:           { name: 'Tofu', unit: 'grams', category: 'protein' },
    protein_eggs:           { name: 'Eggs', unit: 'whole', category: 'protein' },
    protein_chickpeas_canned: { name: 'Chickpeas', unit: 'cans', category: 'protein' },
    veg_spinach_fresh:      { name: 'Spinach', unit: 'grams', category: 'vegetable' },
    veg_tomato_fresh:       { name: 'Tomatoes', unit: 'medium', category: 'vegetable' },
    veg_onion_red:          { name: 'Red Onion', unit: 'medium', category: 'vegetable' },
    veg_broccoli_head:      { name: 'Broccoli', unit: 'head', category: 'vegetable' },
    veg_bell_pepper_mixed:  { name: 'Bell Peppers', unit: 'medium', category: 'vegetable' },
    veg_cucumber:           { name: 'Cucumber', unit: 'medium', category: 'vegetable' },
    veg_lemon:              { name: 'Lemon', unit: 'whole', category: 'vegetable' },
    dairy_yogurt_plain:     { name: 'Plain Yogurt', unit: 'grams', category: 'dairy' },
    dairy_cream_heavy:      { name: 'Heavy Cream', unit: 'ml', category: 'dairy' },
  };

  const STEP_TITLES = [
    'Welcome', 'Your Stats', 'Quest Objective', 'Meal Style',
    'Dietary Wards', 'Daily Structure', 'Kitchen Setup',
    'Pantry Check', 'Fresh Ingredients', 'Choose Theme', 'Review',
  ];

  const canProceed = (() => {
    if (step === 1) return bodyStats.age > 0 && bodyStats.height_cm > 0 && bodyStats.weight_kg > 0;
    if (step === 6) return equipment.length > 0;
    return true;
  })();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {step > 0 && (
        <div className="px-4 pt-4">
          <StepProgress step={step - 1} />
          <div className="font-pixel text-center mb-4" style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>
            STEP {step} / {TOTAL_STEPS} — {STEP_TITLES[step]}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.2 }} className="h-full">
            {step === 0  && <WelcomeStep onNext={nextStep} />}
            {step === 1  && (
              <div className="space-y-4">
                <div className="font-pixel text-[var(--accent-3)] mb-2" style={{ fontSize: '11px' }}>👤 YOUR NAME</div>
                <input type="text" value={username} maxLength={16}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ChefMage"
                  className="w-full px-3 py-2 font-vt323 text-xl outline-none mb-4"
                  style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} />
                <BodyStatsStep data={bodyStats} onChange={d => setBodyStats(b => ({ ...b, ...d }))} />
              </div>
            )}
            {step === 2  && <ActivityStep activityLevel={activityLevel} fitnessTarget={fitnessTarget} bodyStats={bodyStats} onChange={(a, f) => { setActivityLevel(a); setFitnessTarget(f); }} />}
            {step === 3  && <MealPresetStep preset={mealPreset} calories={calories} onSelect={setMealPreset} />}
            {step === 4  && <DietaryStep dietary={dietary} allergies={allergies} onChangeDiet={setDietary} onChangeAllergies={setAllergies} />}
            {step === 5  && <MealStructureStep slots={mealSlots} onSelect={setMealSlots} />}
            {step === 6  && <EquipmentStep equipment={equipment} onToggle={toggleEquipment} />}
            {step === 7  && <PantryStep checked={pantryChecked} onToggle={id => setPantryChecked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} />}
            {step === 8  && <IngredientsStep selected={freshIngredients} onToggle={id => setFreshIngredients(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} />}
            {step === 9  && <ThemeStep theme={theme} onSelect={setTheme} />}
            {step === 10 && <ReviewStep player={{ username, body_stats: bodyStats, activity_level: activityLevel, fitness_target: fitnessTarget, meal_structure: { preset: 'custom', meals: mealSlots, fasting_window: null }, cooking: { skill_level: 'intermediate', max_daily_prep_min: 60, equipment, preferred_methods: [] }, theme }} calories={calories} macros={macros} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      {step > 0 && (
        <div className="px-4 pb-6 pt-3 flex gap-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <PixelButton onClick={prevStep} variant="secondary" size="md" className="flex-1">← BACK</PixelButton>
          {step < TOTAL_STEPS
            ? <PixelButton onClick={nextStep} disabled={!canProceed} variant="primary" size="md" glow className="flex-2 flex-grow-[2]">NEXT →</PixelButton>
            : <PixelButton onClick={finish} variant="success" size="md" glow className="flex-2 flex-grow-[2]">⚔ ENTER THE TAVERN</PixelButton>
          }
        </div>
      )}
    </div>
  );
}
