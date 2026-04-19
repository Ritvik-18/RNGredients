# PIXEL FORGE — Retro Game UI Design Specification

> **Full visual & UI revamp** for the Workout App. Inspired by Minecraft, Terraria, and classic 8-bit/16-bit console games. All existing functionality remains unchanged — this is purely a visual transformation to **gamify** the workout experience.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Border & Panel System](#4-border--panel-system)
5. [Component Specifications](#5-component-specifications)
6. [Sound Design](#6-sound-design)
7. [Animation Guidelines](#7-animation-guidelines)
8. [Screen-by-Screen Adaptation](#8-screen-by-screen-adaptation)
9. [Implementation Plan](#9-implementation-plan)
10. [Resources & Dependencies](#10-resources--dependencies)
11. [File Changes Map](#11-file-changes-map)

---

## 1. Design Philosophy

### Core Principles

- **Gamification**: Every workout is a quest. Every exercise is a challenge. Every completed set earns XP. The UI should make the user feel like they're playing a game, not just working out.
- **Pixel-Perfect**: Sharp edges, stepped corners, no anti-aliased rounded corners. Everything looks intentionally blocky and retro.
- **Layered Panels**: UI elements are built with layered, beveled panels — like Minecraft inventory or Terraria chest UI. Light edge on top-left, dark edge on bottom-right, creating a 3D depth illusion.
- **High Contrast**: Bright, saturated accent colors on dark backgrounds — like a glowing CRT monitor in a dark room.
- **Retro Feedback**: Every interaction produces satisfying 8-bit sound effects. Taps, completions, and achievements all have distinct retro audio cues.

### Visual References

| Reference | What to Take |
|-----------|-------------|
| **Minecraft** | Inventory panel borders (3-layer bevel), button style (raised/pressed states), tooltip design |
| **Terraria** | Dark blue panel backgrounds, health/mana bar segmentation, item slot styling, NPC dialog panels |
| **Undertale/Deltarune** | White-on-black text panels, battle UI layout, menu selection with animated cursor |
| **Stardew Valley** | Warm color palette blended with pixel art, skill progress bars, day-end summary screen |
| **Classic NES/SNES** | Color palette constraints, sprite-based iconography feel, score counters |

---

## 2. Color Palette

### Primary Palette — "Dungeon Forge"

A dark, moody palette with vivid accent colors, inspired by retro RPGs and dungeon crawlers:

```
BACKGROUND LAYER
  Background       #0B0C1A   (Deep void black — CRT off-screen)
  Surface          #151630   (Dark indigo — primary panel fill)
  SurfaceVariant   #1E2045   (Slightly lighter — secondary panels / cards)
  CardSurface      #252860   (Raised card / elevated panels)

ACCENT COLORS
  Primary          #3DFF6E   (Pixel Green — XP / success / primary actions)
  PrimaryDark      #28CC55   (Darker green — pressed states)
  Secondary        #FF4757   (Hot Red — intensity / danger / hearts)
  SecondaryDark    #CC3844   (Darker red — pressed states)
  Tertiary         #00D4FF   (Electric Cyan — magic / cooldown / info)
  TertiaryDark     #00A8CC   (Darker cyan — pressed states)

UTILITY COLORS
  XPGold           #FFD700   (Gold — achievements, streaks, stars)
  StreakFire        #FF8C00   (Orange fire — streak flames)
  ManaBlue         #4488FF   (Soft blue — rest timer / recovery)
  PotionPurple     #AA66FF   (Purple — mobility / flexibility)

TEXT & BORDER
  OnBackground     #E8E8F0   (Off-white with cool blue tint — CRT phosphor)
  OnSurface        #D0D0E0   (Slightly dimmer text)
  OnSurfaceVariant #8888AA   (Muted — secondary text, labels)
  BorderLight      #555580   (Panel light edge — top/left bevel)
  BorderDark       #0A0A15   (Panel dark edge — bottom/right bevel)
  BorderMid        #333360   (Panel mid border — between light and dark)

STATUS COLORS
  CompletedGreen   #3DFF6E   (Same as Primary — completed exercises)
  MissedRed        #FF4757   (Same as Secondary — missed days)
  RestDayGray      #333355   (Dim — rest days)
  SkippedAmber     #FFAA00   (Amber — skipped exercises)
  FavoriteGold     #FFD700   (Same as XPGold)
  RerollBlue       #00D4FF   (Same as Tertiary)
  Error            #FF2244   (Bright error red)
```

### Color Usage Rules

- **Backgrounds**: Always use the darkest tones. Never pure black (#000000) — use #0B0C1A for depth.
- **Cards/Panels**: Use `Surface` → `SurfaceVariant` → `CardSurface` for increasing elevation.
- **Interactive elements**: Always use bright accent colors (Primary/Secondary/Tertiary).
- **Text hierarchy**: `OnBackground` > `OnSurface` > `OnSurfaceVariant` for decreasing importance.
- **Borders**: 3-layer system — `BorderLight` (top/left), `BorderMid` (all sides), `BorderDark` (bottom/right).

---

## 3. Typography

### Font Selection

| Font | Usage | Source | License |
|------|-------|--------|---------|
| **Press Start 2P** | Headlines, titles, buttons, large labels, timer display | [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P) | OFL (Open Font License) |
| **Silkscreen** | Body text, descriptions, smaller labels, list items | [Google Fonts](https://fonts.google.com/specimen/Silkscreen) | OFL |

### Why These Fonts

- **Press Start 2P**: The quintessential 8-bit pixel font. Designed by CodeMan38. Directly inspired by Namco's arcade fonts from the 1980s. Perfect for headings and dramatic text.
- **Silkscreen**: Designed by Jason Kottke. Optimized for small sizes on screen — far more readable than Press Start 2P at body text sizes. Has Regular and Bold weights. Pixel-art aesthetic without sacrificing legibility.

### Font Files to Download

```
res/font/press_start_2p.ttf          ← from Google Fonts
res/font/silkscreen_regular.ttf      ← from Google Fonts
res/font/silkscreen_bold.ttf         ← from Google Fonts
```

### Typography Scale (Type.kt)

```kotlin
// Font families
val PressStart2P = FontFamily(Font(R.font.press_start_2p))
val SilkscreenFamily = FontFamily(
    Font(R.font.silkscreen_regular, FontWeight.Normal),
    Font(R.font.silkscreen_bold, FontWeight.Bold)
)

val RetroTypography = Typography(
    // PRESS START 2P — Headlines & Display
    headlineLarge = TextStyle(
        fontFamily = PressStart2P,
        fontSize = 20.sp,        // Pixel fonts render large, so size down
        lineHeight = 32.sp,
        letterSpacing = 1.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = PressStart2P,
        fontSize = 16.sp,
        lineHeight = 26.sp,
        letterSpacing = 0.5.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = PressStart2P,
        fontSize = 13.sp,
        lineHeight = 22.sp,
        letterSpacing = 0.5.sp
    ),

    // PRESS START 2P — Titles (used for section headers, card titles)
    titleLarge = TextStyle(
        fontFamily = PressStart2P,
        fontSize = 12.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.5.sp
    ),
    titleMedium = TextStyle(
        fontFamily = PressStart2P,
        fontSize = 10.sp,
        lineHeight = 18.sp,
        letterSpacing = 0.5.sp
    ),

    // SILKSCREEN — Body text (readable at small sizes)
    bodyLarge = TextStyle(
        fontFamily = SilkscreenFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = SilkscreenFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    bodySmall = TextStyle(
        fontFamily = SilkscreenFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp
    ),

    // SILKSCREEN — Labels
    labelLarge = TextStyle(
        fontFamily = SilkscreenFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    labelMedium = TextStyle(
        fontFamily = SilkscreenFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        lineHeight = 16.sp
    ),
    labelSmall = TextStyle(
        fontFamily = SilkscreenFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 10.sp,
        lineHeight = 14.sp
    )
)
```

### Typography Rules

- **Press Start 2P** is ONLY for headlines, titles, buttons, and display numbers (timer, streaks, XP). Never use it for paragraphs — it's too dense.
- **Silkscreen** handles all body text, descriptions, and labels. It's pixel-art but readable.
- Pixel fonts don't need `FontWeight.Bold` on Press Start 2P — it only has Regular 400.
- Silkscreen has Bold 700 — use it for emphasized labels and buttons.
- **All text should be ALL-CAPS** for headings (Press Start 2P) to match the retro arcade aesthetic. Body text in Silkscreen can be mixed case.
- Letter spacing of 0.5-1sp on Press Start 2P improves readability.

---

## 4. Border & Panel System

### The Pixel Border Philosophy

In classic game UIs (Minecraft, Terraria, Undertale), panels have a distinct **beveled border** effect created by:
1. A light-colored edge on the **top and left** (simulating light hitting from top-left)
2. A dark-colored edge on the **bottom and right** (shadow)
3. A solid fill in the middle

This creates the iconic "raised panel" 3D effect without any actual shadows or elevation.

### PixelBorderShape — Custom Compose Shape

Create a custom `Shape` that produces **stepped pixel corners** (staircase pattern) instead of rounded corners:

```kotlin
/**
 * A Shape that creates stepped/staircase corners like retro game panels.
 * @param cornerSize The number of pixel steps in each corner (e.g., 2 = 2-step staircase)
 * @param stepSize The size of each step in dp
 */
class PixelCornerShape(
    private val cornerSteps: Int = 2,
    private val stepSizePx: Float = 4f
) : Shape {
    override fun createOutline(
        size: Size,
        layoutDirection: LayoutDirection,
        density: Density
    ): Outline {
        val path = Path().apply {
            // Top-left corner (stepped)
            moveTo(cornerSteps * stepSizePx, 0f)

            // Top edge
            lineTo(size.width - cornerSteps * stepSizePx, 0f)

            // Top-right corner (stepped down)
            for (i in cornerSteps downTo 1) {
                lineTo(size.width - (i - 1) * stepSizePx, (cornerSteps - i) * stepSizePx)
                lineTo(size.width - (i - 1) * stepSizePx, (cornerSteps - i + 1) * stepSizePx)
            }

            // Right edge
            lineTo(size.width, size.height - cornerSteps * stepSizePx)

            // Bottom-right corner (stepped)
            for (i in 1..cornerSteps) {
                lineTo(size.width - i * stepSizePx, size.height - (cornerSteps - i) * stepSizePx)
                if (i < cornerSteps) {
                    lineTo(size.width - i * stepSizePx, size.height - (cornerSteps - i - 1) * stepSizePx)
                }
            }

            // Bottom edge
            lineTo(cornerSteps * stepSizePx, size.height)

            // Bottom-left corner (stepped up)
            for (i in cornerSteps downTo 1) {
                lineTo((i - 1) * stepSizePx, size.height - (cornerSteps - i) * stepSizePx)
                lineTo((i - 1) * stepSizePx, size.height - (cornerSteps - i + 1) * stepSizePx)
            }

            // Left edge back to start
            lineTo(0f, cornerSteps * stepSizePx)

            // Top-left corner completes
            for (i in 1..cornerSteps) {
                lineTo(i * stepSizePx, (cornerSteps - i) * stepSizePx)
                if (i < cornerSteps) {
                    lineTo(i * stepSizePx, (cornerSteps - i - 1) * stepSizePx)
                }
            }

            close()
        }
        return Outline.Generic(path)
    }
}
```

### 3-Layer Bevel Border Modifier

```kotlin
/**
 * Draws a Minecraft/Terraria-style beveled border around content.
 * Creates a 3D raised panel effect with light top-left and dark bottom-right edges.
 */
fun Modifier.pixelBorder(
    borderWidth: Dp = 2.dp,
    lightColor: Color = BorderLight,
    darkColor: Color = BorderDark,
    fillColor: Color = Surface
): Modifier = this.drawBehind {
    val bw = borderWidth.toPx()

    // Outer dark border (shadow — bottom/right)
    drawRect(color = darkColor, size = size)

    // Light border (highlight — top/left, but inset from dark)
    drawRect(
        color = lightColor,
        size = Size(size.width - bw, size.height - bw)
    )

    // Inner fill
    drawRect(
        color = fillColor,
        topLeft = Offset(bw, bw),
        size = Size(size.width - bw * 2, size.height - bw * 2)
    )
}
```

### Panel Variants

| Panel Type | Border Width | Fill Color | Use |
|-----------|-------------|-----------|-----|
| **Primary Panel** | 3dp | `Surface` | Main content cards, exercise cards |
| **Secondary Panel** | 2dp | `SurfaceVariant` | Nested panels, info boxes |
| **Elevated Panel** | 3dp | `CardSurface` | Highlighted cards, selected states |
| **Dialog Panel** | 4dp | `Surface` | Dialogs, overlays, modals |
| **Input Panel** | 2dp | `Background` (sunken) | Text fields, dropdowns (inverted bevel — dark top-left, light bottom-right = "sunken" look) |
| **Button Panel** | 2dp | Accent color | Buttons (see button spec below) |

---

## 5. Component Specifications

### 5.1 PixelButton

```
┌────────────────────────┐  ← BorderLight (2dp top + left)
│ ████████████████████ │
│ █  BUTTON TEXT     █ │  ← Fill: Primary/Secondary/Tertiary
│ ████████████████████ │
└────────────────────────┘  ← BorderDark (2dp bottom + right)
```

**States:**
- **Normal**: Raised bevel — light top-left, dark bottom-right, full accent fill.
- **Pressed**: Sunken bevel (reversed) — dark top-left, light bottom-right. Content shifts down-right by 2dp. This mimics an actual button being pushed in.
- **Disabled**: Fill becomes `SurfaceVariant`, text becomes `OnSurfaceVariant`, borders become `BorderMid`.

**Color Variants:**
| Variant | Fill | Text | Use |
|---------|------|------|-----|
| Primary | `#3DFF6E` (Pixel Green) | `#0B0C1A` (Background) | Main actions: Start, Confirm, Complete |
| Secondary | `#FF4757` (Hot Red) | `#FFFFFF` | Destructive / intense: Skip, Stop, Delete |
| Tertiary | `#00D4FF` (Cyan) | `#0B0C1A` | Info actions: YouTube, Library, Details |
| Ghost | `Transparent` + border | `OnSurface` | Low-priority: Cancel, Back |
| Gold | `#FFD700` (XP Gold) | `#0B0C1A` | Special: Achievement, Reward |

**Font**: Press Start 2P, 10-12sp, ALL CAPS.

### 5.2 PixelCard (Exercise Card / Slot Machine Card)

```
╔══════════════════════════════════════╗
║  ┌──────────────────────────────┐   ║  ← Outer bevel border
║  │  EXERCISE NAME          ⭐  │   ║  ← Title in Press Start 2P
║  │  ───────────────────────── │   ║  ← Pixel divider line
║  │  3 x 12 reps               │   ║  ← Details in Silkscreen
║  │  Muscle: Chest              │   ║
║  │                             │   ║
║  │  [RE-ROLL]  [▶ YT]  [♥]   │   ║  ← Action buttons
║  └──────────────────────────────┘   ║
╚══════════════════════════════════════╝
```

- Outer border: 3dp beveled (light top-left, dark bottom-right)
- Inner content area: 8dp padding
- Title bar: Slightly different background shade or subtle top highlight
- Pixel divider: A 1dp dashed line made of small pixel segments (or a solid 2dp line in `BorderMid` color)

### 5.3 PixelProgressBar (Health Bar Style)

```
┌───────────────────────────────────────┐
│ ██ ██ ██ ██ ██ ██ ░░ ░░ ░░ ░░ │  ← Segmented blocks
└───────────────────────────────────────┘
  ████ = filled     ░░░░ = empty
```

- **Segmented**: Divide the bar into discrete blocks (like a health bar). Each block represents a set or percentage chunk.
- **Fill color**: Gradient from `Primary` (green) to `XPGold` (yellow) as it gets full.
- **Empty color**: `SurfaceVariant` with low opacity.
- **Border**: Thin 2dp pixel bevel around the entire bar.
- **Height**: 12-16dp.
- **Label**: Show "SET 3/5 · 60%" above or beside in `labelMedium`.

### 5.4 Timer Display

```
┌─────────────────────┐
│                     │
│     0 1 : 2 5      │  ← Press Start 2P, ~32sp, Primary color
│                     │
│   ████████████░░░   │  ← Pixel progress bar
│                     │
│    [ S K I P ]      │  ← Button
│    [+30 SEC]        │
└─────────────────────┘
```

- Timer numbers in Press Start 2P, large (~24-32sp), in `Tertiary` (cyan) or `Primary` (green).
- Colon separator blinks (opacity animation, 0.5s interval).
- Background: Semi-transparent dark overlay panel with thick pixel border.
- Circular progress replaced with a **horizontal segmented pixel bar** (better fits retro aesthetic).

### 5.5 Navigation Bar

```
┌────────┬────────┬────────┬────────┬────────┐
│  🏠   │  ⚔️   │  📜   │  📚   │  ⚙️   │
│ HOME  │ QUEST │  LOG  │ CODEX │ OPTS  │
└────────┴────────┴────────┴────────┴────────┘
```

- Replace material bottom nav with a pixel-paneled bar.
- **Rename tabs** for gamification:
  - Home → "HOME" or "BASE"
  - Session → "QUEST" (workout as a quest!)
  - History → "LOG" (adventure log)
  - Library → "CODEX" (knowledge codex)
  - Settings → "OPTS" (options)
- Each icon slot: pixelated icon (can use emoji initially, replace with pixel art drawable later).
- Selected tab: Bright accent glow (use `Primary` color tint), slightly "pressed in" look.
- Unselected: Dim (`OnSurfaceVariant`).
- Font: Press Start 2P at 8sp for labels.

### 5.6 Streak / XP Banner

```
┌══════════════════════════════════════════┐
│  🔥 S T R E A K : 1 2  D A Y S  🔥    │
│  ████████████████████░░░░░░░░           │
│  LVL 5 WARRIOR  ·  2400 XP             │
└══════════════════════════════════════════┘
```

- Gold border with fire emoji accents.
- Press Start 2P for streak count.
- Pixel progress bar showing progress to "next level" (purely cosmetic gamification).
- The streak counter could "pulse" or have a subtle glow animation.

### 5.7 Slot Machine / Exercise Reveal

The current slot machine card is already gamified — enhance it:
- Panel border: Thick beveled border in `XPGold` color.
- "Rolling" animation: Vertical pixel scroll effect (text scrolling up like an actual slot reel).
- Landing: Brief screen shake (1-2 frames) + retro "ding!" sound.
- Background: Slight sparkle/particle effect using a few animated pixel dots.

### 5.8 Dialogs / Modals

```
╔══════════════════════════════════════╗
║  ▶ TITLE BAR                       ║  ← Darker background, Press Start 2P
╠══════════════════════════════════════╣
║                                      ║
║  Dialog content text here in         ║  ← Silkscreen, body text
║  the main content area.              ║
║                                      ║
║     [CONFIRM]    [CANCEL]           ║  ← PixelButtons
║                                      ║
╚══════════════════════════════════════╝
```

- Scrim: Semi-transparent `Background` (80% opacity) — like Undertale's dark transition.
- Panel: 4dp beveled border.
- Title bar: Slightly darker strip at the top with a cursor arrow icon `▶`.

### 5.9 Week Strip / Calendar

```
┌────┬────┬────┬────┬────┬────┬────┐
│ M  │ T  │ W  │ T  │ F  │ S  │ S  │
│ ✓  │ ✓  │ 🧘 │ ✓  │    │ ✗  │    │
└────┴────┴────┴────┴────┴────┴────┘
```

- Each day is a small pixel-bordered cell.
- Completed: `CompletedGreen` fill with ✓ pixel icon.
- Missed: `MissedRed` tint with ✗.
- Today: Blinking cursor-style highlight.
- Mobility: `PotionPurple` tint with 🧘.
- Rest: `RestDayGray` fill with dash.

---

## 6. Sound Design

### Sound Generation

Use **jsfxr** (https://sfxr.me/) to generate all 8-bit sound effects. Export as `.wav` files at 44kHz, 8-bit. Places in `res/raw/`.

### Sound Library

| Sound | File | Description | jsfxr Preset Base |
|-------|------|-------------|-------------------|
| Button Tap | `sfx_tap.wav` | Short, crisp 8-bit click | "Click" generator |
| Exercise Complete | `sfx_complete.wav` | Coin pickup / level-up ding | "Pickup/Coin" generator |
| Set Complete | `sfx_set_done.wav` | Short triumph note (ascending 3-note) | "Powerup" generator |
| Workout Complete | `sfx_victory.wav` | Victory jingle / fanfare (5-note) | "Powerup" generator (longer) |
| Timer Tick | `sfx_tick.wav` | Soft retro metronome tick | "Blip/Select" generator (low) |
| Timer Warning | `sfx_warning.wav` | Faster/urgent tick pattern | "Blip/Select" (higher pitch) |
| Re-roll | `sfx_reroll.wav` | Slot machine / dice tumble sound | "Random" or "Synth Tone" |
| Skip | `sfx_skip.wav` | Quick swoosh / whoosh | Custom "Laser/Shoot" (softer) |
| Error | `sfx_error.wav` | Low buzz / reject sound | "Hit/Hurt" generator |
| Favorite Toggle | `sfx_favorite.wav` | Sparkle / star collect | "Pickup/Coin" (higher) |
| Navigation | `sfx_nav.wav` | Short blip on tab switch | "Blip/Select" generator |
| Streak Milestone | `sfx_streak.wav` | Celebration ascending tones | "Powerup" generator (celebratory) |

### Sound Implementation

```kotlin
/**
 * RetroSoundManager — manages 8-bit sound effect playback using SoundPool.
 * SoundPool provides low-latency audio ideal for short sound effects.
 */
class RetroSoundManager(context: Context) {
    private val soundPool: SoundPool = SoundPool.Builder()
        .setMaxStreams(4)
        .setAudioAttributes(
            AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_GAME)    // Game audio!
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
        )
        .build()

    // Load all sounds into memory at init
    private val tapSound = soundPool.load(context, R.raw.sfx_tap, 1)
    private val completeSound = soundPool.load(context, R.raw.sfx_complete, 1)
    // ... etc.

    fun playTap() = soundPool.play(tapSound, 0.5f, 0.5f, 1, 0, 1f)
    fun playComplete() = soundPool.play(completeSound, 0.7f, 0.7f, 1, 0, 1f)
    // ... etc.

    fun release() = soundPool.release()
}
```

### Sound Replacement Note

The current app uses `ToneGenerator` for feedback (added in a previous feature). Replace `ToneGenerator` with `RetroSoundManager` calls. The `doFeedback` lambda in `WorkoutSessionScreen` should call `retroSoundManager.playTap()` (or appropriate variant) instead of `ToneGenerator.TONE_PROP_BEEP`.

---

## 7. Animation Guidelines

### Retro Animation Principles

1. **Stepped, not smooth**: Prefer `tween` with `LinearEasing` or `snap` specs. Avoid springy physics-based animations which feel too modern.
2. **Frame-rate feel**: Some animations should feel like they're running at 10-15fps (stepped alpha changes, position jumps) for retro authenticity.
3. **Quick and punchy**: Durations of 100-200ms for most interactions. Maximum 400ms for screen transitions.
4. **Pixel-aligned offsets**: When animating position, move in multiples of 2dp to maintain the pixel grid feel.

### Specific Animations

| Context | Animation | Duration |
|---------|-----------|----------|
| Button press | Shift down-right 2dp + bevel invert | 50ms |
| Screen transition | Horizontal slide (snappy `tween(200)`) | 200ms |
| Exercise reveal (slot) | Vertical scroll through 3-4 exercises | 300ms |
| Progress bar fill | Block-by-block fill (step animation) | 200ms per block |
| Timer countdown | Number cross-fade | 100ms |
| Timer blink (colon) | Alpha 1.0 → 0.0 | 500ms loop |
| Streak counter | Count-up from 0 to N (arcade style) | 50ms per digit |
| Completion checkmark | Scale 0→1.2→1.0 (bounce) | 200ms |

---

## 8. Screen-by-Screen Adaptation

### 8.1 Home Screen ("BASE CAMP")

**Current state**: Material3 cards, streak banner, week strip, start workout button, resume banner.

**Retro adaptation**:
- Top banner: Large pixel-bordered panel with streak info, fires, XP/level bar.
- Week strip: Pixelated day cells with retro icons (✓, ✗, 🧘, —).
- "START QUEST" button: Large `Primary` (green) pixel button, Press Start 2P text.
- Resume banner: `XPGold` bordered alert panel — "CONTINUE YOUR QUEST?"
- Next workout type shown in a small info panel: "NEXT: PUSH DAY ⚔️"

### 8.2 Workout Session Screen ("QUEST MODE")

**Current state**: Phase-based flow (warmup → main → mobility → cooldown → summary), slot machine cards, timer, progress bar.

**Retro adaptation**:
- Phase header: "⚔️ MAIN WORKOUT" → pixel text banner across the top.
- Progress bar: Segmented HP-bar style across top of screen.
- Exercise cards: Full pixel-bordered cards with stepped corners.
- Set buttons (reps: 5, 7, 12, 15, 20, 25): Small pixel buttons in a row, each with bevel.
- Timer overlay: Dark overlay with big pixel timer numbers, segmented progress bar.
- Skip button: Red pixel button — "SKIP ▶"
- Complete button: Green pixel button — "DONE ✓"
- Summary: Quest completion screen with XP summary, arcade-style stat counters.

### 8.3 History Screen ("ADVENTURE LOG")

**Current state**: Calendar view, session list, best sets.

**Retro adaptation**:
- Calendar: Pixel-bordered grid of day cells.
- Session entries: Pixel cards with date, exercise count, duration.
- Best sets: Presented as "RECORDS" or "HIGH SCORES" — arcade leaderboard style.
- Each best set: "🏆 SQUAT — 25 REPS" in gold text.

### 8.4 Library Screen ("CODEX")

**Current state**: Exercise list with muscle group filter, search.

**Retro adaptation**:
- Search bar: Sunken pixel input field.
- Filter chips: Small pixel buttons per muscle group.
- Exercise entries: Pixel-bordered list items.
- Favorite icon: Star pixel icon in `XPGold`.

### 8.5 Settings Screen ("OPTIONS")

**Current state**: Toggle rows, sliders, selections.

**Retro adaptation**:
- Each setting: Pixel-bordered row.
- Toggle switches: Replace with retro "[ON] / OFF" styled pixel toggles.
- Duration/intensity: Pixel slider or stepped value selector.
- Per-muscle-group intensity: Pixel cards per group with step controls.

### 8.6 Onboarding Screen ("CHARACTER CREATION")

**Current state**: Step-by-step setup flow.

**Retro adaptation**:
- Frame it as "CHARACTER CREATION" — like creating an RPG character.
- Equipment selection: "CHOOSE YOUR GEAR ⚔️"
- Rest days: "REST SCHEDULE"
- Difficulty: "DIFFICULTY LEVEL" with pixel badges (Easy/Normal/Hard/Extreme).
- Each step has a pixel progress indicator at top (like quest steps).

---

## 9. Implementation Plan

### Phase 1: Foundation (Theme Layer)
**Priority: HIGHEST — Do this first, everything depends on it.**

1. **Download fonts**: `press_start_2p.ttf`, `silkscreen_regular.ttf`, `silkscreen_bold.ttf` → `res/font/`
2. **Update `Color.kt`**: Replace all color constants with the new retro palette.
3. **Update `Type.kt`**: Replace `AppTypography` with `RetroTypography` using pixel fonts.
4. **Update `Theme.kt`**: Update `DarkColorScheme` with new colors.
5. **Create `PixelComponents.kt`**: Core reusable components:
   - `PixelCornerShape` — custom stepped corner shape
   - `Modifier.pixelBorder()` — bevel border modifier
   - `PixelButton` — retro-styled button composable
   - `PixelCard` — retro-styled card composable
   - `PixelProgressBar` — segmented health-bar style progress bar
   - `PixelDivider` — retro-styled horizontal divider

### Phase 2: Sounds
**Priority: HIGH — The retro feel is 50% visual, 50% audio.**

1. **Generate sounds**: Use jsfxr to create all 12 sound effects listed in Section 6.
2. **Place in `res/raw/`**: All `.wav` files.
3. **Create `RetroSoundManager.kt`**: SoundPool-based manager.
4. **Replace `ToneGenerator`**: Update `doFeedback` in `WorkoutSessionScreen` to use `RetroSoundManager`.
5. **Add navigation sounds**: Tab switches, button taps throughout the app.

### Phase 3: Screen Updates
**Priority: MEDIUM — Apply the new components screen by screen.**

Order (by usage frequency):
1. **HomeScreen.kt** — Streak banner, week strip, start button.
2. **WorkoutSessionScreen.kt** — Exercise cards, timer, progress bar, buttons.
3. **TimerComponents.kt** — Timer overlay, progress bar, rest timer.
4. **SlotMachineCard.kt** — Exercise reveal card, action buttons.
5. **HistoryScreen.kt** — Calendar, session list, best sets.
6. **LibraryScreen.kt** — Search, filter chips, exercise list.
7. **SettingsScreen.kt** — Toggle rows, sliders, sections.
8. **OnboardingScreen.kt** — Setup wizard / character creation.

### Phase 4: Polish
**Priority: LOW — Refinement after core is done.**

1. **Animations**: Add stepped animations per Section 7.
2. **Navigation bar**: Custom pixel-styled bottom navigation.
3. **StreakBanner.kt**: New retro streak/XP display.
4. **CalendarComponents.kt**: Pixelated day cells.
5. **MuscleGroupDiagram.kt**: Consider pixel art overlay / retro styling.

---

## 10. Resources & Dependencies

### Fonts (Free, OFL Licensed)

| Font | Download URL |
|------|-------------|
| Press Start 2P | `https://fonts.google.com/specimen/Press+Start+2P` → Download family → extract `.ttf` |
| Silkscreen | `https://fonts.google.com/specimen/Silkscreen` → Download family → extract Regular + Bold `.ttf` |

### Sound Generation

| Tool | URL | Notes |
|------|-----|-------|
| jsfxr | `https://sfxr.me/` | Free online 8-bit sound generator. Use preset buttons then fine-tune. Export as `.wav`. |
| Freesound | `https://freesound.org/search/?q=8-bit` | Free CC0/CC-BY sound effects if jsfxr isn't sufficient. |
| Chiptone | `https://sfbgames.itch.io/chiptone` | Alternative to jsfxr with more controls. |

### No Additional Gradle Dependencies Required

The entire retro UI can be built with **existing Compose APIs**:
- `Canvas` / `drawBehind` / `drawWithContent` — for custom pixel borders
- `Path` / `GenericShape` — for stepped corner shapes
- `drawRect` / `drawLine` / `drawPath` — for bevel effects
- `SoundPool` — already in Android SDK, no dependency needed
- Font loading via `res/font/` — native Compose support
- `Modifier.clip()` with custom `Shape` — for pixel-clipped components

**Optional** (only if you want polygon morphing for fun):
```gradle
implementation "androidx.graphics:graphics-shapes:1.0.1"
```

---

## 11. File Changes Map

### New Files to Create

| File | Purpose |
|------|---------|
| `res/font/press_start_2p.ttf` | Pixel heading font |
| `res/font/silkscreen_regular.ttf` | Pixel body font (Regular 400) |
| `res/font/silkscreen_bold.ttf` | Pixel body font (Bold 700) |
| `res/raw/sfx_tap.wav` | Button tap sound |
| `res/raw/sfx_complete.wav` | Exercise complete sound |
| `res/raw/sfx_set_done.wav` | Set complete sound |
| `res/raw/sfx_victory.wav` | Workout complete sound |
| `res/raw/sfx_tick.wav` | Timer tick sound |
| `res/raw/sfx_warning.wav` | Timer warning sound |
| `res/raw/sfx_reroll.wav` | Re-roll sound |
| `res/raw/sfx_skip.wav` | Skip sound |
| `res/raw/sfx_error.wav` | Error sound |
| `res/raw/sfx_favorite.wav` | Favorite toggle sound |
| `res/raw/sfx_nav.wav` | Navigation tab sound |
| `res/raw/sfx_streak.wav` | Streak milestone sound |
| `ui/theme/PixelComponents.kt` | PixelCornerShape, PixelButton, PixelCard, PixelProgressBar, pixelBorder modifier |
| `ui/components/RetroSoundManager.kt` | SoundPool-based 8-bit sound manager |

### Files to Modify

| File | Changes |
|------|---------|
| `ui/theme/Color.kt` | Replace all colors with retro palette |
| `ui/theme/Type.kt` | Replace Typography with pixel fonts |
| `ui/theme/Theme.kt` | Update DarkColorScheme mappings |
| `ui/screens/home/HomeScreen.kt` | Apply PixelCard, PixelButton, retro streak display |
| `ui/screens/session/WorkoutSessionScreen.kt` | PixelCards, PixelButtons, new progress bar, retro sounds |
| `ui/components/TimerComponents.kt` | Pixel timer display, segmented progress bar, retro overlay |
| `ui/components/SlotMachineCard.kt` | Pixel-bordered exercise card, bevel buttons |
| `ui/components/StreakBanner.kt` | Retro XP/streak display |
| `ui/components/CalendarComponents.kt` | Pixel day cells, retro week strip |
| `ui/screens/history/HistoryScreen.kt` | "Adventure Log" styling, high-score best sets |
| `ui/screens/library/LibraryScreen.kt` | "Codex" styling, pixel search/filter |
| `ui/screens/settings/SettingsScreen.kt` | "Options" styling, retro toggles |
| `ui/screens/onboarding/OnboardingScreen.kt` | "Character Creation" framing, pixel steps |
| `ui/navigation/NavGraph.kt` | Custom pixel bottom navigation bar |

### Files Unchanged

| File | Reason |
|------|--------|
| All ViewModels | Business logic unchanged |
| All data layer files | Database, entities, DAOs unchanged |
| All engine files (SlotMachineEngine, etc.) | Logic unchanged |
| `build.gradle` files | No new dependencies required (unless you want graphics-shapes) |
| `AndroidManifest.xml` | No changes needed |
| All JSON data files | Exercise data unchanged |

---

## Appendix A: Quick Visual Mockup (ASCII)

### Home Screen — Retro

```
╔══════════════════════════════════════════╗
║ 🔥  S T R E A K : 1 2  D A Y S  🔥    ║
║ ████████████████████░░░░░░              ║
║ LVL 5  ·  WARRIOR  ·  2400 XP          ║
╚══════════════════════════════════════════╝

┌────┬────┬────┬────┬────┬────┬────┐
│ ✓  │ ✓  │ 🧘 │ ✓  │ ▶  │    │    │
│ M  │ T  │ W  │ T  │ F  │ S  │ S  │
└────┴────┴────┴────┴────┴────┴────┘

╔══════════════════════════════════════════╗
║  NEXT QUEST: PUSH DAY  ⚔️              ║
║  Chest · Shoulders · Triceps            ║
║                                          ║
║  Estimated: ~45 min                      ║
║                                          ║
║      ┌─────────────────────────┐         ║
║      │   S T A R T  Q U E S T │         ║
║      └─────────────────────────┘         ║
╚══════════════════════════════════════════╝

┌────────┬────────┬────────┬────────┬──────┐
│  BASE  │ QUEST  │  LOG   │ CODEX  │ OPTS │
└────────┴────────┴────────┴────────┴──────┘
```

### Exercise Card — Retro

```
╔══════════════════════════════════════════╗
║  ▶ B E N C H  P R E S S     ⭐        ║
║  ──────────────────────────────────     ║
║  Sets: 3  ·  Reps: 12  ·  Chest        ║
║                                          ║
║  [5] [7] [12] [15] [20] [25]           ║
║                                          ║
║  [ RE-ROLL 🎲 ]  [ ▶ YT ]  [ ♥ ]     ║
╚══════════════════════════════════════════╝
```

---

## Appendix B: Color Comparison (Old vs New)

| Role | Old Color | New Color | Hex |
|------|-----------|-----------|-----|
| Primary | Purple #6C63FF | Pixel Green | #3DFF6E |
| Secondary | Red #FF6B6B | Hot Red | #FF4757 |
| Tertiary | Teal #4ECDC4 | Electric Cyan | #00D4FF |
| Background | #121212 | Deep Void | #0B0C1A |
| Surface | #1E1E2E | Dark Indigo | #151630 |
| SurfaceVariant | #2A2A3C | Lighter Indigo | #1E2045 |
| CardSurface | #252540 | Raised Blue | #252860 |
| OnBackground | #EEEEEE | CRT Phosphor | #E8E8F0 |
| StreakOrange | #FF9800 | Streak Fire | #FF8C00 |

---

*This document is the complete design specification for the PIXEL FORGE retro UI revamp. Implementation should follow the phased plan in Section 9. All existing app functionality MUST remain unchanged — this is a purely visual transformation.*

---

## Changes (v2 — Pastel Cheerful Palette)

### Color Palette Overhaul
Replaced the Stardew Valley purple/green palette with a cohesive pastel theme. See `reference-data/color-palette-spec.md` for full specification.

Key changes:
- Background: `#1B1425` (dark purple) → `#1E1E2E` (deep navy)
- Primary: `#82C850` (crop green) → `#A8D8B9` (soft mint)
- Secondary: `#E04040` (barn red) → `#F4A0A0` (warm rose)
- Tertiary: `#6DC2FF` (sky blue) → `#A0C4F4` (periwinkle)
- XPGold: `#FFCF48` → `#F4D88C` (pastel gold)
- All utility colors updated to match pastel theme

### UI Changes
1. **HOME SCREEN**: Removed "BASE CAMP" subtitle text
2. **SLOT MACHINE**: Favorite button changed from PixelButton with "♥"/"♡" text to heart-shaped IconButton (filled/outline) that turns rose when selected
3. **LIBRARY/CODEX**: Favorite button replaced with heart IconButton; Mobility tab now expandable with full details (body region, target tissue, measurement, equipment, unilateral, source, video button)
4. **CALENDAR**: Completed days now show "🔥" flame emoji; Perfect weeks get gold border highlight; Perfect months get "⭐ PERFECT MONTH ⭐" banner
5. **SETTINGS**: Mobility slider replaced with PixelSlider (retro-themed segmented bar); Toggle switches now play chunky switch sound + haptic
6. **ONBOARDING**: Mobility slider replaced with PixelSlider
7. **ALL BUTTONS**: Haptic feedback now enabled by default on all PixelButtons

### New Components
- `PixelSlider`: Retro-themed segmented slider with sunken pixel border, clickable segments

---

## Changes (v3 — M3-Informed Contrast & Feedback)

### Color & Contrast
1. **Container colors added**: PrimaryContainer (#1E3828), SecondaryContainer (#3D2828), TertiaryContainer (#1E2838) with matching On-variants
2. **PixelSelectableChip selected fill**: `Primary.copy(alpha=0.15f)` → `PrimaryContainer` — higher contrast for active state
3. **FilterChip selected state**: All FilterChips across SettingsScreen and LibraryScreen now use `PrimaryContainer`/`OnPrimaryContainer`
4. **Video buttons**: Changed from pale red (`Secondary.copy(alpha=0.2f)`) to blue (`TertiaryContainer`/`OnTertiaryContainer`)
5. **Exclude buttons**: Changed from pale red to muted rose (`SecondaryContainer`/`OnSecondaryContainer`)
6. **Favorite icon**: Color changed from Secondary (red) to FavoriteGold when active
7. **Calendar missed days**: Removed `MissedRed.copy(alpha=0.15f)` tint — past non-completed training days no longer highlighted red

### Navigation Bar
- Padding increased: `vertical=4.dp` → `vertical=8.dp` for larger touch targets
- Active tab: now uses PrimaryContainer fill via PixelSelectableChip (was faint Primary tint)

### Calendar
- Month navigation title: `AnimatedContent` with slide+fade transition (was static text)
- Crown pixel art icon (`ic_crown_pixel.xml`) marks the first-ever workout day
- `firstSessionDate` parameter prevents marking dates before app setup
- `ic_flame_pixel.xml` redesigned: proper teardrop flame (pointed tip, 9px wide middle, 4 color layers)

### EXCLUDED Badge
- Changed from "EXCLUDED" text to compact `✗` symbol to prevent row height increase

### Mobility Tab
- Favorites filter chip (♥ FAVORITES) added for mobility tab in Codex

### Interaction Feedback
- Timer +/- buttons: now produce sound (`sfx_tap` at 0.3 vol) + haptic VIRTUAL_KEY
- Session preference +/- buttons: now produce sound + haptic
- Favorite hearts in Library: produce `sfx_favorite` (toggle on) or `sfx_toggle` (toggle off) + haptic LONG_PRESS
- Favorite in SlotMachineCard: same differentiated sound

### Mobility Slider
- Material3 Slider for exercises-per-session now wrapped in `pixelBorderSunken()` box (Settings + Onboarding)
- Preserves drag functionality while maintaining pixel aesthetic

### Spacing Uniformity
- HistoryScreen header padding aligned to LibraryScreen pattern: `padding(16.dp, 16.dp, 16.dp, 0.dp)`

### New Design Reference Documents
- `animation-design-spec.md`: Spring parameters, duration tiers, component animation catalog
- `color-palette-spec.md` v3: M3-informed container colors, contrast verification, color pairing rules
- `sound-design-spec.md` v3: Sound-action mapping, volume hierarchy, comprehensive feedback coverage
