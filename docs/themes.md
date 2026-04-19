# RNGredients — Retro Game Theme Palettes

> **Build reference.** Color palettes for the theme selector.
> Each theme is a complete palette: background, surface, text, primary action, secondary, accent, success, warning, error.
> Related: [tree.md](tree.md) §6 (Settings → Theme selector)

---

## How to Use These Palettes

Each theme defines these CSS variable slots:

```css
:root {
  --bg-primary:    /* main page background */
  --bg-secondary:  /* cards, panels, surfaces */
  --bg-tertiary:   /* input fields, subtle areas */
  --text-primary:  /* main text */
  --text-secondary:/* muted text, labels */
  --accent-1:      /* primary action (Roll button, CTA) */
  --accent-2:      /* secondary action (Heart, links) */
  --accent-3:      /* highlights, badges, tags */
  --success:       /* done, locked in, positive */
  --warning:       /* expiry, low stock, re-roll */
  --error:         /* blocked, allergens, critical */
  --border:        /* borders, dividers */
}
```

---

## 1. Game Boy (Original)

Inspired by the 4-shade green of the DMG Game Boy (1989).

```
--bg-primary:    #0F380F   /* darkest green */
--bg-secondary:  #306230   /* dark green */
--bg-tertiary:   #8BAC0F   /* light green */
--text-primary:  #9BBC0F   /* lightest green (classic GB screen) */
--text-secondary:#8BAC0F
--accent-1:      #9BBC0F   /* Roll button */
--accent-2:      #8BAC0F   /* Heart */
--accent-3:      #306230
--success:       #9BBC0F
--warning:       #8BAC0F
--error:         #306230
--border:        #306230
```

Preview: 🟩🟩🟢🟢 — monochrome green CRT feel

---

## 2. NES / Famicom

Based on the NES hardware palette — bold primaries, dark background.

```
--bg-primary:    #000000   /* black */
--bg-secondary:  #1D2B53   /* dark navy */
--bg-tertiary:   #29366F
--text-primary:  #FFFFFF   /* white */
--text-secondary:#7E7E7E   /* NES gray */
--accent-1:      #FF004D   /* NES red (Mario red) */
--accent-2:      #29ADFF   /* NES blue (Mega Man) */
--accent-3:      #FFEC27   /* NES yellow (coins) */
--success:       #00E436   /* NES green (Luigi) */
--warning:       #FFA300   /* NES orange (fire flower) */
--error:         #FF004D   /* NES red */
--border:        #7E7E7E
```

Preview: Pure 8-bit Nintendo — Mario vibes

---

## 3. SNES / Super Famicom

Richer palette than NES — inspired by Chrono Trigger, Zelda: A Link to the Past.

```
--bg-primary:    #1A1A2E   /* deep indigo */
--bg-secondary:  #16213E   /* midnight blue */
--bg-tertiary:   #0F3460
--text-primary:  #E8E8E8   /* off-white */
--text-secondary:#A8A8B8
--accent-1:      #E94560   /* SNES magenta-red (action) */
--accent-2:      #533483   /* SNES purple (Chrono Trigger) */
--accent-3:      #00ADB5   /* SNES teal */
--success:       #2ECC71
--warning:       #F39C12
--error:         #E94560
--border:        #0F3460
```

Preview: Fantasy RPG — deep jewel tones

---

## 4. Sega Genesis / Mega Drive

Inspired by Sonic the Hedgehog — electric blue, bold contrast.

```
--bg-primary:    #000E2E   /* deep Sega blue */
--bg-secondary:  #0B1E4E
--bg-tertiary:   #152A68
--text-primary:  #FFFFFF
--text-secondary:#8CA0C8
--accent-1:      #0060DF   /* Sonic blue (Roll button) */
--accent-2:      #FFD700   /* Ring gold */
--accent-3:      #DC143C   /* Knuckles red */
--success:       #00C853   /* emerald green */
--warning:       #FFD700   /* gold rings */
--error:         #DC143C
--border:        #152A68
```

Preview: Gotta go fast — speed and gold

---

## 5. Pokémon Red/Blue

Inspired by Gen 1 UI colors — clean, friendly, nostalgic.

```
--bg-primary:    #F8F8F8   /* Pokédex white */
--bg-secondary:  #FFFFFF
--bg-tertiary:   #E8E8E8
--text-primary:  #383838   /* dark text */
--text-secondary:#686868
--accent-1:      #DC0A2D   /* Pokémon red */
--accent-2:      #3B4CCA   /* Pokémon blue */
--accent-3:      #FFDE00   /* Pikachu yellow */
--success:       #4DAD5B   /* grass type */
--warning:       #F08030   /* fire type */
--error:         #DC0A2D
--border:        #D0D0D0
```

Preview: Light mode — clean Pokédex interface

---

## 6. Legend of Zelda (NES)

Based on the original Zelda overworld — earthy greens and dungeon browns.

```
--bg-primary:    #2C1E0F   /* dungeon brown */
--bg-secondary:  #3A2A14
--bg-tertiary:   #4A3A1F
--text-primary:  #FCBCB0   /* Zelda peach/skin text */
--text-secondary:#C89068
--accent-1:      #00A800   /* overworld green (action) */
--accent-2:      #0070EC   /* blue ring / sword beam */
--accent-3:      #FC9838   /* rupee orange */
--success:       #00A800   /* green = go */
--warning:       #FC9838   /* orange rupee */
--error:         #A81000   /* damage red */
--border:        #685830
```

Preview: Hyrule dungeon — earthy adventure feel

---

## 7. Street Fighter II

Inspired by the VS screen, character select, and health bars.

```
--bg-primary:    #0C0C1E   /* dark arena */
--bg-secondary:  #1A1A3E
--bg-tertiary:   #252552
--text-primary:  #FFFFFF
--text-secondary:#A0A0C0
--accent-1:      #FF6600   /* Ryu fireball orange (Roll) */
--accent-2:      #0088FF   /* Chun-Li blue */
--accent-3:      #FFCC00   /* VS screen yellow */
--success:       #00CC44   /* health bar green */
--warning:       #FFCC00   /* low health yellow */
--error:         #FF0033   /* KO red */
--border:        #252552
```

Preview: Arcade fighter — bold and loud

---

## 8. Pac-Man

Classic arcade — dark background with neon on black.

```
--bg-primary:    #000000   /* arcade black */
--bg-secondary:  #0A0A1A
--bg-tertiary:   #141428
--text-primary:  #FFFFFF
--text-secondary:#AAAAAA
--accent-1:      #FFFF00   /* Pac-Man yellow (Roll) */
--accent-2:      #FF69B4   /* ghost pink (Pinky) */
--accent-3:      #00FFFF   /* ghost cyan (Inky) */
--success:       #00FF00   /* power pellet green */
--warning:       #FFA500   /* ghost orange (Clyde) */
--error:         #FF0000   /* ghost red (Blinky) */
--border:        #333366
```

Preview: Waka waka — neon on dark

---

## 9. Tetris

Inspired by the Game Boy Tetris and NES Tetris color schemes.

```
--bg-primary:    #0B0B1A   /* deep space */
--bg-secondary:  #12122A
--bg-tertiary:   #1A1A3A
--text-primary:  #E0E0E0
--text-secondary:#8080A0
--accent-1:      #00F0F0   /* I-piece cyan (Roll) */
--accent-2:      #F0A000   /* L-piece orange */
--accent-3:      #A000F0   /* T-piece purple */
--success:       #00F000   /* S-piece green */
--warning:       #F0F000   /* O-piece yellow */
--error:         #F00000   /* Z-piece red */
--border:        #303050
```

Preview: Falling blocks — each accent is a Tetris piece

---

## 10. Final Fantasy (SNES Era)

Based on FF4/FF6 menus — iconic blue gradient with white text.

```
--bg-primary:    #000040   /* FF menu dark blue */
--bg-secondary:  #000080   /* FF menu mid blue */
--bg-tertiary:   #0000A0
--text-primary:  #FFFFFF   /* crisp white menu text */
--text-secondary:#B0B0FF
--accent-1:      #FFD700   /* gold (action / gil) */
--accent-2:      #FF6347   /* fire spell red */
--accent-3:      #00CED1   /* ice spell blue */
--success:       #7CFC00   /* cure green */
--warning:       #FFD700   /* caution gold */
--error:         #FF4040   /* damage red */
--border:        #4040C0   /* FF border blue */
```

Preview: Classic JRPG menu — the blue window everyone knows

---

## 11. Castlevania (NES)

Gothic horror — dark purples, blood reds, stone grays.

```
--bg-primary:    #0E0B16   /* castle darkness */
--bg-secondary:  #1A1425
--bg-tertiary:   #2D2240
--text-primary:  #D4C5A9   /* parchment */
--text-secondary:#8A7A6A
--accent-1:      #C02040   /* blood red (Roll) */
--accent-2:      #6B3FA0   /* purple candle flame */
--accent-3:      #DAA520   /* gold cross */
--success:       #50C878   /* wall chicken green */
--warning:       #DAA520   /* gold */
--error:         #C02040   /* blood red */
--border:        #3A2D50
```

Preview: Gothic whip-cracking dungeon vibes

---

## 12. Mega Man

Based on Mega Man 2 — clean blues, bold stage-select energy.

```
--bg-primary:    #0A0A2A   /* title screen dark */
--bg-secondary:  #101040
--bg-tertiary:   #181860
--text-primary:  #FFFFFF
--text-secondary:#8888CC
--accent-1:      #00A2E0   /* Mega Man blue (Roll) */
--accent-2:      #E8E800   /* energy yellow */
--accent-3:      #E06020   /* fire man orange */
--success:       #20C020   /* E-tank green */
--warning:       #E8E800   /* yellow */
--error:         #E02020   /* health bar red */
--border:        #303080
```

Preview: Blue bomber — energetic and heroic

---

## 13. Earthbound / Mother 2

Psychedelic and quirky — purple, teal, hot pink.

```
--bg-primary:    #1B0030   /* trippy purple-black */
--bg-secondary:  #2A0050
--bg-tertiary:   #3D0070
--text-primary:  #FFFFFF
--text-secondary:#CBA6FF
--accent-1:      #FF71CE   /* hot pink (PSI attack) */
--accent-2:      #01CDFE   /* cyan */
--accent-3:      #05FFA1   /* neon green */
--success:       #05FFA1   /* green glow */
--warning:       #FFFB96   /* Earthbound yellow */
--error:         #FF3860   /* HP damage */
--border:        #6B30A0
```

Preview: Funky psychedelic RPG — vaporwave ancestor

---

## 14. Donkey Kong Country (SNES)

Jungle-rendered — deep greens, warm browns, banana yellow.

```
--bg-primary:    #0D1B0E   /* deep jungle */
--bg-secondary:  #1A2E1C
--bg-tertiary:   #2A4A2C
--text-primary:  #F0E8D0   /* light bark */
--text-secondary:#A0C090
--accent-1:      #FFD700   /* banana yellow (Roll) */
--accent-2:      #8B4513   /* barrel brown */
--accent-3:      #DC143C   /* DK's tie red */
--success:       #32CD32   /* jungle green */
--warning:       #FFD700   /* banana */
--error:         #DC143C   /* red */
--border:        #3A5A3A
```

Preview: Pre-rendered jungle — lush and warm

---

## 15. PICO-8

Based on the PICO-8 fantasy console's fixed 16-color palette — indie pixel-art darling.

```
--bg-primary:    #000000   /* black */
--bg-secondary:  #1D2B53   /* dark blue */
--bg-tertiary:   #7E2553   /* dark purple */
--text-primary:  #FFF1E8   /* light peach */
--text-secondary:#C2C3C7   /* light gray */
--accent-1:      #FF004D   /* red (Roll) */
--accent-2:      #29ADFF   /* blue */
--accent-3:      #FFEC27   /* yellow */
--success:       #00E436   /* green */
--warning:       #FFA300   /* orange */
--error:         #FF004D   /* red */
--border:        #5F574F   /* dark gray */
```

Preview: 16-color indie gem — the modern retro standard

---

## Theme Selector UI Spec

```
┌──────────────────────────────────────────────────┐
│  🎨 Choose Your Theme                            │
│                                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ ██████  │ │ ██████  │ │ ██████  │            │
│  │ Game Boy│ │   NES   │ │  SNES   │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ ██████  │ │ ██████  │ │ ██████  │            │
│  │  Sega   │ │ Pokémon │ │  Zelda  │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ ██████  │ │ ██████  │ │ ██████  │            │
│  │ StFtr II│ │ Pac-Man │ │ Tetris  │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ ██████  │ │ ██████  │ │ ██████  │            │
│  │Final Fnt│ │Castlevni│ │Mega Man │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ ██████  │ │ ██████  │ │ ██████  │            │
│  │Earthbnd │ │   DKC   │ │ PICO-8  │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│                                                   │
│  Preview: [live mini-preview of main screen]      │
│                                                   │
│  [✅ Apply Theme]                                 │
└──────────────────────────────────────────────────┘
```

Each swatch card shows 4–5 colors from the palette in a horizontal bar. Tapping a card loads a live preview below. "Apply Theme" saves to player preferences and applies CSS variables globally.

---

## Theme Data Model

```json
{
  "id": "final_fantasy",
  "display_name": "Final Fantasy",
  "era": "SNES",
  "preview_colors": ["#000040", "#000080", "#FFD700", "#FFFFFF", "#FF6347"],
  "variables": {
    "bg-primary": "#000040",
    "bg-secondary": "#000080",
    "bg-tertiary": "#0000A0",
    "text-primary": "#FFFFFF",
    "text-secondary": "#B0B0FF",
    "accent-1": "#FFD700",
    "accent-2": "#FF6347",
    "accent-3": "#00CED1",
    "success": "#7CFC00",
    "warning": "#FFD700",
    "error": "#FF4040",
    "border": "#4040C0"
  }
}
```
