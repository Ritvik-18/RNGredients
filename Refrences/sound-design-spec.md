# RNGym — Sound Design Specification

## Design Philosophy
Cozy retro pixel sounds inspired by Stardew Valley. Warm, satisfying, never harsh.
Chunky mechanical keyboard-style clicks for tactile feedback. Musical chimes for rewards.

## Sound Inventory

### Navigation & UI
| Sound | File | Description | When Used |
|-------|------|-------------|-----------|
| Button Tap | `sfx_tap.wav` | Short chunky keyboard click. Warm, satisfying "thock" | Every PixelButton press, chip selection, nav item tap |
| Navigation | `sfx_nav.wav` | Soft wood block tap, like opening a Stardew menu | Bottom nav tab changes, onboarding next/back |
| Error | `sfx_error.wav` | Low-pitched dull "bonk", like hitting a rock in SDV | Disabled button press, validation failure |

### Workout Session
| Sound | File | Description | When Used |
|-------|------|-------------|-----------|
| Set Done | `sfx_set_done.wav` | Bright ascending two-note chime "ding-ding!" | Completing a set (rep button pressed) |
| Exercise Complete | `sfx_complete.wav` | Warm 3-note ascending arpeggio, like SDV harvest | When all sets of an exercise finished |
| Victory | `sfx_victory.wav` | 5-note fanfare, like leveling up in SDV | Quest complete (workout finished) |
| Skip | `sfx_skip.wav` | Quick whoosh/swoosh, neutral tone | Skipping exercise, skipping rest timer |
| Warning | `sfx_warning.wav` | Gentle xylophone "boop-boop", not alarming | Timer running low (last 5 seconds) |
| Tick | `sfx_tick.wav` | Soft metronome tick, like a grandfather clock | Rest timer ticking (every second) |

### Slot Machine
| Sound | File | Description | When Used |
|-------|------|-------------|-----------|
| Slot Spin | `sfx_reroll.wav` | Mechanical ratchety spinning sound, like SDV slots | Slot wheel spinning animation |
| Reroll | `sfx_reroll.wav` | Same as spin — reroll triggers new spin | Reroll button pressed |

### Social & Rewards
| Sound | File | Description | When Used |
|-------|------|-------------|-----------|
| Favorite | `sfx_favorite.wav` | Soft sparkle "bling!", warm and pleasant | Adding/removing favorite |
| Streak | `sfx_streak.wav` | Upbeat chord strum, celebratory | Streak milestone hit |

## Implementation Notes
- All sounds SoundPool-based, max 4 concurrent streams
- Volume levels: UI clicks 0.4-0.5, session events 0.5-0.7, victories 0.8
- PixelButton should play tap sound on every click by default
- Haptic feedback (short vibration) on navigation buttons (next/back in onboarding)

## Changes (v2)

### New Sounds Added
| Sound | File | Description | When Used |
|-------|------|-------------|-----------|
| Toggle Switch | `sfx_toggle.wav` | Chunky mechanical switch "ka-chunk" — 90ms, two-tone with transient attack | Settings toggle switches (warmup, core, cooldown) |
| Coin Landing | `sfx_coin.wav` | Retro coin shimmer "ka-ching!" — 350ms, two-tone with sparkle harmonics | Slot machine result revealed after spin completes |

### Updated Slot Machine Behavior
- Tick sounds now play during slot wheel spinning (each time a new exercise scrolls past center)
- Coin landing sound plays when slot wheel finishes and result is revealed
- Reroll sound still plays when the spin starts

### Updated Haptic Behavior
- All PixelButtons now trigger haptic feedback by default (`haptic = true` is the new default)
- Toggle switches in Settings play toggle sound + haptic on state change
- Total sound files: 14 (was 12)

## Changes (v3) — Sound Depth & Comprehensive Feedback

### Design Principles for Depth
1. **Differentiated feedback by action category**: Not every tap should sound the same. Navigation, selection, toggling, and completion are different actions and deserve distinct auditory identities.
2. **Volume hierarchy**: Ambient/passive (0.2-0.3), UI interaction (0.4-0.5), session events (0.5-0.7), milestones (0.7-0.8). Creates a natural soundscape where important events cut through.
3. **Layered feedback**: Combine sound + haptic for interactive elements. Haptic provides tactile confirmation; sound provides auditory confirmation. Together they create perceived responsiveness.
4. **No dead buttons**: Every interactive element must produce some feedback. Silent buttons feel broken.

### Sound-Action Mapping (Existing Sounds, New Assignments)

| Action Category | Sound | Haptic | Elements |
|----------------|-------|--------|----------|
| **Navigation** | `sfx_nav.wav` (0.4) | VIRTUAL_KEY | Bottom nav tabs, calendar month arrows, onboarding nav |
| **UI Tap** | `sfx_tap.wav` (0.5) | VIRTUAL_KEY | PixelButton, PixelIconButton, PixelSelectableChip |
| **Toggle** | `sfx_toggle.wav` (0.6) | VIRTUAL_KEY | Settings switches, FilterChip toggle on/off |
| **Favorite On** | `sfx_favorite.wav` (0.6) | LONG_PRESS | Heart toggle ON (library + session card) |
| **Favorite Off** | `sfx_toggle.wav` (0.4) | VIRTUAL_KEY | Heart toggle OFF (quieter, less celebratory) |
| **Value Change** | `sfx_tap.wav` (0.3) | VIRTUAL_KEY | Timer +/- buttons, exercise count +/-, anti-repeat +/- |
| **Exclude** | `sfx_error.wav` (0.4) | LONG_PRESS | Exclude from quests button |
| **Include** | `sfx_complete.wav` (0.4) | VIRTUAL_KEY | Include back in quests button |
| **Skip** | `sfx_skip.wav` (0.5) | — | Skip exercise, skip rest timer |
| **Set Done** | `sfx_set_done.wav` (0.6) | LONG_PRESS | Rep button press (completing a set) |
| **Exercise Complete** | `sfx_complete.wav` (0.7) | — | All sets of exercise done |
| **Victory** | `sfx_victory.wav` (0.8) | — | Quest complete |
| **Streak** | `sfx_streak.wav` (0.7) | — | Streak milestone |
| **Reroll** | `sfx_reroll.wav` (0.6) | — | Slot machine spin |
| **Coin** | `sfx_coin.wav` (0.7) | — | Slot result reveal |
| **Timer Tick** | `sfx_tick.wav` (0.3) | — | Rest timer each second |
| **Warning** | `sfx_warning.wav` (0.5) | LONG_PRESS | Timer last 5 seconds |

### Elements That Previously Had No Feedback (Now Fixed)
| Element | Location | Sound | Haptic |
|---------|----------|-------|--------|
| Favorite heart (library) | LibraryScreen ExerciseListItem, MobilityListItem | sfx_favorite / sfx_toggle | Yes |
| Timer +/- buttons | SettingsScreen TimerRow | sfx_tap (0.3) | Yes |
| Session pref +/- buttons | SettingsScreen SessionPreferences | sfx_tap (0.3) | Yes |
| FilterChip toggle | SettingsScreen all FilterChips | sfx_toggle | Yes |
| Calendar month arrows | CalendarComponents PixelIconButton | sfx_nav | Yes (already in PixelIconButton) |
| Rest timer skip (already had) | TimerComponents PixelButton | sfx_tap | Yes (via PixelButton) |

### Recommended Future Sound Additions (not blocking)
For even richer depth, these sounds could be added later:
- `sfx_scroll.wav` — Soft papery scroll for list scrolling haptic
- `sfx_confirm.wav` — Distinct from tap, for confirming destructive actions
- `sfx_level_up.wav` — Grander than victory, for weekly streak milestones
- `sfx_unlock.wav` — For potential achievement/badge unlocks

### Sound Libraries for Asset Creation
- **sfxr/jsfxr** (https://sfxr.me/) — Classic 8-bit/16-bit sound generator, perfect for retro pixel games
- **ChipTone** (https://sfbgames.itch.io/chiptone) — Browser-based chip sound generator with more control
- **Freesound.org** — Community sound library (CC licensed), search "8-bit", "pixel", "retro UI"
- **Kenney.nl** (https://kenney.nl/assets?q=audio) — Free game assets including UI sounds
- **ZapSplat** (https://www.zapsplat.com/) — Free SFX library with retro/gaming category
