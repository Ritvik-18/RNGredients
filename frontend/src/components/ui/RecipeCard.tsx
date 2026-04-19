import type { Recipe } from '../../types';
import { RarityChip } from './RarityChip';
import { StatChip } from './StatChip';

interface RecipeCardProps {
  recipe: Recipe;
  calorieTarget?: number;
  slot?: string;
  missing?: string[];
  compact?: boolean;
}

const cuisineEmoji: Record<string, string> = {
  indian_north: '🍛',
  indian_south: '🥘',
  thai: '🌶️',
  continental: '🍳',
  mediterranean: '🫒',
  mexican: '🌮',
  fusion: '✨',
};

export function RecipeCard({ recipe, calorieTarget, slot, missing = [], compact = false }: RecipeCardProps) {
  const emoji = cuisineEmoji[recipe.cuisine_type] ?? '🍽️';

  if (compact) {
    return (
      <div className="pixel-border rounded-sm p-3" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-pixel truncate" style={{ fontSize: '8px', color: 'var(--text-primary)' }}>
              {recipe.title}
            </div>
            <RarityChip rarity={recipe.rarity} className="mt-0.5" />
          </div>
          <div className="text-right font-vt323" style={{ color: 'var(--accent-3)', fontSize: '16px' }}>
            {recipe.stat_buffs.calories} HP
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pixel-border rounded-sm p-4 relative ${recipe.rarity === 'legendary' ? 'legendary-glow' : ''}`}
      style={{ background: 'var(--bg-secondary)' }}
    >
      {slot && (
        <div className="font-pixel mb-2" style={{ fontSize: '7px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          ▶ {slot}
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-4xl float">{emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-pixel mb-1" style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
            {recipe.title}
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            <RarityChip rarity={recipe.rarity} />
            {recipe.dietary_tags.map(t => (
              <span key={t} className="font-pixel px-1 rounded-sm" style={{ fontSize: '6px', background: 'var(--bg-tertiary)', color: 'var(--accent-3)' }}>
                {t.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <StatChip label="HP" value={recipe.stat_buffs.calories} color="var(--success)" />
            <StatChip label="STR" value={recipe.stat_buffs.protein} unit="g" color="var(--accent-1)" />
            <StatChip label="STA" value={recipe.stat_buffs.carbs} unit="g" color="var(--warning)" />
            <StatChip label="DEF" value={recipe.stat_buffs.fat} unit="g" color="var(--accent-2)" />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="font-pixel mb-1" style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>
          ⚗ REQUIRED MATERIALS
        </div>
        <div className="flex flex-wrap gap-1">
          {recipe.required_materials.map(mat => {
            const isMissing = missing.includes(mat.common_name);
            return (
              <span
                key={mat.id}
                className="font-vt323 px-2 py-0.5 rounded-sm"
                style={{
                  fontSize: '14px',
                  background: isMissing ? 'color-mix(in srgb, var(--error) 20%, transparent)' : 'var(--bg-tertiary)',
                  color: isMissing ? 'var(--error)' : 'var(--text-primary)',
                  border: `1px solid ${isMissing ? 'var(--error)' : 'var(--border)'}`,
                }}
              >
                {isMissing ? '✗ ' : '✓ '}{mat.common_name} ({mat.quantity}{mat.unit})
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <span className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>
          ⏱ {recipe.cook_time_active}min active
          {recipe.prep_time_passive > 0 ? ` + ${recipe.prep_time_passive}min passive` : ''}
        </span>
        {calorieTarget && (
          <span className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>
            target: {Math.round(calorieTarget)} kcal
          </span>
        )}
      </div>
    </div>
  );
}
