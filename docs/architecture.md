# RNGredients — Architecture & Technical Blueprint

> **The technical foundation.** Problem, research, data models, algorithm, tech stack, hackathon plan.
> Related: [features.md](features.md) (screens & UI), [data.md](data.md) (preferences, formulas, ingredients, equipment), [themes.md](themes.md) (color palettes)

---

## 1. Problem Statement

Home cooks face three compounding friction points:

1. **Decision fatigue (Analysis Paralysis)** — "What do I cook today?" leads to paralysis or defaulting to delivery.
2. **Grocery waste (Item Decay)** — avg. US household wastes ~31% of food; items expire before use.
3. **Time inefficiency (Poor Quest Routing)** — meals cooked individually instead of batch-prepped in optimal order.

RNGredients attacks all three using game mechanics: **gacha roll** removes the choice burden, **decay timers** make waste emotionally salient via loss aversion, and **CPM scheduling** optimizes the prep sequence automatically.

### What Makes This Cool

The gacha roll is the hook. Every competitor (Mealime, PlateJoy, Meal Genius) adds gamification AS a reward layer — badges, streaks. RNGredients uses the game mechanic AS the decision itself. You don't get rewarded for cooking. You roll to find out what you're cooking. That's variable ratio reinforcement (Skinner box) applied to meal selection — nothing in the market does this.

The slot machine window settling on "✦ Lemon Herb Chicken ✦" with a rarity flash is the demo moment.

---

## 2. Research Basis

### Gamification & Decision Making
- **Choice Overload (Iyengar & Lepper, 2000)**: Too many recipe options paralyze users. RNG "Gacha" roll constrains choice, increasing satisfaction.
- **Variable Ratio Reinforcement (Skinner Box)**: Anticipation of "rolling" triggers dopamine response similar to loot boxes (Deterding et al., 2011).

### Loss Aversion & Inventory Management
- **Endowment Effect & Loss Aversion (Kahneman & Tversky)**: Visualizing groceries as "Inventory" with "Decay Timers" (HP bars) motivates use before spoilage.

### The "Crafting" Psychology
- **The IKEA Effect (Norton et al., 2012)**: Breaking cooking into "Quest Steps" enhances perceived value while reducing cognitive load.
- **Critical Path Method (CPM)**: Arranging tasks by longest-duration first reduces total active time by up to 40%.

### Nutrition as "Stat Buffs"
- Framing nutritional goals (Dietary Guidelines for Americans) as daily "Stat Checks" (e.g., +30 STR/Protein, +50 STA/Carbs).
- **Protein Distribution**: 25–30g protein per meal is optimal for muscle protein synthesis, aligning with a "Strength Buff" tracking system.

---

## 3. The Game Loop

### User Flow

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

### Page Map

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

### Player (Canonical Schema)

Single source of truth for the user record. Combines profile, body stats, preferences, and settings.

> All preference options, enums, and validation rules → [data.md §1–6](data.md)
> Calorie/macro formulas → [data.md §7](data.md#7-calorie--macro-formulas)

```json
{
  "id": "uuid",
  "username": "string",

  "body_stats": {
    "age": 28,
    "gender": "male",
    "height_cm": 175,
    "weight_kg": 72,
    "unit_preference": "metric"
  },
  "activity_level": "moderately_active",
  "fitness_target": "lose_weight",
  "meal_preference_preset": "high_protein",

  "diet_profile": "vegetarian",
  "allergies": ["peanuts", "shellfish"],
  "intolerances": ["lactose", "gluten"],
  "custom_exclusions": ["cilantro", "blue cheese"],
  "religious_diet": "halal",
  "health_conditions": ["type_2_diabetes"],

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

  "nutrition_goals": {
    "daily_calories": 2102,
    "calc_method": "auto",
    "bmr": 1679,
    "tdee": 2602,
    "macro_preset": "high_protein",
    "macros": { "carbs_pct": 30, "protein_pct": 40, "fat_pct": 30 },
    "macros_grams": { "protein_g": 210, "carbs_g": 158, "fat_g": 70 },
    "track_micros": ["fiber", "sodium"],
    "flag_high_gi": false
  },

  "cuisine_preferences": ["Indian", "Mediterranean", "Mexican"],
  "surprise_me": false,

  "cooking": {
    "skill_level": "intermediate",
    "max_daily_prep_min": 60,
    "equipment": ["stovetop", "oven", "blender", "rice_cooker"],
    "preferred_methods": ["stir-fry", "one-pot"]
  },

  "lifestyle": {
    "prep_mode": "daily",
    "prep_time_window": "evening",
    "default_servings": 2
  },

  "level": 5,
  "current_streak": 3,
  "rerolls_remaining": 3,
  "last_reroll_reset": "datetime",
  "theme": "final_fantasy"
}
```

### Inventory Item (Grocery)

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "item_name": "chicken breast",
  "normalized_name": "chicken_breast",
  "quantity": 500,
  "unit": "grams",
  "category": "protein",
  "expire_date": "2026-04-22",
  "is_pantry_staple": false,
  "rarity": "common"
}
```

### Recipe (Crafting Recipe)

```json
{
  "id": "uuid",
  "spoonacular_id": 12345,
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
  "stat_buffs": { "calories": 420, "protein": 38, "carbs": 15, "fat": 12 },
  "ingredients": ["chicken breast", "lemon", "olive oil", "garlic"],
  "diets": ["gluten_free", "dairy_free", "paleo"]
}
```

### Quest Log (Daily Plan)

Dynamic — length matches `player.meal_structure.meals`.

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "date": "2026-04-19",
  "meal_count": 4,
  "quests": [
    { "slot": "breakfast",  "tag": "breakfast", "recipe_id": "r_001", "calorie_target": 420, "status": "done" },
    { "slot": "lunch",      "tag": "lunch",     "recipe_id": "r_042", "calorie_target": 631, "status": "locked" },
    { "slot": "dinner",     "tag": "dinner",    "recipe_id": "r_117", "calorie_target": 736, "status": "pending" },
    { "slot": "snack_pm",   "tag": "snack",     "recipe_id": "r_203", "calorie_target": 315, "status": "pending" }
  ],
  "crafting_queue": [
    { "time_offset_min": 0, "task": "Boil 2 cups rice", "used_in": ["lunch", "dinner"], "passive": true },
    { "time_offset_min": 5, "task": "Chop onions", "used_in": ["lunch", "dinner"], "passive": false }
  ],
  "total_buffs": { "calories": 2000, "protein": 95, "carbs": 250, "fat": 55 },
  "missing_materials": ["olive oil"]
}
```

---

## 5. The RNG Algorithm (Loot Table Logic)

Runs **once per meal slot** in `player.meal_structure.meals`.

> Meal structure options → [data.md §3](data.md#3-meal-structure)
> Exclusion & priority rules → [data.md §6](data.md#6-preference-priority--conflict-resolution)

### Step 0 — Read Player Meal Structure
```python
slots = player.meal_structure.meals  # e.g. [{slot: "breakfast", tag: "breakfast", calorie_pct: 20}, ...]
daily_cal = player.nutrition_goals.daily_calories

for slot in slots:
    slot.calorie_target = daily_cal * (slot.calorie_pct / 100)
```

### Step 1 — Constraint Filtering (Valid Loot Pool)
```
For EACH slot, remove all recipes where:
  1. Recipe contains ANY ingredient in player.allergies            → HARD BLOCK
  2. Recipe violates player.health_conditions rules               → HARD BLOCK
  3. Recipe violates player.religious_diet rules                   → HARD BLOCK
  4. Recipe doesn't match player.diet_profile                     → HARD FILTER
  5. Recipe.meal_type doesn't match slot.tag                      → HARD FILTER
  6. Ingredients NOT in inventory with availability < 40%          → SOFT FILTER
  7. Recipe requires equipment player doesn't have                 → SOFT FILTER
  8. Recipe complexity exceeds player.cooking.skill_level          → SOFT FILTER
```

### Step 2 — Weighting & Drop Rates
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
```python
for each slot in player.meal_structure.meals:
    loot_pool = filter_and_weight(slot)  # Steps 1–2
    rolled_recipe = weighted_random_pick(loot_pool)
    deduct_inventory(rolled_recipe.required_materials)
    remaining_time -= rolled_recipe.active_craft_time

# Re-roll: 3 free per day per slot
# Re-rolling one slot locks all others
```

### Step 4 — Validate Daily Totals
```python
total_cal = sum(recipe.stat_buffs.calories for recipe in selected_recipes)
if abs(total_cal - daily_cal) > daily_cal * 0.15:  # >15% off target
    adjust portion sizes proportionally per slot

total_time = sum(recipe.active_craft_time for recipe in selected_recipes)
if total_time > player.cooking.max_daily_prep_min:
    swap longest-active-time recipe with quicker alternative
```

### Step 5 — Build Crafting Schedule (CPM)
```
1. Collect ALL tasks from ALL rolled recipes.
2. Identify shared materials → merge into batch-crafting tasks.
3. Sort by passive_craft_time DESC (longest first, run in background).
4. Interleave active tasks during passive wait times.
5. Output: ordered crafting_queue with time_offset_min per task.
```

### Loot Table — Scoring Implementation

```python
def score_recipe(recipe, inventory, goals):
    inventory_normalized = {normalize(i.item_name) for i in inventory}

    # Decay urgency: does this recipe use items about to expire?
    urgency_items = [i for i in inventory if normalize(i.item_name) in
                     {normalize(ing) for ing in recipe.ingredients}]
    decay_urgency = sum(max(0, 1 - (i.expire_date - date.today()).days / 7)
                        for i in urgency_items)
    decay_urgency = min(100, decay_urgency * 25)

    # Inventory match: % of recipe ingredients already owned
    matched = sum(1 for ing in recipe.ingredients
                  if normalize(ing) in inventory_normalized)
    inventory_match = (matched / max(1, len(recipe.ingredients))) * 100

    # Stat alignment: protein match per meal
    target = goals.get("protein", 120) / 3
    stat_alignment = max(0, 100 - abs(recipe.nutrition["protein"] - target) * 3)

    return decay_urgency * 0.5 + inventory_match * 0.3 + stat_alignment * 0.2


def roll(player_id, goals):
    inventory = get_inventory(player_id)
    player = get_player(player_id)
    selected = {}

    for meal_type in ["breakfast", "lunch", "dinner"]:
        pool = filter_recipes(meal_type, player.dietary_restrictions)
        if len(pool) < 3:
            pool = get_all_recipes(meal_type)  # relax restrictions as fallback

        scored = sorted(pool, key=lambda r: score_recipe(r, inventory, goals), reverse=True)
        top_pool = scored[:max(5, len(scored) // 5)]
        scores = [score_recipe(r, inventory, goals) for r in top_pool]
        selected[meal_type] = random.choices(top_pool, weights=scores, k=1)[0]

    return selected
```

### Rarity Assignment

```python
def assign_rarity(nutrition):
    protein = nutrition.get("protein", 0)
    if protein >= 35:    return "legendary"   # gold flash
    if protein >= 25:    return "rare"        # silver shimmer
    if protein >= 15:    return "uncommon"    # blue tint
    return "common"                            # gray shimmer
```

---

## 6. Spoonacular API & Caching

### Strategy
Free tier: 150 req/day. During demo, **zero live API calls**.

**Seed script** (run once before hackathon):
```python
# GET /recipes/complexSearch
# Params: type="breakfast"|"main course", number=100, addRecipeNutrition=true
# 3 calls × 100 results = 3 API calls with pagination
# Fields: id, title, readyInMinutes, nutrition.nutrients, extendedIngredients, dishTypes
```

Roll logic queries local DB only. Fallback: if cache < 10 per meal type, show seed warning.

### Dietary Filter
```python
DIET_MAP = {
    "vegetarian": "vegetarian",
    "vegan": "vegan",
    "dairy-free": "dairyfree",
    "gluten-free": "glutenFree",
}
# MVP: seed omnivore pool, store Spoonacular's `diets` array per recipe
# filter_recipes() applies: [r for r in pool if all(d in r.diets for d in restrictions)]
```

### Ingredient Normalization

```python
SYNONYMS = {
    "chicken": ["chicken breast", "chicken thigh", "chicken legs", "rotisserie chicken"],
    "beef": ["ground beef", "beef steak", "steak", "ground meat"],
    "rice": ["brown rice", "white rice", "basmati rice", "jasmine rice"],
    "pasta": ["spaghetti", "penne", "fettuccine", "rigatoni"],
    "lemon": ["lemon juice", "lemon zest"],
    "tomato": ["cherry tomatoes", "diced tomatoes", "tomato sauce", "tomato paste"],
    "onion": ["yellow onion", "red onion", "white onion"],
    "garlic": ["garlic cloves", "minced garlic"],
    "egg": ["eggs", "egg whites", "egg yolks"],
    "milk": ["whole milk", "skim milk", "almond milk", "oat milk"],
    "oil": ["olive oil", "vegetable oil", "coconut oil", "sesame oil"],
    "pepper": ["black pepper", "bell pepper", "red pepper", "chili pepper"],
}

REVERSE_MAP = {}
for canonical, aliases in SYNONYMS.items():
    for alias in aliases:
        REVERSE_MAP[alias.lower()] = canonical

def normalize(name):
    return REVERSE_MAP.get(name.lower(), name.lower())
```

### Inventory Decay (Frontend)

```js
const days = Math.max(0, differenceInDays(expire_date, today))
const hp = Math.min(1.0, days / 7)
// Under 20%: critical (striped bar), under 50%: warning, over 50%: healthy
// Expired items not auto-deleted — seeing them creates regret (reinforces game loop)
```

---

## 7. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Tailwind CSS | Fast UI, great for gamified styling |
| State | Zustand | Lightweight, perfect for inventory + player stats |
| Backend | FastAPI (Python) | Ideal for RNG logic, weighted loot tables |
| Database | PostgreSQL + Prisma | Relational data, strong query support |
| Recipe Data | Spoonacular API (cached) | 365k+ recipes, dietary filters built in |
| Animations | Framer Motion / Lottie | Crucial for gacha roll and quest completion |

### Architecture Decision: Full-Stack (not frontend-only)

Loot table weighting is numerical Python work, not presentation work. Keep it in FastAPI. React's only job is animation + UI state. Spoonacular API key stays out of the client bundle.

Deploy: Railway (backend + PostgreSQL) + Vercel (frontend).

### Auth (Hackathon Simplified)

No OAuth. Character creation = implicit account creation:
- User enters `username` → `POST /api/player` creates record, returns `player_id` in localStorage.
- `player_id` (UUID) sent with every API request. Trust the client for demo.

---

## 8. State Management (Zustand)

```
Global State
  ├── player
  │     ├── preferences (diet, allergies, meals, macros, equipment)
  │     ├── theme
  │     └── settings (re-roll limit, repeat cooldown)
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
  │     ├── current_dish_card
  │     └── is_rolling (animation flag)
  │
  ├── favorites
  │     ├── hearted_ids[]
  │     ├── blocked_ids[]
  │     └── skip_counts{}
  │
  └── history[]
        └── { date, plan }
```

---

## 9. API Endpoints

### Player
```
POST   /api/onboarding              → Save initial preferences + body stats
GET    /api/player                   → Get player profile + preferences
PATCH  /api/player/preferences       → Update any preference field
POST   /api/player/body-stats        → Save/update body stats
POST   /api/player/meal-preset       → Apply a meal preference preset
GET    /api/player/calculated        → Returns BMR, TDEE, daily calories, macro targets
POST   /api/player/recalculate       → Force recalculate after body stats change
```

### Inventory
```
GET    /api/inventory                → List all grocery items
POST   /api/inventory                → Add item (item_name + expire_date required)
PATCH  /api/inventory/:id            → Update item (quantity, expiry)
DELETE /api/inventory/:id            → Remove item
```

### Roll & Plan
```
POST   /api/roll                     → { slot: "lunch" } → returns rolled dish card
POST   /api/roll/reroll              → Re-roll (checks 3/day limit)
POST   /api/roll/lock                → { slot, recipe_id } → lock dish into plan
GET    /api/player/rerolls           → { remaining: int, resets_at: datetime }
GET    /api/plan/today               → Get today's plan (all slots)
PATCH  /api/plan/today/:slot/done    → Mark slot as done
GET    /api/player/progress/today    → Daily progress (consumed vs target)
```

### Dishes & Social
```
POST   /api/dish/:id/heart           → Heart a dish
DELETE /api/dish/:id/heart           → Remove heart
POST   /api/dish/:id/skip            → Increment skip count
POST   /api/dish/:id/block           → Block permanently
DELETE /api/dish/:id/block           → Unblock
GET    /api/favorites                → List hearted dishes
GET    /api/history                  → Past plans (paginated)
GET    /api/shopping-list            → Missing ingredients for today
```

---

## 10. Gacha Animation

```jsx
// Framer Motion slot machine. Three reels spin sequentially.
// Total animation: ~4.5s
const REEL_DURATION = 1.2  // seconds of cycling
const SETTLE_DURATION = 0.3  // spring bounce

// Reel cycles through 8 recipe titles before settling.
// Spring: { type: "spring", stiffness: 80, damping: 15 }
// On settle: trigger rarity flash (0.5s overlay)
//   common: gray shimmer | rare/legendary: gold pulse with scale 1.0→1.05→1.0
// Re-roll during animation: queues, does not interrupt.
```

---

## 11. Error Handling

| Scenario | Behavior |
|---|---|
| Spoonacular down | Cache-only mode. Non-issue during demo. |
| Recipe cache < 3 per meal type | "Roll unavailable — refilling tavern..." + retry button |
| expire_date in the past | Form validation: "Date must be in the future." |
| Filtered pool < 3 recipes | Show available + "Tavern is sparse — relax your filters." |
| Re-rolls exhausted | Button grays out: "0 re-rolls remaining. Resets at midnight." |

---

## 12. Build Plan

### Sprints

| Sprint | Focus | Deliverable |
|---|---|---|
| **1** | Foundation & Inventory | Scaffolding, character creation, inventory CRUD + decay timers |
| **2** | Recipe Layer | Spoonacular integration, Grimoire page, ingredient normalization |
| **3** | RNG Engine | Loot table, gacha roll animation, crafting schedule |
| **4** | Quest Log | Quest log page, crafting timeline, merchant list |
| **5** | Polish | Re-roll mechanics, sound effects, stat tracking, streaks |

### Hackathon Time Budget (24h)

| Task | Hours |
|---|---|
| Scaffold (React + FastAPI + Docker Compose + deploy configs) | 1 |
| Seed recipes script (Spoonacular cache) | 1 |
| Player auth / character creation | 1 |
| Inventory CRUD (backend + frontend) | 3 |
| Loot table endpoint | 2 |
| Gacha animation (Framer Motion) — **demo centerpiece, don't cut** | 4 |
| Quest Log screen | 2 |
| Re-roll mechanic | 1 |
| Railway + Vercel deploy | 1 |
| Bug fixes + demo rehearsal | 2 |
| **Total** | **18** |

6h buffer for debugging, iteration, and sleep.

### Success Criteria

**Hackathon Demo:**
- [ ] User can add 5+ items to inventory with decay bars visible
- [ ] Gacha roll animates and settles on 3 recipes in ~2 seconds
- [ ] Quest Log renders batch crafting + 3 meal quests with stat chips
- [ ] Re-roll works (3/day, counter visible)
- [ ] Dietary filter respected (one allergen exclusion demonstrable live)
- [ ] No crashes during the 2-min demo path

**Post-Hackathon:**
- [ ] CPM scheduling (swap in for flat crafting queue)
- [ ] Achievement / streak system
- [ ] Merchant list (shopping list export)

### Deployment

Railway (free tier) for FastAPI + PostgreSQL. Vercel for React. `railway.toml` + `vercel.json` added during scaffold step.

### Next Steps

1. Project scaffold — Vite React + FastAPI + Docker Compose + deploy configs
2. Seed script — pull 100+ recipes per meal type from Spoonacular
3. Inventory CRUD — MVP form: item_name + expire_date
4. Loot table endpoint — implement score_recipe()
5. Gacha animation — Framer Motion slot machine (centerpiece)
6. Quest Log — render roll result + batch crafting + stat summary
7. Re-roll mechanic — 3/day, backend decrement, UTC date reset
8. Deploy — Railway + Vercel, test live URL before presentation
