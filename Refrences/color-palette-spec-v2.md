# RNGym Color Palette Specification — v4 (Multi-Palette)

## Design Philosophy

v4 introduces **5 switchable palettes** selectable from Settings. Key principles:

1. **Primary = main interaction color** (buttons, active nav, section labels) — varies per palette
2. **Green = completion only** (quest complete, checkmarks, success states)
3. **Red = danger only** (errors, remove, missed days)
4. **No blue-tinted backgrounds** — warm or neutral dark bases
5. **High contrast** — WCAG AA+ for all text/background pairs

## Palette Selection System

- Stored in `user_settings.selected_palette` (Room DB, version 10)
- `ActivePalette` singleton with `mutableStateOf` — recomposes entire UI on change
- Top-level color vals (`Background`, `Primary`, etc.) delegate via `get()` accessors
- Zero import changes across all 15+ UI files

---

## The 5 Palettes

### 1. Tavern Hearth (DEFAULT)
**Theme**: RPG inn, firelight, warm amber
| Role | Hex | Note |
|------|-----|------|
| Background | `#110D08` | Charred wood |
| Surface | `#1C1610` | Dark oak |
| Primary | `#D4A040` | Amber hearth glow |
| Secondary | `#B84040` | Blood red (danger only) |
| Tertiary | `#C88040` | Warm copper |
| XPGold | `#F0C848` | Coin gold |
| CompletedGreen | `#5C9050` | Muted forest (completion only) |
| OnBackground | `#E8DCC8` | Warm parchment |

### 2. Dungeon Stone
**Theme**: Stone dungeon, mystic amethyst
| Role | Hex | Note |
|------|-----|------|
| Background | `#0E0C12` | Slate void |
| Surface | `#1A1820` | Dark granite |
| Primary | `#A880C8` | Amethyst crystal |
| Secondary | `#C84050` | Crimson (danger only) |
| Tertiary | `#8888B8` | Dusty silver |
| XPGold | `#D8B840` | Torch gold |
| CompletedGreen | `#509868` | Moss (completion only) |
| OnBackground | `#E0DCE8` | Moonstone |

### 3. Neon Arcade
**Theme**: Retro arcade cabinet, CRT glow, synthwave
| Role | Hex | Note |
|------|-----|------|
| Background | `#0A0A0C` | CRT off-black |
| Surface | `#141416` | Cabinet dark |
| Primary | `#E840A0` | Hot magenta |
| Secondary | `#E84848` | Neon red (danger only) |
| Tertiary | `#E8C040` | Neon yellow |
| XPGold | `#FFD040` | Bright coin |
| CompletedGreen | `#40E878` | Pixel green (completion only) |
| OnBackground | `#F0F0F4` | CRT white |

### 4. Dragon's Hoard
**Theme**: Dragon lair, fire orange, obsidian cave
| Role | Hex | Note |
|------|-----|------|
| Background | `#100808` | Obsidian |
| Surface | `#1C1410` | Ember stone |
| Primary | `#E07830` | Dragon fire |
| Secondary | `#C03030` | Dragon blood (danger only) |
| Tertiary | `#D0A848` | Ancient gold |
| XPGold | `#F0C040` | Treasure gold |
| CompletedGreen | `#509050` | Scale green (completion only) |
| OnBackground | `#E8DCC8` | Bone white |

### 5. Frost Shard
**Theme**: Ice cavern, frozen steel, cyan crystals
| Role | Hex | Note |
|------|-----|------|
| Background | `#0A0C0E` | Frozen void |
| Surface | `#141820` | Dark ice |
| Primary | `#50C8D8` | Icy cyan |
| Secondary | `#C04848` | Frostbite red (danger only) |
| Tertiary | `#88A8C0` | Moonlight |
| XPGold | `#D8C048` | Pale gold |
| CompletedGreen | `#48A060` | Evergreen (completion only) |
| OnBackground | `#E4E8EC` | Snow white |

---

## Usage Guidelines (all palettes follow these)
- **Primary**: Start quest button, active nav tab, section labels, slider fills, interactive UI chrome
- **CompletedGreen**: "Quest Complete" text, completion checkmarks, success badges ONLY
- **Secondary/MissedRed**: Exclude badge, danger dialogs, error states, missed days ONLY
- **XPGold**: XP numbers, streak counts, coin rewards, favorite star
- **Tertiary**: Mobility sessions, reroll buttons, info badges, timer
- **StreakOrange**: Streak fire, advanced difficulty, warning notes

---

## Change Log
- v1: Stardew Valley palette (purple bg, crop green primary)
- v2: Pastel cheerful palette (navy bg, mint green primary)
- v3: Sweetie 16 + ENDESGA 32 (navy bg, emerald green primary)
- v4: Multi-palette system — 5 switchable palettes, green/red semantic only, warm backgrounds
