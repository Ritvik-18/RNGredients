# RNGredients — Features & UI Specification

> **Screen-by-screen functional spec.** What the app does, how it looks, how it behaves.
> Related: [architecture.md](architecture.md) (technical blueprint), [data.md](data.md) (all options & formulas), [themes.md](themes.md) (palettes)

---

## App Flow

```
[First Launch → Onboarding]
         ↓
[Main Screen (The Tavern)]
    ├── 🎲 ROLL button → Roll animation → Dish card
    │       ├── ❤️ Heart dish
    │       ├── 💔 Skip / Never again
    │       └── 🔁 Re-roll
    ├── 📦 Inventory (manage groceries)
    ├── 📜 Quest Log (today's meal plan)
    ├── ⚙️ Settings (edit everything)
    └── 📊 History / Favorites
```

---

## 1. Onboarding (First Launch Only)

Runs once. All choices editable later via Settings.

```
Screen 1: Welcome
  → App intro + "Start Your Adventure" CTA

Screen 2: "Your Adventure Stats" (Body)
  ├── Age (number input)
  ├── Gender (select: Male / Female / Other)
  ├── Height (input + unit toggle cm / ft'in")
  ├── Weight (input + unit toggle kg / lbs)
  └── Activity level (5 cards with descriptions)
  REF: data.md §7.1

Screen 3: "Choose Your Quest" (Fitness Target)
  ├── Visual cards: 🏃 Lose Weight (Fast/Normal/Slow), ⚖️ Maintain, 💪 Bulk (Lean/Normal/Aggressive)
  └── Shows calculated daily calorie target in real-time
  REF: data.md §7.2

Screen 4: "Meal Style" (Preference Preset)
  ├── Grid of preset cards: Balanced | High Protein | Vegan | Keto | Diabetic | Low Fat | Mediterranean | Custom
  ├── Each card: icon + macro pie chart + short description
  ├── Selecting a preset auto-fills: diet_profile + macros
  └── "Customize" button opens manual macro sliders
  REF: data.md §7.5, §2

Screen 5: "Set Your Wards" (Protections)
  ├── Allergies (multi-select from top 14 + search)
  ├── Intolerances (multi-select)
  ├── Custom exclusions (free text)
  ├── Religious diet (optional)
  └── Health conditions (optional)
  REF: data.md §2, §5, §6

Screen 6: "Daily Quest Structure" (Meals Per Day)
  ├── How many meals? (presets + custom)
  ├── Slot labels and calorie split preview
  └── Fasting window (if applicable)
  REF: data.md §3

Screen 7: "Equip Your Kitchen"
  ├── Quick-select profile: Minimal | Basic | Well-Equipped | Pro | Custom
  ├── Major appliances (checkbox grid)
  ├── Countertop tools (checkbox grid)
  └── Shows: "Based on your equipment, you can make ~X / Y recipes"
  REF: data.md §10

Screen 8: Grocery Inventory
  ├── Pantry staples pre-checked (uncheck what you DON'T have)
  ├── Add additional groceries (search + add)
  └── Set quantities and expiry (optional)
  REF: data.md §8.1, §8

Screen 9: Choose Theme
  ├── Pick a visual theme from retro game palettes
  └── Preview before confirming
  REF: themes.md

Screen 10: Review & Confirm
  ├── Summary of all choices + calculated stats:
  │     Daily Target: 2,102 kcal | Macros: 131g P / 263g C / 58g F
  │     Meals: 4 (B/L/D/S) | Per-meal breakdown preview
  └── "Enter the Tavern" button → Main Screen
```

---

## 2. Main Screen (The Tavern)

Home screen. User comes here every time they open the app.

```
┌──────────────────────────────────────────────────┐
│  🏠 RNGredients          [⚙️ Settings] [🎨 Theme] │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │         Today's Slot: LUNCH (600 kcal)       │  │
│  │       [ 🎲  ROLL FOR DISH  🎲 ]              │  │
│  │         Re-rolls remaining: 2 / 3            │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ Today: 1,430 / 2,102 kcal  (68%)            │  │
│  │ ████████████████░░░░░░░░░░░░░░░              │  │
│  │ P: 105/131g  C: 158/263g  F: 58g            │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  [📦 Inventory]  [📜 Quest Log]  [❤️ Favorites]    │
│                                                    │
│  Upcoming Slots:                                   │
│    ☐ Breakfast (done ✓)                            │
│    ☐ Lunch ← current                              │
│    ☐ Dinner                                        │
│    ☐ Snack                                         │
└──────────────────────────────────────────────────┘
```

### 2.1 The Roll Button

| Requirement | Detail |
|---|---|
| **Trigger** | User taps "ROLL FOR DISH" |
| **Animation** | Slot-machine / gacha-style recipe card spin (1–2 sec) |
| **Result** | One dish card with: name, image, cook time, calorie/macro fit, ingredient match % |
| **Re-rolls** | 3 free per meal slot per day. Counter visible. |
| **Auto-fill** | If user doesn't roll for a slot, system auto-picks best match |

### 2.2 Dish Card (Post-Roll)

```
┌────────────────────────────────────┐
│  [🖼 Dish Image]                    │
│                                    │
│  Veggie Stir Fry                   │
│  ⏱ 25 min  |  🔥 580 kcal         │
│  📦 92% ingredients matched        │
│  🏷 Indian • Stir-fry • Veg       │
│                                    │
│  🛒 Missing (2 items):             │
│     • Sesame oil     ~$3.50        │
│     • Fresh ginger   ~$1.00        │
│  [🛒 Add to Shopping List]         │
│  [🔄 Substitute available]         │
│                                    │
│  [❤️ Heart]    [💔 Skip]    [🔁 Re-roll] │
│  [✅ Lock In This Dish]             │
└────────────────────────────────────┘
```

### 2.3 Heart / Unheart System

| Action | Effect | Backend |
|---|---|---|
| **❤️ Heart** | Save to Favorites. Increases weight ~1.5x in future rolls. | `dish.heart_boost = 1.5` |
| **💔 Skip** | Don't use now. Soft penalty for future rolls. | `dish.skip_count += 1`, weight × `max(0.1, 1.0 - skip_count * 0.1)` |
| **🚫 Never Again** | Permanently block from rolls. | `dish.blocked = true`, hard-filtered out |
| **Undo** | All actions reversible from Favorites/History. | Toggle flags |

### 2.4 Repeat Reduction Logic

```python
def adjust_weight_for_repeats(recipe, player):
    base_weight = calculate_base_weight(recipe)

    days_since_last = days_since(recipe.last_used, today)
    if days_since_last == 0:     return 0          # NEVER repeat same day
    elif days_since_last <= 2:   base_weight *= 0.1   # 90% penalty
    elif days_since_last <= 5:   base_weight *= 0.4   # 60% penalty
    elif days_since_last <= 14:  base_weight *= 0.7   # 30% penalty

    if recipe.hearted:           base_weight *= 1.5
    base_weight *= max(0.1, 1.0 - recipe.skip_count * 0.1)
    if recipe.blocked:           return 0

    return base_weight
```

---

## 3. Inventory Screen (📦)

```
Features:
  ├── Search bar (type to find ingredient)
  ├── Quick-add by category tabs (Protein | Veg | Dairy | Pantry | ...)
  ├── Each item shows:
  │     ├── Name
  │     ├── Quantity + unit
  │     ├── Decay bar (green → yellow → red based on expiry)
  │     └── [Edit] [Delete]
  ├── "Add Item" floating button
  │     └── MVP form: item_name (autocomplete) + expire_date (date picker, min=today)
  │     └── Quantity defaults to 1 unit, category auto-inferred
  ├── Sort by: name / category / expiry (soonest first)
  └── Bulk actions: clear all, import from text
```

---

## 4. Quest Log Screen (📜)

Today's complete meal plan after all slots are rolled/locked.

```
Features:
  ├── Meal slot list (dynamic, based on meal_structure)
  │     ├── Each slot: dish name, time, calories, status (rolled/pending/done)
  │     └── Tap slot → recipe detail
  ├── Crafting Queue (prep schedule)
  │     ├── Ordered step-by-step tasks
  │     ├── Batch notes (shared ingredients)
  │     └── Estimated total time
  ├── 📊 Daily Nutrition Dashboard (see §4.1)
  ├── Missing ingredients list
  │     ├── Name, qty, estimated cost, substitute available?
  │     ├── "Add to Shopping List" button
  │     └── Total estimated cost
  └── Mark meals as "Done" (for streak tracking)
```

### 4.1 Daily Nutrition Dashboard

Persistent bar on Quest Log. Updates live as meals are locked/done.

```
┌──────────────────────────────────────────────────────────┐
│  📊 DAILY STATS                                          │
│                                                           │
│  HP (Calories)   ██████████████░░░░░░  1,430 / 2,102 kcal│
│                  ──────────── 68% ─── on track            │
│                                                           │
│  STR (Protein)   ████████████████░░░░  105 / 131g         │
│                  ──────────── 80% ─── good ✓              │
│                                                           │
│  STA (Carbs)     ██████████░░░░░░░░░░  158 / 263g         │
│                  ──────────── 60% ─── on track            │
│                                                           │
│  DEF (Fat)       ████████████████████  58 / 58g           │
│                  ──────────── 100% ── good ✓              │
│                                                           │
│  Per-Meal Breakdown:                                      │
│    Breakfast ✅  410/420 kcal  │  26g P  53g C  12g F     │
│    Lunch     ✅  580/631 kcal  │  39g P  79g C  17g F     │
│    Dinner    🔲  —/736         │  pending                 │
│    Snack     🔲  —/315         │  pending                 │
│                                                           │
│  Remaining to eat: 672 kcal  (Dinner + Snack)             │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Progress Bar States

| Fill % | Status | Color | Label |
|---|---|---|---|
| 0–49% | `low` | `--error` (red) | "Low — roll more meals" |
| 50–79% | `on_track` | `--warning` (yellow) | "On track" |
| 80–110% | `good` | `--success` (green) | "Good ✓" |
| 111%+ | `over` | `--error` (red) | "Over target ⚠️" |

### 4.3 Quest Log Layout Examples

**3 Meals + 1 Snack (most common):**
```
DAILY QUEST LOG  ──  Level 5 Chef  ──  4 Quests Today
Estimated Active Time: 1h 20min

──────────────────────────────────────────
[!] BATCH CRAFTING PHASE (Do this first)
  [+0 min]   Boil 2 cups brown rice          → For: Lunch & Dinner
  [+5 min]   Chop onions, tomatoes, peppers  → For: Lunch & Dinner

[✓] QUEST 1 — BREAKFAST (Ready at +20m)            Target: 400 HP
  [+15 min]  Scrambled eggs with toast & avocado
             Rewards: +410 HP | +22 STR | +8 DEF

[✓] QUEST 2 — LUNCH (Ready at +50m)                Target: 600 HP
  [+30 min]  Veggie stir fry with brown rice
             Rewards: +580 HP | +18 STR | +12 DEF

[✓] QUEST 3 — DINNER (Prep now, reheat later)       Target: 700 HP
  [+50 min]  Lentil & tomato soup with rice
             Rewards: +690 HP | +30 STR | +15 DEF

[✓] SIDE QUEST — PM SNACK                           Target: 300 HP
  [+75 min]  Boiled egg + fruit bowl
             Rewards: +280 HP | +12 STR | +2 DEF

──────────────────────────────────────────
DAILY STATS SUMMARY
  HP (Calories): 1,960 / 2,000
  STR (Protein): 82 / 95g  |  DEF (Fat): 37 / 55g  |  STA (Carbs): 230 / 250g

MERCHANT RUN (Missing Materials)
  ✗ Olive oil   ✗ Lemon
  → Add to Merchant List?
```

**OMAD (1 Meal):**
```
DAILY QUEST LOG  ──  Level 8 Chef  ──  1 MEGA QUEST Today

[✓] MEGA QUEST — THE FEAST (Ready at +45m)          Target: 2,000 HP
  [+0 min]   Pan-seared salmon + roasted vegetables + quinoa
             Rewards: +1,980 HP | +95 STR | +55 DEF | +240 STA

DAILY STATS: ████████████████████████░ 99%
```

**6 Meals (Bodybuilding):**
```
DAILY QUEST LOG  ──  Level 6 Chef  ──  6 Quests Today

[✓] QUEST 1 — BREAKFAST      (06:30)  +415 HP | +35 STR
[✓] QUEST 2 — MID-MORNING    (09:00)  +340 HP | +30 STR
[✓] QUEST 3 — LUNCH           (12:00)  +420 HP | +35 STR
[✓] QUEST 4 — PRE-WORKOUT     (15:00)  +280 HP | +15 STR
[✓] QUEST 5 — POST-WORKOUT    (17:30)  +350 HP | +40 STR
[✓] QUEST 6 — DINNER          (20:00)  +450 HP | +35 STR
```

**Intermittent Fasting 16:8:**
```
DAILY QUEST LOG  ──  3 Quests (12:00–20:00 window)
⏰ Fast until 12:00  ──  Drink water / black coffee only

[✓] QUEST 1 — LUNCH   (12:00)  +650 HP | +30 STR
[✓] QUEST 2 — SNACK   (15:30)  +300 HP | +15 STR
[✓] QUEST 3 — DINNER  (19:30)  +750 HP | +40 STR

⏰ Fasting resumes at 20:00
```

---

## 5. Favorites / History Screen (❤️)

```
Features:
  ├── Tabs: [❤️ Hearted] [📅 History] [🚫 Blocked]
  ├── Hearted:
  │     ├── Grid of hearted dishes
  │     ├── Tap to view recipe
  │     ├── Force-roll this dish for next empty slot
  │     └── Remove heart
  ├── History:
  │     ├── Calendar view or list of past daily plans
  │     ├── Tap any day to see what was cooked
  │     └── Re-roll any past dish into today
  └── Blocked:
        ├── List of "never again" dishes
        └── Unblock button
```

---

## 6. Settings Screen (⚙️)

All onboarding choices, editable anytime. Changes take effect on next roll.

```
Settings
  ├── Profile
  │     ├── Display name / Avatar
  │     └── Body stats (age, gender, height, weight, activity)
  │
  ├── Diet & Restrictions
  │     ├── Diet profile (dropdown)
  │     ├── Allergies, Intolerances, Custom exclusions
  │     ├── Religious diet, Health conditions
  │
  ├── Meal Structure
  │     ├── Meals per day (preset or custom)
  │     ├── Slot names + calorie split
  │     └── Fasting window toggle
  │
  ├── Nutrition Goals
  │     ├── Calorie target (input or auto-calc)
  │     ├── Macro preset or custom sliders (sum to 100%)
  │     └── Micronutrient tracking toggles
  │
  ├── Cuisine & Cooking
  │     ├── Cuisine preferences + "Surprise me" toggle
  │     ├── Skill level, Max prep time
  │     └── Kitchen equipment
  │
  ├── Roll Settings
  │     ├── Re-rolls per slot (default: 3)
  │     ├── Repeat cooldown (default: 2 days)
  │     ├── Heart boost multiplier (default: 1.5x)
  │     └── Auto-fill unrolled slots
  │
  ├── Appearance
  │     ├── 🎨 Theme selector
  │     ├── Dark/light mode
  │     └── Animation speed (fast / normal / slow / off)
  │
  ├── Data
  │     ├── Export grocery list / meal plan (PDF/text)
  │     ├── Clear all data
  │     └── Account management
  │
  └── About (version, credits, feedback)
```

---

## 7. Feature Priority

### P0 — Must Have (Hackathon Demo)

| # | Feature | Screen |
|---|---|---|
| 1 | Onboarding: diet + allergies + meals/day | Onboarding |
| 2 | Grocery inventory input (add/remove/edit) | Inventory |
| 3 | The Roll button + gacha animation + dish card | Main |
| 4 | Heart / Skip actions on dish card | Main |
| 5 | Lock in dish → build daily plan | Main → Quest Log |
| 6 | Quest Log with ordered meal list | Quest Log |
| 7 | Theme selector (at least 3 themes) | Settings |

### P1 — Should Have (Post-MVP)

| # | Feature | Screen |
|---|---|---|
| 8 | Repeat reduction logic | Roll engine |
| 9 | Re-roll limit (3/slot) | Main |
| 10 | Full settings editing | Settings |
| 11 | Nutrition summary bar | Quest Log |
| 12 | Missing ingredients → shopping list | Quest Log |
| 13 | Favorites screen | Favorites |
| 14 | Expiry/decay tracking on inventory | Inventory |

### P2 — Nice to Have (Polish)

| # | Feature | Screen |
|---|---|---|
| 15 | Crafting queue / prep schedule | Quest Log |
| 16 | Batch cook optimization (CPM) | Quest Log |
| 17 | History calendar | History |
| 18 | "Never again" blocking | Favorites |
| 19 | Force-roll a hearted dish | Favorites |
| 20 | Animation speed settings | Settings |
| 21 | Export (PDF/text) | Settings |
| 22 | Streak tracking / achievements | History |
