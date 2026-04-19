import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventoryStore } from '../stores/inventoryStore';
import { HpBar } from '../components/ui/HpBar';
import { RarityChip } from '../components/ui/RarityChip';
import { calcHpPct, hpStatus } from '../utils/lootTable';
import type { InventoryItem } from '../types';

const CATEGORY_ICONS: Record<string, string> = {
  protein: '🥩', vegetable: '🥦', carb: '🌾',
  spice: '🌶️', dairy: '🧀', base: '🫙', other: '📦',
};

type SortKey = 'hp' | 'rarity' | 'category' | 'name';

const RARITY_ORDER = { legendary: 0, rare: 1, uncommon: 2, common: 3 };

function sortItems(items: InventoryItem[], key: SortKey): InventoryItem[] {
  return [...items].sort((a, b) => {
    if (key === 'hp') return calcHpPct(a.decay_timer) - calcHpPct(b.decay_timer);
    if (key === 'rarity') return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
    if (key === 'category') return a.category.localeCompare(b.category);
    return a.item_name.localeCompare(b.item_name);
  });
}

export function InventoryPage() {
  const { items } = useInventoryStore();
  const [sort, setSort] = useState<SortKey>('hp');
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(items.map(i => i.category))];

  const filtered = sortItems(
    filter === 'all' ? items : items.filter(i => i.category === filter),
    sort,
  );

  const criticalCount = items.filter(i => ['critical', 'expired'].includes(hpStatus(calcHpPct(i.decay_timer)))).length;
  const warningCount  = items.filter(i => hpStatus(calcHpPct(i.decay_timer)) === 'warning').length;

  return (
    <div className="pb-20 min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-pixel text-[var(--text-primary)]" style={{ fontSize: '12px' }}>🎒 INVENTORY</div>
            <div className="font-vt323 text-[var(--text-secondary)]">{items.length} items</div>
          </div>
          <div className="flex gap-3 text-right">
            {criticalCount > 0 && (
              <div className="hp-critical">
                <div className="font-pixel" style={{ fontSize: '6px', color: 'var(--error)' }}>CRITICAL</div>
                <div className="font-vt323 text-2xl" style={{ color: 'var(--error)' }}>{criticalCount}</div>
              </div>
            )}
            {warningCount > 0 && (
              <div>
                <div className="font-pixel" style={{ fontSize: '6px', color: 'var(--warning)' }}>WARNING</div>
                <div className="font-vt323 text-2xl" style={{ color: 'var(--warning)' }}>{warningCount}</div>
              </div>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="flex-shrink-0 font-pixel px-2 py-1 rounded-sm cursor-pointer transition-all"
              style={{
                fontSize: '7px',
                background: filter === cat ? 'var(--accent-1)' : 'var(--bg-tertiary)',
                color: filter === cat ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${filter === cat ? 'var(--accent-1)' : 'var(--border)'}`,
              }}
            >
              {cat === 'all' ? '⚔ ALL' : `${CATEGORY_ICONS[cat] ?? '📦'} ${cat.toUpperCase()}`}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1">
          {(['hp', 'rarity', 'category', 'name'] as SortKey[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="font-pixel px-2 py-0.5 rounded-sm cursor-pointer transition-all"
              style={{
                fontSize: '6px',
                background: sort === s ? 'var(--accent-2)' : 'transparent',
                color: sort === s ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {s === 'hp' ? '↑HP' : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => {
            const hp = calcHpPct(item.decay_timer);
            const status = hpStatus(hp);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
              >
                <InventoryItemCard item={item} hp={hp} status={status} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InventoryItemCard({
  item, hp, status,
}: { item: InventoryItem; hp: number; status: ReturnType<typeof hpStatus> }) {
  const icon = CATEGORY_ICONS[item.category] ?? '📦';
  const daysLeft = Math.max(0, Math.ceil(hp * 7));

  return (
    <div
      className="pixel-border rounded-sm p-3 flex gap-3 items-center"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: status === 'critical' ? 'var(--error)' : status === 'warning' ? 'var(--warning)' : 'var(--border)',
      }}
    >
      <div className="text-3xl w-10 text-center flex-shrink-0">{icon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-pixel truncate" style={{ fontSize: '9px', color: 'var(--text-primary)' }}>
            {item.item_name}
          </span>
          <RarityChip rarity={item.rarity} />
        </div>
        <HpBar decayTimer={item.decay_timer} />
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-vt323 text-lg" style={{ color: 'var(--text-primary)' }}>
          {item.quantity} {item.unit}
        </div>
        <div
          className="font-pixel"
          style={{
            fontSize: '6px',
            color: status === 'expired' ? 'var(--text-secondary)'
              : status === 'critical' ? 'var(--error)'
              : status === 'warning' ? 'var(--warning)'
              : 'var(--success)',
          }}
        >
          {status === 'expired' ? 'EXPIRED' : `${daysLeft}d LEFT`}
        </div>
      </div>
    </div>
  );
}
