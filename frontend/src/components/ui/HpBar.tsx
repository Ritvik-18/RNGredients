import { calcHpPct, hpStatus } from '../../utils/lootTable';

interface HpBarProps {
  decayTimer: string;
  showLabel?: boolean;
  compact?: boolean;
}

export function HpBar({ decayTimer, showLabel = true, compact = false }: HpBarProps) {
  const pct = calcHpPct(decayTimer);
  const status = hpStatus(pct);

  const colors: Record<typeof status, string> = {
    healthy:  'bg-[var(--success)]',
    warning:  'bg-[var(--warning)]',
    critical: 'bg-[var(--error)]',
    expired:  'bg-[var(--text-secondary)]',
  };

  const labels: Record<typeof status, string> = {
    healthy:  'FRESH',
    warning:  'AGING',
    critical: 'CRITICAL',
    expired:  'EXPIRED',
  };

  const barClass = `${colors[status]} h-full transition-all duration-500 ${status === 'critical' ? 'hp-critical' : ''}`;

  return (
    <div className={`flex flex-col gap-0.5 ${compact ? 'w-16' : 'w-full'}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-pixel" style={{ fontSize: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>HP</span>
          <span style={{ color: status === 'expired' ? 'var(--text-secondary)' : status === 'critical' ? 'var(--error)' : status === 'warning' ? 'var(--warning)' : 'var(--success)' }}>
            {labels[status]}
          </span>
        </div>
      )}
      <div
        className="w-full rounded-sm overflow-hidden"
        style={{ height: compact ? '6px' : '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
      >
        <div className={barClass} style={{ width: `${Math.round(pct * 100)}%` }} />
      </div>
    </div>
  );
}
