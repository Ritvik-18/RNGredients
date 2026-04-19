import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../stores/playerStore';
import { PixelButton } from '../components/ui/PixelButton';
import type { Player } from '../types';

const THEMES: { value: Player['theme']; label: string; desc: string }[] = [
  { value: 'snes',    label: 'SUPER NES',  desc: 'Midnight indigo + magenta' },
  { value: 'gameboy', label: 'GAME BOY',   desc: '4-shade forest green' },
  { value: 'nes',     label: 'NES',        desc: 'Classic black + primaries' },
  { value: 'genesis', label: 'GENESIS',    desc: 'Sega blue + gold' },
];

const DIETARY: Player['dietary_restrictions'][number][] = ['vegetarian', 'vegan', 'gluten_free'];

export function CharacterCreationPage() {
  const { player, setUsername, setTheme, setPlayer, setHasOnboarded } = usePlayerStore();
  const navigate = useNavigate();
  const [name, setName] = useState(player.username);
  const [selectedTheme, setSelectedTheme] = useState<Player['theme']>(player.theme);
  const [dietary, setDietary] = useState<Set<string>>(new Set(player.dietary_restrictions));

  function toggleDiet(tag: string) {
    setDietary(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function handleStart() {
    setUsername(name.trim() || 'ChefMage');
    setTheme(selectedTheme);
    setPlayer({
      ...player,
      username: name.trim() || 'ChefMage',
      theme: selectedTheme,
      dietary_restrictions: [...dietary] as Player['dietary_restrictions'],
    });
    setHasOnboarded(true);
    navigate('/tavern');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 scanlines relative">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="font-pixel text-[var(--accent-1)] mb-2" style={{ fontSize: '20px' }}>
            RNGredients
          </div>
          <div className="font-vt323 text-[var(--text-secondary)] text-xl">
            The Gacha Meal Planner
          </div>
        </div>

        <div className="pixel-border rounded-sm p-6" style={{ background: 'var(--bg-secondary)' }}>
          <div className="font-pixel text-[var(--accent-3)] mb-4" style={{ fontSize: '10px' }}>
            ▶ CREATE CHARACTER
          </div>

          {/* Username */}
          <div className="mb-6">
            <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
              CHEF NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={16}
              className="w-full px-3 py-2 font-vt323 text-xl outline-none"
              style={{
                background: 'var(--bg-tertiary)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              placeholder="ChefMage"
            />
          </div>

          {/* Dietary */}
          <div className="mb-6">
            <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
              DIETARY CLASS
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleDiet(tag)}
                  className="font-pixel px-3 py-1.5 rounded-sm transition-all duration-150 cursor-pointer"
                  style={{
                    fontSize: '7px',
                    background: dietary.has(tag) ? 'var(--accent-1)' : 'var(--bg-tertiary)',
                    color: dietary.has(tag) ? '#fff' : 'var(--text-secondary)',
                    border: `2px solid ${dietary.has(tag) ? 'var(--accent-1)' : 'var(--border)'}`,
                  }}
                >
                  {dietary.has(tag) ? '✓ ' : ''}{tag.replace(/_/g, ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="mb-8">
            <label className="font-pixel block mb-2" style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>
              DISPLAY THEME
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t => (
                <button
                  key={t.value}
                  onClick={() => { setSelectedTheme(t.value); setTheme(t.value); }}
                  className="text-left p-2 rounded-sm transition-all duration-150 cursor-pointer"
                  style={{
                    background: selectedTheme === t.value ? 'var(--accent-2)' : 'var(--bg-tertiary)',
                    border: `2px solid ${selectedTheme === t.value ? 'var(--accent-1)' : 'var(--border)'}`,
                  }}
                >
                  <div className="font-pixel" style={{ fontSize: '7px', color: 'var(--text-primary)' }}>{t.label}</div>
                  <div className="font-vt323 text-sm" style={{ color: 'var(--text-secondary)' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <PixelButton onClick={handleStart} variant="primary" glow className="w-full" size="lg">
            ⚔ BEGIN QUEST
          </PixelButton>
        </div>
      </motion.div>
    </div>
  );
}
