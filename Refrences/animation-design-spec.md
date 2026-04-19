# RNGym — Animation Design Language

## Philosophy

Animations should feel like a retro game UI: responsive, satisfying, and slightly exaggerated. Every interaction should feel "alive" with spring-based bounce and snappy transitions. Animations reinforce the pixel art aesthetic — no smooth bezier curves that feel out of place. Prefer spring physics over tween/ease for organic feel.

### Core Principles
1. **Immediate response**: Animation starts on the SAME frame as input — no delay.
2. **Spring over ease**: Use spring physics for interactive elements (buttons, toggles). Easing for ambient/decorative animations.
3. **Bouncy overshoot**: Selected states spring to 5-15% overshoot then settle. Gives "juice."
4. **Quick in, gentle out**: Press feedback is instant (50-80ms), release/settle is slower (200-400ms).
5. **Consistent duration tiers**: Small = 100-200ms, Medium = 200-350ms, Large = 350-600ms.
6. **Pixel snapping**: Scale animations use whole/half increments where possible to avoid sub-pixel blur.

---

## Spring Specifications

### Button Press Spring
- **Use**: PixelButton, PixelIconButton, PixelSelectableChip taps
- **Scale**: Press to 0.92, release to 1.0
- **Spring**: dampingRatio = 0.5 (underdamped/bouncy), stiffness = 800
- **Duration**: ~180ms total (press + bounce + settle)

### Toggle Spring
- **Use**: Favorite heart, exclude toggle, filter chip selection
- **Scale**: Quick scale to 1.2, settle to 1.0
- **Spring**: dampingRatio = 0.4, stiffness = 600  
- **Duration**: ~250ms total

### Card Appear Spring
- **Use**: SlotMachineCard reveal, exercise card list items
- **Scale**: Start 0.95, spring to 1.0
- **Alpha**: Start 0.0, animate to 1.0 over 200ms
- **Offset**: Start +8dp Y, spring to 0

### Navigation Transition
- **Use**: Tab switching, screen transitions
- **Type**: Crossfade with slide
- **Duration**: 200ms
- **Easing**: FastOutSlowIn

---

## Component Animation Catalog

### PixelButton
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Press down | Scale 1.0 → 0.92 | Instant (spring) |
| Release | Scale 0.92 → 1.0 with overshoot to 1.05 | ~200ms spring |
| Sound | playTap() on press | — |
| Haptic | HapticFeedbackType.LongPress on press | — |

### PixelIconButton
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Press down | Scale 1.0 → 0.85 | Instant (spring) |
| Release | Scale 0.85 → 1.0 with bounce | ~200ms spring |
| Sound | Context-specific sound on press | — |
| Haptic | HapticFeedbackType.LongPress on press | — |

### PixelSelectableChip (Filter Chips, Nav Tabs)
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Tap | Scale 1.0 → 0.92 → 1.0 bounce | ~200ms spring |
| Select | Background crossfade to PrimaryContainer, 150ms | 150ms |
| Sound | playNav() or playToggle() | — |
| Haptic | HapticFeedbackType.LongPress | — |

### Favorite Toggle (Heart)
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Toggle on | Scale 1.0 → 1.3 → 1.0 | ~300ms spring |
| Toggle off | Scale 1.0 → 0.8 → 1.0 | ~200ms spring |
| Sound | playFavorite() on toggle on, playToggle() on toggle off | — |
| Haptic | HapticFeedbackType.LongPress | — |

### Calendar Month Navigation Arrows
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Tap | Arrow shifts 2dp in direction + bounce back | ~200ms spring |
| Sound | playNav() | — |
| Content | Month text crossfade + slide in from direction | 200ms |

### Rest Timer Controls (+/- Buttons)
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Tap | Scale 1.0 → 0.88 → 1.0 | ~180ms spring |
| Sound | playTap() | — |
| Haptic | HapticFeedbackType.LongPress | — |
| Value Change | Number crossfade animation | 150ms |

### Slot Machine Card (Exercise Reveal)
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Reroll | Vertical slide-out (old) → slide-in (new) | 400ms |
| Sound | playReroll() during animation | — |

### Streak Banner Flame
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Idle | Gentle scale pulse 1.0 ↔ 1.08, offset y ±1dp | 1200ms infinite |
| Streak milestone | Quick scale burst 1.0 → 1.4 → 1.0 | 400ms spring |

### Progress Bar Fill
| Trigger | Animation | Duration |
|---------|-----------|----------|
| Value change | Width animates with spring | 300ms spring |
| Sound | — (silent, visual only) | — |

---

## Easing & Duration Standards

### Duration Tiers
| Tier | Range | Use |
|------|-------|-----|
| Micro | 50-100ms | Press feedback, haptic-only |
| Small | 100-200ms | Button bounce, chip select, icon press |
| Medium | 200-350ms | Card appear, tab switch, content swap |
| Large | 350-600ms | Slot machine reveal, screen transition |
| Ambient | 800-2000ms | Flame pulse, streak animation, idle effects |

### Spring Presets (Compose)
```
ButtonSpring:  dampingRatio=0.5, stiffness=800
ToggleSpring:  dampingRatio=0.4, stiffness=600
CardSpring:    dampingRatio=0.6, stiffness=400
GentleSpring:  dampingRatio=0.7, stiffness=200
```

### Easing Curves (for non-spring animations)
| Name | Use | Value |
|------|-----|-------|
| SnapIn | Press response | LinearOutSlowInEasing |
| BounceOut | Release/appear | FastOutSlowInEasing |
| Smooth | Ambient, crossfade | EaseInOutCubic |

---

## Implementation Checklist
- [ ] PixelButton: Already has bounce + sound + haptic ✓
- [ ] PixelIconButton: Already has bounce ✓ — add sound + haptic where missing
- [ ] PixelSelectableChip: Has bounce ✓ — verify sound added
- [ ] Calendar arrows: Add directional offset + bounce
- [ ] Favorite toggle: Add scale animation + sound + haptic
- [ ] Settings +/- buttons: Add bounce + sound + haptic (currently plain IconButton)
- [ ] Rest timer buttons: Add feedback
- [ ] Month text transition: Add slide + crossfade with AnimatedContent

## Change Log
- v1: Initial animation design language spec
