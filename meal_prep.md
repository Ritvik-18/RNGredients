# RNGredients: Gamified Meal Prep & Inventory Management — Research & Structure

---

## 1. Problem Statement & The "Game" Solution

Most people who cook at home face three recurring friction points, which can be addressed by applying game design mechanics:
1. **Decision fatigue (Analysis Paralysis)** — "What do I cook today?" 
   *Solution:* **RNG "Roll for Meal" mechanic** removes the burden of choice.
2. **Grocery waste (Item Decay)** — Ingredients expire before use (avg. US household wastes ~31% of food). 
   *Solution:* **Inventory Management** framing uses loss aversion to encourage using "decaying" items.
3. **Time inefficiency (Poor Quest Routing)** — Cooking each meal separately instead of batch-prepping. 
   *Solution:* **Crafting Queues & Quest Logs** to optimize the chronological prep sequence.

RNGredients solves all three by combining grocery-first input with variable-reward recipe generation and optimized daily "crafting" schedules.

---

## 2. Literature & Research Basis

### 2.1 Gamification & Decision Making
- **Choice Overload (Iyengar & Lepper, 2000)**: Having too many recipe options paralyzes users. By replacing infinite scrolling with an RNG "Gacha" roll, we artificially constrain choice, increasing satisfaction with the final result.
- **Variable Ratio Reinforcement (Skinner Box Mechanics)**: The anticipation of "rolling" for a meal triggers a dopamine response similar to loot boxes or slot machines. This converts the chore of meal planning into an engaging daily event (Deterding et al., 2011).

### 2.2 Loss Aversion & Inventory Management
- **Endowment Effect & Loss Aversion (Kahneman & Tversky)**: People feel the pain of losing something more acutely than the joy of gaining it. By visualizing groceries as a quantified "Inventory" with visual "Decay Timers" (HP bars for food), users are more highly motivated to utilize them before they "spoil" and vanish from their inventory.

### 2.3 The "Crafting" Psychology & Batch Cooking
- **The IKEA Effect (Norton et al., 2012)**: Users place disproportionately high value on products they partially created. Breaking cooking down into manageable "Quest Steps" enhances this effect while reducing the cognitive load of a large recipe.
- **Critical Path Method (CPM)**: Borrowed from industrial engineering and kitchen management (*mise en place*), arranging "crafting" tasks by longest-duration first (parallelizing independent tasks) reduces total active time by up to 40%.

### 2.4 Nutrition as "Stat Buffs"
- Framing nutritional goals (Dietary Guidelines for Americans) as daily "Stat Checks" (e.g., +30 STR/Protein, +50 STA/Carbs).
- **Protein Distribution**: Research shows 25–30g protein per meal is optimal for muscle protein synthesis, aligning perfectly with a "Strength Buff" tracking system for fitness-focused users.

---

## 3. App Architecture (The Game Loop)

### 3.1 User Flow (The Gameplay Loop)

```
[Manage Inventory]  ← Input/Update existing groceries (Loot)
       ↓
[Set Roll Parameters] ← Meal count, allergies, desired "buffs" (calories/macros)
       ↓
[RNG GACHA ROLL]   ← Rolls once PER MEAL SLOT (N rolls for N meals)
       ↓
[Daily Quest Log]  ← The Meal Prep Output
  ├── N Main/Side Quests (dynamic, based on player.meal_structure.meals)
  ├── Crafting Queue (Ordered, parallel-aware prep steps)
  ├── Batch Crafting (Shared components across meals)
  └── Missing Items → Merchant List (Shopping List)
```

### 3.2 Page Map

```
/                        Start Screen (Landing)
/character-creation      Onboarding (Diet, allergies, starting stats)
/inventory               Grocery input & decay tracking
/tavern                  The "Roll" screen (Generate Plan)
/quest-log               Active daily prep output (Core screen)
/grimoire/:id            Individual recipe/spell detail
/merchant                Missing ingredients (Shopping list)
/achievements            Past stats, streaks, and history
```

---

## 4. Data Models

### Player (User)

> Full preference schema with all options → see [user_preferences.md](user_preferences.md#11-data-model-update--player-preferences)

```json
{
  "id": "uuid",
  "username": "string",
  "dietary_restrictions": ["vegan", "gluten-free"],
  "allergies": ["peanuts", "shellfish"],
  "intolerances": ["lactose"],
  "custom_exclusions": ["cilantro"],
  "religious_diet": null,
  "health_conditions": [],
  "meal_structure": {
    "preset": "3_meals_1_snack",
    "meals": [
      { "slot": "breakfast", "tag": "breakfast", "calorie_pct": 20 },
      { "slot": "lunch",     "tag": "lunch",     "calorie_pct": 30 },
      { "slot": "dinner",    "tag": "dinner",    "calorie_pct": 35 },
      { "slot": "snack_pm",  "tag": "snack",     "calorie_pct": 15 }
    ],
    "fasting_window": null
  },
  "stat_goals": {
    "hp_calories": 2000,
    "str_protein": 120,
    "macro_preset": "balanced",
    "macros": { "carbs_pct": 50, "protein_pct": 25, "fat_pct": 25 }
  },
  "cuisine_preferences": ["Indian", "Mediterranean"],
  "cooking": {
    "skill_level": "intermediate",
    "max_daily_prep_min": 60,
    "equipment": ["stovetop", "oven", "blender"],
    "preferred_methods": ["stir-fry", "one-pot"]
  },
  "servings": 2,
  "level": 5,
  "current_streak": 3
}
```

### Inventory Item (Grocery)
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "item_name": "chicken breast",
  "quantity": 500,
  "unit": "grams",
  "category": "protein",
  "decay_timer": "2026-04-22",
  "rarity": "common"
}
```

### Crafting Recipe (Recipe)
```json
{
  "id": "uuid",
  "title": "Lemon Herb Chicken",
  "rarity": "rare",
  "meal_type": "dinner",
  "required_materials": [
    { "name": "chicken breast", "quantity": 200, "unit": "grams" },
    { "name": "lemon", "quantity": 1, "unit": "whole" }
  ],
  "crafting_steps": ["Step 1...", "Step 2..."],
  "active_craft_time": 10,
  "passive_craft_time": 25,
  "stat_buffs": {
    "calories": 420,
    "protein": 38
  }
}
```

### Quest Log (Daily Plan)

The `quests` array is **dynamic** — its length and slot names come from `player.meal_structure.meals`.
This means a player with 2 meals gets 2 quests, a player with 6 gets 6.

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "date": "2026-04-19",
  "meal_count": 4,
  "quests": [
    { "slot": "breakfast",  "tag": "breakfast", "recipe_id": "r_001", "calorie_target": 400 },
    { "slot": "lunch",      "tag": "lunch",     "recipe_id": "r_042", "calorie_target": 600 },
    { "slot": "dinner",     "tag": "dinner",    "recipe_id": "r_117", "calorie_target": 700 },
    { "slot": "snack_pm",   "tag": "snack",     "recipe_id": "r_203", "calorie_target": 300 }
  ],
  "crafting_queue": [
    { "time_offset_min": 0, "task": "Boil 2 cups rice", "used_in": ["lunch", "dinner"] },
    { "time_offset_min": 5, "task": "Chop onions", "used_in": ["lunch", "dinner"] }
  ],
  "total_buffs": { "calories": 2000, "protein": 95, "carbs": 250, "fat": 55 },
  "missing_materials": ["olive oil"]
}
```

---

## 5. The RNG & Matching Algorithm (Loot Table Logic)

The algorithm runs **once per meal slot** defined in `player.meal_structure.meals`.
If the player chose 5 meals/day, it rolls 5 times. If OMAD, it rolls once.

> Full list of meal structure options → see [user_preferences.md § 3](user_preferences.md#3-meal-structure-number-of-meals-per-day)
> Full list of exclusions & priority → see [user_preferences.md § 10](user_preferences.md#10-preference-priority--conflict-resolution)

### Step 0 — Read Player Meal Structure
```python
slots = player.meal_structure.meals  # e.g. [{slot: "breakfast", tag: "breakfast", calorie_pct: 20}, ...]
daily_cal = player.stat_goals.hp_calories

for slot in slots:
    slot.calorie_target = daily_cal * (slot.calorie_pct / 100)
    # breakfast: 2000 * 0.20 = 400 kcal
```

### Step 1 — Constraint Filtering (Valid Loot Pool)
```
For EACH slot, remove all recipes where:
  1. Recipe contains ANY ingredient in player.allergies            → HARD BLOCK
  2. Recipe violates player.health_conditions rules               → HARD BLOCK
  3. Recipe violates player.religious_diet rules                   → HARD BLOCK
  4. Recipe doesn't match player.dietary_restrictions profile      → HARD FILTER
  5. Recipe.meal_type doesn't match slot.tag                       → HARD FILTER
     (a "dinner" slot only gets dinner-tagged recipes)
  6. Ingredients NOT in inventory with availability < 40%          → SOFT FILTER
  7. Recipe requires equipment player doesn't have                 → SOFT FILTER
  8. Recipe complexity exceeds player.cooking.skill_level          → SOFT FILTER
```

### Step 2 — Weighting & Drop Rates (Soft Ranking)
```
For each recipe remaining in the slot's loot pool:

base_weight = 100
+ (decay_urgency    × 50)   // Uses items expiring today/tomorrow
+ (inventory_match  × 30)   // % of materials already in inventory
+ (stat_alignment   × 20)   // How close recipe calories are to slot.calorie_target
+ (macro_fit        × 15)   // Protein/carb/fat match against player macro split
+ (cuisine_pref     × 10)   // Bonus if recipe.cuisine in player.cuisine_preferences
- (time_penalty     × 10)   // Penalty if recipe exceeds remaining time budget

Normalize weights → probability distribution per slot.
```

### Step 3 — The RNG Roll (Per Slot)
```
for each slot in player.meal_structure.meals:
    loot_pool = filter_and_weight(slot)  # Steps 1–2
    rolled_recipe = weighted_random_pick(loot_pool)
    
    # Deduct used inventory quantities so next slot doesn't double-count
    deduct_inventory(rolled_recipe.required_materials)
    
    # Subtract slot time from remaining daily time budget
    remaining_time -= rolled_recipe.active_craft_time

# Re-roll mechanics:
#   - 3 free re-rolls per day per slot
#   - Re-roll locks in ALL other slots (only re-roll the one you don't like)
```

### Step 4 — Validate Daily Totals
```
total_cal = sum(recipe.stat_buffs.calories for recipe in selected_recipes)
if abs(total_cal - daily_cal) > daily_cal * 0.15:   # >15% off target
    adjust portion sizes proportionally per slot

total_time = sum(recipe.active_craft_time for recipe in selected_recipes)
if total_time > player.cooking.max_daily_prep_min:
    swap longest-active-time recipe with a quicker alternative from loot pool
```

### Step 5 — Build Crafting Schedule (CPM)
```
1. Collect ALL tasks from ALL rolled recipes (across all meal slots).
2. Identify shared materials → merge into batch-crafting tasks.
   (e.g., rice needed in slot "lunch" + slot "dinner" → cook once)
3. Sort by passive_craft_time DESC (longest first, run in background).
4. Interleave active tasks during passive wait times.
5. Output: ordered crafting_queue with time_offset_min per task.
```

---

## 6. Quest Log Output (UI Spec)

The quest log renders **dynamically based on `meal_count`**. Below are examples for different configurations.

### Example A: 3 Meals + 1 Snack (most common)
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
  HP  (Calories): 1,960 / 2,000
  STR (Protein) : 82 / 95g
  DEF (Fat)     : 37 / 55g
  STA (Carbs)   : 230 / 250g

MERCHANT RUN (Missing Materials)
  ✗ Olive oil   ✗ Lemon
  → Add to Merchant List?
```

### Example B: OMAD (1 Meal)
```
DAILY QUEST LOG  ──  Level 8 Chef  ──  1 MEGA QUEST Today
Estimated Active Time: 45min

──────────────────────────────────────────
[✓] MEGA QUEST — THE FEAST (Ready at +45m)          Target: 2,000 HP
  [+0 min]   Pan-seared salmon + roasted vegetables + quinoa
             Rewards: +1,980 HP | +95 STR | +55 DEF | +240 STA

DAILY STATS: ████████████████████████░ 99%
```

### Example C: 6 Meals (Bodybuilding)
```
DAILY QUEST LOG  ──  Level 6 Chef  ──  6 Quests Today
Estimated Active Time: 1h 50min

──────────────────────────────────────────
[✓] QUEST 1 — BREAKFAST     (06:30)  +415 HP | +35 STR
[✓] QUEST 2 — MID-MORNING   (09:00)  +340 HP | +30 STR
[✓] QUEST 3 — LUNCH          (12:00)  +420 HP | +35 STR
[✓] QUEST 4 — PRE-WORKOUT    (15:00)  +280 HP | +15 STR
[✓] QUEST 5 — POST-WORKOUT   (17:30)  +350 HP | +40 STR
[✓] QUEST 6 — DINNER         (20:00)  +450 HP | +35 STR

DAILY STATS: HP 2,255/2,400 | STR 190/200g | DEF 60/65g
```

### Example D: Intermittent Fasting 16:8 (Eating window 12pm–8pm)
```
DAILY QUEST LOG  ──  Level 4 Chef  ──  3 Quests (12:00–20:00 window)
⏰ Fast until 12:00  ──  Drink water / black coffee only

──────────────────────────────────────────
[✓] QUEST 1 — LUNCH          (12:00)  +650 HP | +30 STR
[✓] QUEST 2 — SNACK          (15:30)  +300 HP | +15 STR
[✓] QUEST 3 — DINNER         (19:30)  +750 HP | +40 STR

⏰ Fasting resumes at 20:00
DAILY STATS: HP 1,700/1,800 | STR 85/90g
```

---

## 7. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Tailwind CSS | Fast UI, great for pixel-art/gamified styling |
| State | Zustand | Lightweight, perfect for "Player Stats" & Inventory state |
| Backend | FastAPI (Python) | Ideal for RNG logic, weighted loot tables, CPM math |
| Database | PostgreSQL + Prisma | Relational data, strong query support for inventory |
| Recipe Data | Spoonacular API (or own) | 365,000+ recipes, easily mapped to "Crafting Recipes" |
| Animations | Framer Motion / Lottie | Crucial for the "Gacha Roll" and quest completion juice |

---

## 8. Build Order (Actionable Sprints)

### Sprint 1 — Foundation & Inventory
- [ ] Project scaffolding (React + FastAPI)
- [ ] Character Creation (Auth + Dietary stats)
- [ ] Inventory UI (Pixel art / gamified look) + CRUD API
- [ ] "Decay Timer" logic for groceries

### Sprint 2 — The Grimoire (Recipe Layer)
- [ ] Integrate Spoonacular API or seed initial database
- [ ] Recipe detail "Grimoire" page
- [ ] Material mapping (normalize "chicken breast" to "chicken")

### Sprint 3 — The RNG Engine
- [ ] Implement Loot Table logic (Filtering & Weighting based on decay)
- [ ] The "Gacha Roll" API endpoint and frontend animation
- [ ] Build Crafting Schedule generator (CPM math)

### Sprint 4 — The Quest Log
- [ ] `/quest-log` page with all phases
- [ ] Crafting timeline UI
- [ ] Merchant list export

### Sprint 5 — Game "Juice" & Polish
- [ ] Add re-roll mechanics and limitations
- [ ] Sound effects and animations for completing quests
- [ ] Stat tracking and streak achievements

---

## 9. File Index (Build Reference)

| File | Purpose | Use When Building |
|---|---|---|
| [meal_prep.md](meal_prep.md) | Core architecture, data models, algorithm, tech stack, sprints | Backend API, DB schema, algorithm, frontend page structure |
| [user_preferences.md](user_preferences.md) | All user-facing choices: diets, allergies, meal counts, equipment, religion, health | Onboarding UI, preference forms, DB enums, filter/scoring logic |
