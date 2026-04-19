import type { Theme } from '../types';

const BASE_RARITY = {
  'rarity-common':    '#A8A8B8',
  'rarity-uncommon':  '#00ADB5',
  'rarity-rare':      '#9B59B6',
  'rarity-legendary': '#F39C12',
};

export const THEMES: Theme[] = [
  {
    id: 'snes', name: 'SNES', era: 'SNES',
    preview: ['#1A1A2E', '#16213E', '#E94560', '#00ADB5', '#E8E8E8'],
    vars: { 'bg-primary': '#1A1A2E', 'bg-secondary': '#16213E', 'bg-tertiary': '#0F3460', 'text-primary': '#E8E8E8', 'text-secondary': '#A8A8B8', 'accent-1': '#E94560', 'accent-2': '#533483', 'accent-3': '#00ADB5', success: '#2ECC71', warning: '#F39C12', error: '#E94560', border: '#0F3460', ...BASE_RARITY },
  },
  {
    id: 'gameboy', name: 'Game Boy', era: 'GB',
    preview: ['#0F380F', '#306230', '#8BAC0F', '#9BBC0F', '#9BBC0F'],
    vars: { 'bg-primary': '#0F380F', 'bg-secondary': '#306230', 'bg-tertiary': '#8BAC0F', 'text-primary': '#9BBC0F', 'text-secondary': '#8BAC0F', 'accent-1': '#9BBC0F', 'accent-2': '#8BAC0F', 'accent-3': '#306230', success: '#9BBC0F', warning: '#8BAC0F', error: '#306230', border: '#306230', 'rarity-common': '#8BAC0F', 'rarity-uncommon': '#9BBC0F', 'rarity-rare': '#0F380F', 'rarity-legendary': '#9BBC0F' },
  },
  {
    id: 'nes', name: 'NES', era: 'NES',
    preview: ['#000000', '#1D2B53', '#FF004D', '#29ADFF', '#FFFFFF'],
    vars: { 'bg-primary': '#000000', 'bg-secondary': '#1D2B53', 'bg-tertiary': '#29366F', 'text-primary': '#FFFFFF', 'text-secondary': '#7E7E7E', 'accent-1': '#FF004D', 'accent-2': '#29ADFF', 'accent-3': '#FFEC27', success: '#00E436', warning: '#FFA300', error: '#FF004D', border: '#7E7E7E', ...BASE_RARITY },
  },
  {
    id: 'genesis', name: 'Genesis', era: 'MD',
    preview: ['#000E2E', '#0B1E4E', '#0060DF', '#FFD700', '#FFFFFF'],
    vars: { 'bg-primary': '#000E2E', 'bg-secondary': '#0B1E4E', 'bg-tertiary': '#152A68', 'text-primary': '#FFFFFF', 'text-secondary': '#8CA0C8', 'accent-1': '#0060DF', 'accent-2': '#FFD700', 'accent-3': '#DC143C', success: '#00C853', warning: '#FFD700', error: '#DC143C', border: '#152A68', ...BASE_RARITY },
  },
  {
    id: 'pokemon', name: 'Pokémon', era: 'GB',
    preview: ['#F8F8F8', '#FFFFFF', '#DC0A2D', '#3B4CCA', '#FFDE00'],
    vars: { 'bg-primary': '#F8F8F8', 'bg-secondary': '#FFFFFF', 'bg-tertiary': '#E8E8E8', 'text-primary': '#383838', 'text-secondary': '#686868', 'accent-1': '#DC0A2D', 'accent-2': '#3B4CCA', 'accent-3': '#FFDE00', success: '#4DAD5B', warning: '#F08030', error: '#DC0A2D', border: '#D0D0D0', 'rarity-common': '#686868', 'rarity-uncommon': '#4DAD5B', 'rarity-rare': '#3B4CCA', 'rarity-legendary': '#FFDE00' },
  },
  {
    id: 'zelda', name: 'Zelda', era: 'NES',
    preview: ['#2C1E0F', '#3A2A14', '#00A800', '#0070EC', '#FCBCB0'],
    vars: { 'bg-primary': '#2C1E0F', 'bg-secondary': '#3A2A14', 'bg-tertiary': '#4A3A1F', 'text-primary': '#FCBCB0', 'text-secondary': '#C89068', 'accent-1': '#00A800', 'accent-2': '#0070EC', 'accent-3': '#FC9838', success: '#00A800', warning: '#FC9838', error: '#A81000', border: '#685830', ...BASE_RARITY },
  },
  {
    id: 'street_fighter', name: 'Street Fighter', era: 'Arcade',
    preview: ['#0C0C1E', '#1A1A3E', '#FF6600', '#0088FF', '#FFCC00'],
    vars: { 'bg-primary': '#0C0C1E', 'bg-secondary': '#1A1A3E', 'bg-tertiary': '#252552', 'text-primary': '#FFFFFF', 'text-secondary': '#A0A0C0', 'accent-1': '#FF6600', 'accent-2': '#0088FF', 'accent-3': '#FFCC00', success: '#00CC44', warning: '#FFCC00', error: '#FF0033', border: '#252552', ...BASE_RARITY },
  },
  {
    id: 'pacman', name: 'Pac-Man', era: 'Arcade',
    preview: ['#000000', '#0A0A1A', '#FFFF00', '#FF69B4', '#00FFFF'],
    vars: { 'bg-primary': '#000000', 'bg-secondary': '#0A0A1A', 'bg-tertiary': '#141428', 'text-primary': '#FFFFFF', 'text-secondary': '#AAAAAA', 'accent-1': '#FFFF00', 'accent-2': '#FF69B4', 'accent-3': '#00FFFF', success: '#00FF00', warning: '#FFA500', error: '#FF0000', border: '#333366', ...BASE_RARITY },
  },
  {
    id: 'tetris', name: 'Tetris', era: 'GB',
    preview: ['#0B0B1A', '#12122A', '#00F0F0', '#F0A000', '#A000F0'],
    vars: { 'bg-primary': '#0B0B1A', 'bg-secondary': '#12122A', 'bg-tertiary': '#1A1A3A', 'text-primary': '#E0E0E0', 'text-secondary': '#8080A0', 'accent-1': '#00F0F0', 'accent-2': '#F0A000', 'accent-3': '#A000F0', success: '#00F000', warning: '#F0F000', error: '#F00000', border: '#303050', ...BASE_RARITY },
  },
  {
    id: 'final_fantasy', name: 'Final Fantasy', era: 'SNES',
    preview: ['#000040', '#000080', '#FFD700', '#FF6347', '#FFFFFF'],
    vars: { 'bg-primary': '#000040', 'bg-secondary': '#000080', 'bg-tertiary': '#0000A0', 'text-primary': '#FFFFFF', 'text-secondary': '#B0B0FF', 'accent-1': '#FFD700', 'accent-2': '#FF6347', 'accent-3': '#00CED1', success: '#7CFC00', warning: '#FFD700', error: '#FF4040', border: '#4040C0', ...BASE_RARITY },
  },
  {
    id: 'castlevania', name: 'Castlevania', era: 'NES',
    preview: ['#0E0B16', '#1A1425', '#C02040', '#6B3FA0', '#D4C5A9'],
    vars: { 'bg-primary': '#0E0B16', 'bg-secondary': '#1A1425', 'bg-tertiary': '#2D2240', 'text-primary': '#D4C5A9', 'text-secondary': '#8A7A6A', 'accent-1': '#C02040', 'accent-2': '#6B3FA0', 'accent-3': '#DAA520', success: '#50C878', warning: '#DAA520', error: '#C02040', border: '#3A2D50', ...BASE_RARITY },
  },
  {
    id: 'mega_man', name: 'Mega Man', era: 'NES',
    preview: ['#0A0A2A', '#101040', '#00A2E0', '#E8E800', '#FFFFFF'],
    vars: { 'bg-primary': '#0A0A2A', 'bg-secondary': '#101040', 'bg-tertiary': '#181860', 'text-primary': '#FFFFFF', 'text-secondary': '#8888CC', 'accent-1': '#00A2E0', 'accent-2': '#E8E800', 'accent-3': '#E06020', success: '#20C020', warning: '#E8E800', error: '#E02020', border: '#303080', ...BASE_RARITY },
  },
  {
    id: 'earthbound', name: 'Earthbound', era: 'SNES',
    preview: ['#1B0030', '#2A0050', '#FF71CE', '#01CDFE', '#05FFA1'],
    vars: { 'bg-primary': '#1B0030', 'bg-secondary': '#2A0050', 'bg-tertiary': '#3D0070', 'text-primary': '#FFFFFF', 'text-secondary': '#CBA6FF', 'accent-1': '#FF71CE', 'accent-2': '#01CDFE', 'accent-3': '#05FFA1', success: '#05FFA1', warning: '#FFFB96', error: '#FF3860', border: '#6B30A0', ...BASE_RARITY },
  },
  {
    id: 'dkc', name: 'Donkey Kong', era: 'SNES',
    preview: ['#0D1B0E', '#1A2E1C', '#FFD700', '#8B4513', '#F0E8D0'],
    vars: { 'bg-primary': '#0D1B0E', 'bg-secondary': '#1A2E1C', 'bg-tertiary': '#2A4A2C', 'text-primary': '#F0E8D0', 'text-secondary': '#A0C090', 'accent-1': '#FFD700', 'accent-2': '#8B4513', 'accent-3': '#DC143C', success: '#32CD32', warning: '#FFD700', error: '#DC143C', border: '#3A5A3A', ...BASE_RARITY },
  },
  {
    id: 'pico8', name: 'PICO-8', era: 'Indie',
    preview: ['#000000', '#1D2B53', '#FF004D', '#29ADFF', '#FFEC27'],
    vars: { 'bg-primary': '#000000', 'bg-secondary': '#1D2B53', 'bg-tertiary': '#7E2553', 'text-primary': '#FFF1E8', 'text-secondary': '#C2C3C7', 'accent-1': '#FF004D', 'accent-2': '#29ADFF', 'accent-3': '#FFEC27', success: '#00E436', warning: '#FFA300', error: '#FF004D', border: '#5F574F', ...BASE_RARITY },
  },
];

export const THEME_MAP = Object.fromEntries(THEMES.map(t => [t.id, t])) as Record<string, Theme>;

export function applyTheme(themeId: string): void {
  const theme = THEME_MAP[themeId];
  if (!theme) return;
  const root = document.documentElement;
  for (const [key, val] of Object.entries(theme.vars)) {
    root.style.setProperty(`--${key}`, val);
  }
}
