import { NavLink } from 'react-router-dom';
import { usePlayerStore } from '../../stores/playerStore';

const NAV = [
  { to: '/inventory', icon: '🎒', label: 'BAG' },
  { to: '/tavern',    icon: '🎲', label: 'TAVERN' },
  { to: '/quests',    icon: '📜', label: 'QUESTS' },
];

export function NavBar() {
  const { player } = usePlayerStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '2px solid var(--border)',
        boxShadow: '0 -3px 0 var(--border)',
      }}
    >
      <div className="flex flex-1 justify-around">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 px-6 transition-all duration-150 font-pixel ${
                isActive
                  ? 'text-[var(--accent-1)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
            style={{ fontSize: '7px' }}
          >
            <span className="text-xl mb-0.5">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      <div
        className="pr-4 pl-2 flex flex-col items-end"
        style={{ borderLeft: '1px solid var(--border)' }}
      >
        <span className="font-pixel" style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
          LV{player.level}
        </span>
        <span className="font-vt323" style={{ fontSize: '14px', color: 'var(--accent-3)' }}>
          {player.username}
        </span>
        <span className="font-pixel" style={{ fontSize: '5px', color: 'var(--warning)' }}>
          🔥 {player.current_streak}d
        </span>
      </div>
    </nav>
  );
}
