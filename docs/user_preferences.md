# RNGredients — Character Creation & User Preferences

> **Build reference file.** This defines every user-configurable option.
> Use when building: onboarding UI, preference forms, DB enum values, recipe filter/scoring logic.
> For architecture, algorithm, and data models → see [meal_prep.md](meal_prep.md)

All possible choices a user (player) can configure during onboarding and at any time through settings.

---

## 1. Dietary Profiles (Choose One Primary)

| Diet | Description | Excludes |
|---|---|---|
| **Omnivore** | No restrictions, eats everything | — |
| **Vegetarian** | No meat or fish | Meat, poultry, fish, seafood |
| **Lacto-Vegetarian** | Vegetarian + dairy | Meat, poultry, fish, seafood, eggs |
| **Ovo-Vegetarian** | Vegetarian + eggs | Meat, poultry, fish, seafood, dairy |
| **Pescatarian** | Vegetarian + fish/seafood | Meat, poultry |
| **Vegan** | No animal products at all | Meat, poultry, fish, seafood, dairy, eggs, honey |
| **Raw Vegan** | Vegan + no cooking above 48°C (118°F) | All cooked food + animal products |
| **Flexitarian** | Mostly plant-based, occasional meat | — (flag meat meals as occasional) |
| **Keto** | Very low carb, high fat | High-carb foods (bread, pasta, rice, sugar, most fruits) |
| **Paleo** | "Ancestral" eating | Grains, legumes, dairy, processed foods, refined sugar |
| **Whole30** | Strict elimination | Sugar, alcohol, grains, legumes, soy, dairy |
| **Mediterranean** | Plant-forward, healthy fats, lean protein | Processed foods, red meat (limited) |
| **Low-FODMAP** | For IBS/digestive issues | High-FODMAP foods (garlic, onion, wheat, certain fruits) |
| **Carnivore** | Animal products only | All plant-based foods |
| **Diabetic-Friendly** | Low glycemic index focus | High-GI foods, excess sugar |
| **Heart-Healthy (DASH)** | Low sodium, lean protein | High-sodium, saturated fats, processed meats |
| **Anti-Inflammatory** | Focused on reducing inflammation | Sugar, refined carbs, trans fats, processed meats |

---

## 2. Allergies & Intolerances (Multi-Select)

### 2.1 Top 14 Allergens (EU/FDA Regulated)

These are legally recognized major allergens and **must** be treated as hard exclusions:

| Allergen | Common Sources |
|---|---|
| **Peanuts** | Peanut butter, satay sauce, some Asian dishes |
| **Tree Nuts** | Almonds, cashews, walnuts, pecans, pistachios, hazelnuts, macadamia, brazil nuts |
| **Milk / Dairy** | Cheese, butter, cream, yogurt, whey, casein |
| **Eggs** | Baked goods, mayonnaise, pasta, meringue |
| **Wheat** | Bread, pasta, couscous, soy sauce, seitan |
| **Soy** | Tofu, tempeh, soy sauce, edamame, miso |
| **Fish** | Cod, salmon, tuna, anchovy, sardines, fish sauce |
| **Shellfish** | Shrimp, crab, lobster, mussels, oysters, clams, scallops |
| **Sesame** | Tahini, hummus, sesame oil, some breads |
| **Celery** | Stews, soups, spice mixes (common in EU) |
| **Mustard** | Sauces, dressings, marinades |
| **Lupin** | Flour in pastries (common in EU) |
| **Mollusks** | Squid, octopus, snails |
| **Sulfites** | Wine, dried fruits, preservatives |

### 2.2 Additional Intolerances (Common Non-Allergen Sensitivities)

| Intolerance | Affected Foods |
|---|---|
| **Lactose** | Milk, soft cheese, ice cream (hard cheese and yogurt may be tolerated) |
| **Gluten** | Wheat, barley, rye, triticale, some oats |
| **Fructose** | Apples, pears, honey, agave, high-fructose corn syrup |
| **Histamine** | Aged cheese, fermented foods, cured meats, red wine, spinach |
| **Nightshades** | Tomatoes, peppers, potatoes, eggplant |
| **Corn** | Cornstarch, corn syrup, tortillas, popcorn |
| **Caffeine** | Coffee, tea, chocolate |
| **Alcohol** | Wine, beer, spirits, cooking wine |
| **MSG** | Chinese food, canned soups, processed snacks |
| **Artificial Sweeteners** | Diet soda, sugar-free products |
| **Salicylates** | Berries, spices, mint, tea |
| **FODMAP sensitivity** | Onion, garlic, wheat, beans, certain fruits |

### 2.3 Custom Exclusion (Free Text)
- Allow user to type any ingredient they personally avoid (e.g., "cilantro", "blue cheese")
- These are stored as soft exclusions (same behavior as allergens during recipe filtering)

---

## 3. Meal Structure (Number of Meals Per Day)

User selects how many meals they want planned. This directly affects recipe selection and calorie distribution.

| Option | Meals | Default Calorie Split |
|---|---|---|
| **2 meals** | Lunch + Dinner | 45% / 55% |
| **3 meals** | Breakfast + Lunch + Dinner | 25% / 35% / 40% |
| **3 meals + Snack** | Breakfast + Lunch + Dinner + 1 Snack | 20% / 30% / 35% / 15% |
| **3 meals + 2 Snacks** | Breakfast + Lunch + Dinner + AM Snack + PM Snack | 20% / 25% / 30% / 12.5% / 12.5% |
| **4 meals** | Breakfast + Mid-Morning + Lunch + Dinner | 20% / 15% / 30% / 35% |
| **5 meals** | Breakfast + Snack + Lunch + Snack + Dinner | 20% / 10% / 25% / 10% / 35% |
| **6 meals (bodybuilding)** | Every 2.5–3 hours | ~16.7% each |
| **1 meal (OMAD)** | One Meal A Day | 100% |
| **Intermittent Fasting 16:8** | 2–3 meals in 8-hour window | User picks window start time |
| **Intermittent Fasting 20:4** | 1–2 meals in 4-hour window | User picks window start time |
| **Custom** | User defines count + labels | User sets calorie split |

### Meal Type Tags (Assignable)
Each meal slot can be tagged:
- `breakfast` — lighter, quick-prep
- `lunch` — medium, portable-friendly
- `dinner` — heavier, more elaborate
- `snack` — small, <300 cal
- `pre-workout` — high carb, moderate protein
- `post-workout` — high protein, moderate carb
- `dessert` — sweet, optional treat

---

## 4. Nutrition & Macro Goals (Stat Buffs)

### 4.1 Calorie Goal

> Full calculation formulas (BMR, TDEE, target) with code → see [calorie_calc.md](calorie_calc.md) §3

| Method | Description |
|---|---|
| **Manual** | User enters exact daily kcal target |
| **Auto-calculate** | Based on age, gender, height, weight, activity level (Mifflin-St Jeor equation) → [calorie_calc.md §3.1](calorie_calc.md#31-bmr--basal-metabolic-rate-mifflin-st-jeor) |
| **Goal-based** | Fitness target adjusts TDEE: Lose (−250 to −750), Maintain (±0), Bulk (+250 to +750) → [calorie_calc.md §2](calorie_calc.md#2-fitness-targets) |

### 4.1.1 Fitness Targets

| Target | Adjustment | Typical Use |
|---|---|---|
| Aggressive Cut | TDEE − 750 | Rapid weight loss |
| Lose Weight | TDEE − 500 | ~1 lb/week loss |
| Slow Cut | TDEE − 250 | Gentle, sustainable |
| Maintain | TDEE ± 0 | Stay current |
| Lean Bulk | TDEE + 250 | Slow muscle gain |
| Bulk | TDEE + 500 | Muscle building |
| Aggressive Bulk | TDEE + 750 | Maximum gain |

### 4.1.2 Meal Preference Presets (Quick Setup)

Shortcuts that set diet_profile + macro split together:

| Preset | Diet | Macros (C/P/F) |
|---|---|---|
| Balanced | Omnivore | 50/25/25 |
| High Protein | Omnivore | 30/40/30 |
| Vegan | Vegan | 55/20/25 |
| Keto | Keto | 5/25/70 |
| Diabetic | Diabetic-Friendly | 40/30/30 |
| Low Fat | Omnivore | 60/25/15 |
| Mediterranean | Mediterranean | 45/20/35 |
| Custom | (user picks) | (user sets) |

> Full preset table with all 14 options → see [calorie_calc.md §4](calorie_calc.md#4-meal-preference-presets)

### 4.2 Macro Targets

| Preset | Carbs | Protein | Fat |
|---|---|---|---|
| **Balanced** | 50% | 25% | 25% |
| **High Protein** | 35% | 40% | 25% |
| **Low Carb** | 20% | 35% | 45% |
| **Keto** | 5–10% | 20–25% | 65–75% |
| **Low Fat** | 55% | 25% | 20% |
| **Zone Diet (40/30/30)** | 40% | 30% | 30% |
| **Custom** | User sets each % (must sum to 100%) |

### 4.3 Micronutrient Tracking (Optional, Advanced)
- Fiber (g/day)
- Sodium (mg/day) — important for DASH / heart-healthy
- Sugar (g/day) — important for diabetic-friendly
- Iron (mg/day) — important for vegetarians/vegans
- Calcium (mg/day) — important for dairy-free diets
- Vitamin B12 — flag if vegan

---

## 5. Cuisine Preferences (Multi-Select)

User selects cuisines they enjoy. Used for preference weighting in the RNG roll.

| Region | Cuisines |
|---|---|
| **Asian** | Chinese, Japanese, Korean, Thai, Vietnamese, Indian, Filipino, Indonesian, Malaysian |
| **European** | Italian, French, Spanish, Greek, German, British, Scandinavian, Eastern European |
| **Mediterranean** | Greek, Turkish, Lebanese, Moroccan, Israeli |
| **Americas** | Mexican, Tex-Mex, Brazilian, Peruvian, American, Southern / Soul, Cajun/Creole, Caribbean |
| **African** | Ethiopian, Nigerian, Moroccan, South African, West African, East African |
| **Middle Eastern** | Lebanese, Persian, Turkish, Egyptian, Iraqi |
| **Other** | Fusion, Comfort Food, Street Food |

Optional: "Surprise me" flag → ignores cuisine weighting entirely for maximum variety.

---

## 6. Cooking Preferences

### 6.1 Skill Level
| Level | What it means in-game | Effect on recipes |
|---|---|---|
| **Novice (Lv 1–3)** | Just started cooking | Max 5 steps, basic techniques only |
| **Intermediate (Lv 4–7)** | Comfortable in kitchen | Up to 10 steps, moderate techniques |
| **Advanced (Lv 8–10)** | Confident cook | No restrictions |

### 6.2 Max Prep Time Per Day
- Quick: ≤ 30 min total active time
- Normal: 30–60 min
- Committed: 60–90 min
- Chef Mode: 90+ min (no limit)

### 6.3 Kitchen Equipment Available (Multi-Select)
| Equipment | Unlocks |
|---|---|
| Stovetop | Sautéing, boiling, stir-fry |
| Oven | Baking, roasting, casseroles |
| Microwave | Quick reheating, mug meals |
| Blender | Smoothies, soups, sauces |
| Air Fryer | Crispy dishes without deep frying |
| Instant Pot / Pressure Cooker | Stews, beans, fast braising |
| Slow Cooker | Set-and-forget recipes |
| Grill | Grilled meats, veggies |
| Food Processor | Chopping, dough, dips |
| Rice Cooker | Rice, grains |
| Stand Mixer | Baking-heavy recipes |
| Sous Vide | Precision protein cooking |
| Waffle/Sandwich Maker | Quick breakfast recipes |
| None of the above | Microwave + no-cook recipes only |

### 6.4 Cooking Methods Preference (Optional)
- Baking, Grilling, Stir-fry, Steaming, Raw/No-cook, One-pot, Sheet pan, Slow-cook

---

## 7. Lifestyle & Scheduling

### 7.1 Prep Day vs. Daily
| Mode | Description |
|---|---|
| **Daily Prep** | Plan and cook each day |
| **Weekly Batch Prep** | Prep all meals on 1–2 designated days (e.g., Sunday) |
| **Hybrid** | Batch-prep base components, assemble daily |

### 7.2 Meal Prep Time Preference
- Morning only (prep before work)
- Evening only (prep after work)
- Anytime
- Specific time window (user-defined)

### 7.3 Servings / Household Size
- 1 person
- 2 people
- 3–4 people (family)
- 5+ people
- Custom per-meal (e.g., lunch for 1, dinner for 4)

---

## 8. Religious & Cultural Dietary Laws (Optional)

| Selection | Rules Applied |
|---|---|
| **Halal** | No pork, no alcohol, meat must be halal-certified |
| **Kosher** | No pork, no shellfish, no mixing meat + dairy, kosher certification |
| **Hindu Vegetarian** | No meat, no eggs, some exclude onion/garlic (Sattvic) |
| **Jain** | Vegetarian + no root vegetables (onion, garlic, potato, carrot) |
| **Buddhist Vegetarian** | Varies — typically no meat, some exclude alliums |
| **Lenten (Christian)** | No meat on Fridays / fasting periods, fish allowed |
| **Seventh-day Adventist** | Often vegetarian, no pork/shellfish, no alcohol/caffeine |
| **Rastafari (Ital)** | No meat (often), no salt, no processed food |
| **Fasting periods** | User can set date ranges for stricter rules (Ramadan, Lent, Navratri, etc.) |

---

## 9. Health Conditions (Optional, Affects Hard Filters)

| Condition | Dietary Implication |
|---|---|
| **Type 1 / Type 2 Diabetes** | Low-GI, controlled carbs, flag sugar content |
| **Hypertension** | Low sodium (DASH diet alignment) |
| **High Cholesterol** | Low saturated fat, limit red meat, no trans fats |
| **GERD / Acid Reflux** | Avoid citrus, tomato, spicy, caffeine, chocolate |
| **IBS** | Low-FODMAP recommendations |
| **Kidney Disease (CKD)** | Low potassium, low phosphorus, controlled protein |
| **Gout** | Low purine (limit organ meats, shellfish, red meat) |
| **Celiac Disease** | Strict gluten-free (not just "low gluten") |
| **Crohn's / IBD** | Low-fiber during flares, avoid trigger foods |
| **PCOS** | Low-GI, anti-inflammatory, balanced macros |
| **Pregnancy** | Avoid raw fish, excess caffeine, unpasteurized dairy, deli meats |
| **Postpartum / Breastfeeding** | Higher calorie needs, avoid allergen-heavy foods for infant sensitivity |
| **Eating Disorder Recovery** | Avoid calorie counting (option to hide numbers), gentle balanced meals |

> **Disclaimer**: This is not medical advice. Users with health conditions should consult their doctor. The app provides general dietary alignment only.

---

## 10. Preference Priority & Conflict Resolution

When preferences overlap or conflict, apply this hierarchy:

```
PRIORITY (highest to lowest):
──────────────────────────
1. Allergies               ← HARD BLOCK — never show these ingredients
2. Health Conditions       ← HARD BLOCK — exclude flagged categories
3. Religious Dietary Laws  ← HARD BLOCK — exclude forbidden items
4. Dietary Profile         ← HARD FILTER — only show matching recipes
5. Intolerances            ← SOFT FILTER — warn but allow override
6. Custom Exclusions       ← SOFT FILTER — warn but allow override
7. Macro Targets           ← SCORING — weight during loot table generation
8. Cuisine Preferences     ← SCORING — weight during loot table generation
9. Cooking Preferences     ← SCORING — weight by time/skill/equipment fit
```

If a conflict arises (e.g., user selects Keto + Hindu Vegetarian), the system should:
1. Flag the tension (keto without meat/eggs is very restrictive)
2. Show viable recipe count for the combination
3. Suggest an adjustment if count is too low

---

## 11. Data Model Update — Player Preferences

> Body stats, BMR/TDEE formulas, fitness targets, and per-meal calorie math → see [calorie_calc.md](calorie_calc.md)

```json
{
  "player_id": "uuid",

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
      { "slot": "breakfast", "calorie_pct": 20 },
      { "slot": "lunch", "calorie_pct": 30 },
      { "slot": "dinner", "calorie_pct": 35 },
      { "slot": "snack", "calorie_pct": 15 }
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
  }
}
```

---

## 12. Onboarding Screen Flow (Character Creation)

```
Screen 1: "Choose Your Class"
  → Select dietary profile (omnivore, vegan, keto, etc.)

Screen 2: "Set Your Wards" (Protections)
  → Allergies (multi-select from top 14 + search)
  → Intolerances (multi-select)
  → Custom exclusions (free text)

Screen 3: "Daily Quest Structure"
  → How many meals per day?
  → Fasting window? (if applicable)
  → Calorie split preview

Screen 4: "Set Your Stats"
  → Calorie goal (auto-calc or manual)
  → Macro balance (preset or custom sliders)

Screen 5: "Choose Your Realm"
  → Cuisine preferences (multi-select with flags)
  → Surprise me toggle

Screen 6: "Equip Your Kitchen"
  → Cooking skill level
  → Available equipment (multi-select)
  → Max daily prep time slider

Screen 7: "Special Modifiers" (Optional)
  → Religious dietary laws
  → Health conditions
  → Household size

Screen 8: "Review & Begin"
  → Summary card of all selections
  → "Start Your Adventure" button
```
