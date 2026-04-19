interface StatChipProps {
  label: string;
  value: number;
  unit?: string;
  color?: string;
}

export function StatChip({ label, value, unit = '', color = 'var(--accent-3)' }: StatChipProps) {
  return (
    <div
      className="flex flex-col items-center px-2 py-1 rounded-sm"
      style={{ background: 'var(--bg-tertiary)', border: `1px solid ${color}` }}
    >
      <span className="font-pixel" style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>{label}</span>
      <span className="font-vt323 text-lg leading-tight" style={{ color }}>
        {Math.round(value)}{unit}
      </span>
    </div>
  );
}
