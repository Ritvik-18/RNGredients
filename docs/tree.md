# RNGredients — Feature Tree & Requirements

> **Build reference.** This is the functional spec — what the app does, screen by screen.
> Related: [meal_prep.md](meal_prep.md) (architecture), [user_preferences.md](user_preferences.md) (all preference options), [ingredients.md](ingredients.md) (data), [appliances.md](appliances.md) (equipment), [themes.md](themes.md) (visual themes)

---

## App Flow (High-Level)

```
[First Launch → Onboarding]
         ↓
[Main Screen (The Tavern)]
    ├── 🎲 ROLL button → Roll animation → Dish card
    │       ├── ❤️ Heart dish
    │       ├── 💔 Unheart dish (skip / never again)
    │       └── 🔁 Re-roll
    ├── 📦 Inventory (manage groceries)
    ├── 📜 Quest Log (today's meal plan)
    ├── ⚙️ Settings
    │       ├── Edit preferences (diet, allergies, meals/day, macros)
    │       ├── Edit inventory
    │       ├── Edit equipment
    │       └── 🎨 Theme selector
    └── 📊 History / Favorites
```

---

## 1. Onboarding (First Launch Only)

Runs once. All choices editable later via Settings.

```
Screen 1: Welcome
  → App intro + "Start Your Adventure" CTA

Screen 2: Diet & Allergies
  → Select diet profile (omnivore, vegan, keto, etc.)
  → Select allergies (multi-select, searchable)
  → Select intolerances (multi-select)
  → Custom exclusions (free text tags)
  → Religious diet (optional)
  → Health conditions (optional)
  REF: user_preferences.md §1, §2, §8, §9

Screen 3: Meals Per Day
  → How many meals? (1–6, presets + custom)
  → Slot labels and calorie split preview
  → Fasting window (if applicable)
  REF: user_preferences.md §3

Screen 4: Nutrition Goals
  → Calorie target (auto-calc or manual)
  → Macro preset or custom sliders
  REF: user_preferences.md §4

Screen 5: Cuisine & Cooking
  → Cuisine preferences (multi-select)
  → "Surprise me" toggle
  → Skill level
  → Max daily prep time
  → Available equipment (multi-select grid)
  REF: user_preferences.md §5, §6; appliances.md §7

Screen 6: Grocery Inventory
  → Add current groceries (search + add)
  → Quick-add by category
  → Set quantities and expiry (optional)
  REF: ingredients.md §1, §4

Screen 7: Choose Theme
  → Pick a visual theme from retro game palettes
  → Preview before confirming
  REF: themes.md

Screen 8: Review & Confirm
  → Summary of all choices
  → "Enter the Tavern" button → Main Screen
```

---

## 2. Main Screen (The Tavern)

This is the home screen. The user comes here every time they open the app.

```
┌──────────────────────────────────────────────────┐
│  🏠 RNGredients          [⚙️ Settings] [🎨 Theme] │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │         Today's Slot: LUNCH (600 kcal)       │  │
│  │                                              │  │
│  │       [ 🎲  ROLL FOR DISH  🎲 ]              │  │
│  │                                              │  │
│  │         Re-rolls remaining: 2 / 3            │  │
│  │                                              │  │
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
| **Result** | One dish card appears with: name, image, cook time, calorie/macro fit, ingredient match % |
| **Re-rolls** | 3 free per meal slot per day. Counter visible. |
| **Auto-fill** | If user doesn't roll for a slot, system auto-picks best match before prep schedule is generated |

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
│  [❤️ Heart]    [💔 Skip]    [🔁 Re-roll] │
│                                    │
│  [✅ Lock In This Dish]             │
└────────────────────────────────────┘
```

### 2.3 Heart / Unheart System

| Action | Effect | Backend |
|---|---|---|
| **❤️ Heart** | Save dish to Favorites. Increases its weight in future rolls (appears ~2x more often). | `dish.heart_boost = 1.5` added to loot table weight |
| **💔 Skip / Unheart** | Don't use this dish now. Soft penalty for future rolls. | `dish.skip_count += 1`, weight reduced by `skip_count * 0.1` |
| **🚫 Never Again** | Permanently block this dish from rolls (accessible from Favorites/History). | `dish.blocked = true`, hard-filtered out |
| **Undo** | All actions reversible from Favorites or History screen. | Toggle flags |

### 2.4 Repeat Reduction Logic

```python
def adjust_weight_for_repeats(recipe, player):
    base_weight = calculate_base_weight(recipe)  # from loot table algorithm
    
    # Penalize recently used dishes
    days_since_last = days_since(recipe.last_used, today)
    if days_since_last == 0:
        return 0  # NEVER repeat same day
    elif days_since_last <= 2:
        base_weight *= 0.1   # 90% penalty if used in last 2 days
    elif days_since_last <= 5:
        base_weight *= 0.4   # 60% penalty if used in last 5 days
    elif days_since_last <= 14:
        base_weight *= 0.7   # 30% penalty if used in last 2 weeks
    # else: no penalty (it's been long enough)
    
    # Boost hearted dishes
    if recipe.hearted:
        base_weight *= 1.5
    
    # Penalize skipped dishes
    base_weight *= max(0.1, 1.0 - recipe.skip_count * 0.1)
    
    # Blocked dishes
    if recipe.blocked:
        return 0
    
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
  ├── Sort by: name / category / expiry (soonest first)
  └── Bulk actions: clear all, import from text
```

REF: [ingredients.md](ingredients.md) for categories, units, normalization

---

## 4. Quest Log Screen (📜)

Shows today's complete meal plan after all slots are rolled/locked.

```
Features:
  ├── Meal slot list (dynamic, based on meal_structure)
  │     ├── Each slot: dish name, time, calories, status (rolled / pending / done)
  │     └── Tap slot → recipe detail
  ├── Crafting Queue (prep schedule)
  │     ├── Ordered step-by-step tasks
  │     ├── Batch notes (shared ingredients)
  │     └── Estimated total time
  ├── 📊 Daily Nutrition Dashboard (see §4.1 below)
  ├── Missing ingredients list
  │     ├── Per-item: name, qty, estimated cost, substitute available?
  │     ├── "Add to Shopping List" button
  │     └── Total estimated cost
  └── Mark meals as "Done" (for streak tracking)
```

### 4.1 Daily Nutrition Dashboard

> Calculation logic → see [calorie_calc.md](calorie_calc.md) §5

Persistent bar at top or bottom of Quest Log. Updates live as meals are locked in / marked done.

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
│  Fiber           ██████░░░░░░░░░░░░░░  12 / 30g           │
│                                                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Per-Meal Breakdown                                   │ │
│  │  Breakfast ✅  410 kcal / 420  │  26g P  53g C  12g F│ │
│  │  Lunch     ✅  580 kcal / 631  │  39g P  79g C  17g F│ │
│  │  Dinner    🔲  — / 736         │  pending             │ │
│  │  Snack     🔲  — / 315         │  pending             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                           │
│  Remaining to eat: 672 kcal  (Dinner + Snack)             │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Progress Bar States

| Fill % | Status | Bar Color | Label |
|---|---|---|---|
| 0–49% | `low` | `--error` (red) | "Low — roll more meals" |
| 50–79% | `on_track` | `--warning` (yellow) | "On track" |
| 80–110% | `good` | `--success` (green) | "Good ✓" |
| 111%+ | `over` | `--error` (red) | "Over target ⚠️" |

### 4.3 Main Screen Mini Tracker

A compact version also appears on the Main Screen (Tavern) below the Roll button:

```
┌──────────────────────────────────┐
│ Today: 1,430 / 2,102 kcal  (68%)│
│ ████████████████░░░░░░░░░░░░░░░ │
│ P: 105/131g  C: 158/263g  F: 58g│
└──────────────────────────────────┘
```

---

## 5. Favorites / History Screen (❤️)

```
Features:
  ├── Tabs: [❤️ Hearted] [📅 History] [🚫 Blocked]
  ├── Hearted tab:
  │     ├── Grid of hearted dishes
  │     ├── Tap to view recipe
  │     ├── Force-roll this dish for next empty slot
  │     └── Remove heart
  ├── History tab:
  │     ├── Calendar view or list of past daily plans
  │     ├── Tap any day to see what was cooked
  │     └── Re-roll any past dish into today
  └── Blocked tab:
        ├── List of "never again" dishes
        └── Unblock button
```

---

## 6. Settings Screen (⚙️)

All onboarding choices, editable anytime. Changes take effect on next roll.

```
Settings
  ├── Profile
  │     ├── Display name
  │     └── Avatar / character
  │
  ├── Diet & Restrictions
  │     ├── Diet profile (dropdown)
  │     ├── Allergies (multi-select)
  │     ├── Intolerances (multi-select)
  │     ├── Custom exclusions (tag input)
  │     ├── Religious diet (dropdown)
  │     └── Health conditions (multi-select)
  │
  ├── Meal Structure
  │     ├── Meals per day (slider or preset select)
  │     ├── Slot names and calorie split
  │     ├── Fasting window toggle + time pickers
  │     └── Preview of daily slot layout
  │
  ├── Nutrition Goals
  │     ├── Daily calorie target (input or auto-calc)
  │     ├── Auto-calc settings (age, gender, height, weight, activity)
  │     ├── Macro preset dropdown
  │     ├── Custom macro sliders (must sum to 100%)
  │     └── Micronutrient tracking toggles
  │
  ├── Cuisine & Cooking
  │     ├── Cuisine preferences (multi-select)
  │     ├── "Surprise me" toggle
  │     ├── Skill level (slider)
  │     ├── Max daily prep time (slider)
  │     └── Kitchen equipment (checkbox grid)
  │
  ├── Roll Settings
  │     ├── Re-rolls per slot (default: 3)
  │     ├── Repeat cooldown (default: 2 days)
  │     ├── Heart boost multiplier (default: 1.5x)
  │     └── Auto-fill unrolled slots (toggle)
  │
  ├── Appearance
  │     ├── 🎨 Theme selector (grid of theme previews)
  │     ├── Dark/light mode override
  │     └── Animation speed (fast / normal / slow / off)
  │
  ├── Data
  │     ├── Export grocery list
  │     ├── Export meal plan (PDF / text)
  │     ├── Clear all data
  │     └── Account management
  │
  └── About
        ├── Version
        ├── Credits
        └── Feedback link
```

---

## 7. Feature Priority (Build Order)

### P0 — Must Have (MVP / Hackathon Demo)

| # | Feature | Screen |
|---|---|---|
| 1 | Onboarding: diet + allergies + meals/day | Onboarding |
| 2 | Grocery inventory input (add/remove/edit) | Inventory |
| 3 | The Roll button + animation + dish card | Main |
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
| 13 | Favorites screen with hearted dishes | Favorites |
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

---

## 8. State Management Map

What data lives where at runtime:

```
Global State (Zustand / Context)
  ├── player
  │     ├── preferences (diet, allergies, meals, macros, equipment)
  │     ├── theme
  │     └── settings (re-roll limit, repeat cooldown, etc.)
  │
  ├── inventory[]
  │     └── { name, quantity, unit, category, expiry }
  │
  ├── todayPlan
  │     ├── slots[] → { slot_name, recipe_id, status: pending|rolled|locked|done }
  │     ├── crafting_queue[]
  │     └── nutrition_totals
  │
  ├── rollState
  │     ├── current_slot
  │     ├── re_rolls_remaining
  │     ├── current_dish_card (the one showing)
  │     └── is_rolling (animation flag)
  │
  ├── favorites
  │     ├── hearted_ids[]
  │     ├── blocked_ids[]
  │     └── skip_counts{}    → { recipe_id: count }
  │
  └── history[]
        └── { date, plan }
```

---

## 9. API Endpoints (Backend)

```
POST   /api/onboarding           → Save initial preferences
GET    /api/player                → Get player profile + preferences
PATCH  /api/player/preferences    → Update any preference field

GET    /api/inventory             → List all grocery items
POST   /api/inventory             → Add item
PATCH  /api/inventory/:id         → Update item (quantity, expiry)
DELETE /api/inventory/:id         → Remove item

POST   /api/roll                  → { slot: "lunch" } → returns rolled dish card
POST   /api/roll/reroll           → { slot: "lunch" } → re-roll (checks limit)
POST   /api/roll/lock             → { slot: "lunch", recipe_id } → lock dish into plan

POST   /api/dish/:id/heart        → Heart a dish
DELETE /api/dish/:id/heart        → Remove heart
POST   /api/dish/:id/skip         → Increment skip count
POST   /api/dish/:id/block        → Block dish permanently
DELETE /api/dish/:id/block        → Unblock

GET    /api/plan/today            → Get today's plan (all slots)
PATCH  /api/plan/today/:slot/done → Mark slot as done

GET    /api/favorites             → List hearted dishes
GET    /api/history               → List past plans (paginated)
GET    /api/shopping-list         → Missing ingredients for today's plan
```
