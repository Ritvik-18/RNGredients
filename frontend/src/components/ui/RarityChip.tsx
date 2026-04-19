import type { Rarity } from '../../types';

interface RarityChipProps {
  rarity: Rarity;
  className?: string;
}

const labels: Record<Rarity, string> = {
  common:    '◆ COMMON',
  uncommon:  '◆ UNCOMMON',
  rare:      '◆ RARE',
  legendary: '★ LEGENDARY',
};

export function RarityChip({ rarity, className = '' }: RarityChipProps) {
  return (
    <span
      className={`chip-${rarity} font-pixel px-1.5 py-0.5 rounded-sm inline-block ${rarity === 'legendary' ? 'legendary-glow' : ''} ${className}`}
      style={{ fontSize: '6px', letterSpacing: '0.05em' }}
    >
      {labels[rarity]}
    </span>
  );
}
