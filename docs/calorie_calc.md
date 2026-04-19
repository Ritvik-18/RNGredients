# RNGredients — Body Stats, Calorie Calculation & Fitness Targets

> **Build reference file.** This defines the inputs, formulas, and output logic for calculating daily calorie/macro needs.
> Use when building: onboarding body stats screen, auto-calc API, nutrition goal engine, daily progress tracking.
> Related: [user_preferences.md](user_preferences.md) §4, [tree.md](tree.md) §4 (nutrition dashboard)

---

## 1. Body Stats Input (Onboarding + Settings)

Collected during onboarding. Editable anytime in Settings → Profile.

### 1.1 Required Fields

| Field | Type | Validation | Example |
|---|---|---|---|
| `age` | int | 13–120 | 28 |
| `gender` | enum | `male`, `female`, `other` | `male` |
| `height_cm` | float | 100–250 cm | 175 |
| `weight_kg` | float | 30–300 kg | 72 |
| `activity_level` | enum | See §1.2 | `moderately_active` |
| `fitness_target` | enum | See §2 | `lose_weight` |

> Allow imperial input (ft/in, lbs) with auto-conversion to metric for all calculations.
> `height_cm = (feet * 30.48) + (inches * 2.54)`
> `weight_kg = lbs * 0.4536`

### 1.2 Activity Level Definitions

| Level ID | Label | Description | TDEE Multiplier |
|---|---|---|---|
| `sedentary` | Sedentary | Desk job, little to no exercise | 1.2 |
| `lightly_active` | Lightly Active | Light exercise 1–3 days/week | 1.375 |
| `moderately_active` | Moderately Active | Moderate exercise 3–5 days/week | 1.55 |
| `very_active` | Very Active | Hard exercise 6–7 days/week | 1.725 |
| `extra_active` | Extra Active | Very hard exercise + physical job | 1.9 |

---

## 2. Fitness Targets

User picks ONE target. This determines calorie adjustment applied to TDEE.

| Target ID | Label | Calorie Adjustment | Typical For |
|---|---|---|---|
| `lose_weight_fast` | Aggressive Cut | TDEE − 750 kcal | Rapid weight loss (not recommended long-term) |
| `lose_weight` | Lose Weight | TDEE − 500 kcal | ~0.45 kg (1 lb) loss/week |
| `lose_weight_slow` | Slow Cut | TDEE − 250 kcal | Gentle, sustainable loss |
| `maintain` | Maintain Weight | TDEE ± 0 | Stay at current weight |
| `lean_bulk` | Lean Bulk | TDEE + 250 kcal | Slow muscle gain, minimal fat |
| `bulk` | Bulk | TDEE + 500 kcal | Muscle building, ~0.25 kg gain/week |
| `aggressive_bulk` | Aggressive Bulk | TDEE + 750 kcal | Maximum muscle gain (expect some fat) |

### Target → Macro Preset Suggestions

The system suggests (not forces) a macro split based on the fitness target:

| Target | Suggested Macro Preset | Protein (g/kg bodyweight) |
|---|---|---|
| `lose_weight_fast` | High Protein | 2.0–2.4 g/kg |
| `lose_weight` | High Protein | 1.8–2.2 g/kg |
| `lose_weight_slow` | Balanced | 1.6–2.0 g/kg |
| `maintain` | Balanced | 1.4–1.8 g/kg |
| `lean_bulk` | High Protein | 1.8–2.2 g/kg |
| `bulk` | Balanced | 1.6–2.0 g/kg |
| `aggressive_bulk` | Balanced | 1.6–2.0 g/kg |

> User can always override with any macro preset or custom sliders.

---

## 3. Formulas

### 3.1 BMR — Basal Metabolic Rate (Mifflin-St Jeor)

The calories your body burns at complete rest.

```python
def calculate_bmr(gender: str, weight_kg: float, height_cm: float, age: int) -> float:
    """
    Mifflin-St Jeor equation.
    Most accurate BMR formula for general population (Frankenfield et al., 2005).
    """
    if gender == "male":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    elif gender == "female":
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    else:
        # Non-binary: average of male and female
        male_bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
        female_bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
        bmr = (male_bmr + female_bmr) / 2
    return round(bmr)
```

**Example:** Male, 72 kg, 175 cm, 28 years old
```
BMR = (10 × 72) + (6.25 × 175) − (5 × 28) + 5
    = 720 + 1093.75 − 140 + 5
    = 1,679 kcal/day
```

### 3.2 TDEE — Total Daily Energy Expenditure

```python
def calculate_tdee(bmr: float, activity_level: str) -> float:
    """TDEE = BMR × activity multiplier."""
    multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }
    return round(bmr * multipliers[activity_level])
```

**Example (continued):** Moderately active
```
TDEE = 1,679 × 1.55 = 2,602 kcal/day
```

### 3.3 Daily Calorie Target

```python
def calculate_daily_calories(tdee: float, fitness_target: str) -> int:
    """Apply fitness target adjustment to TDEE."""
    adjustments = {
        "lose_weight_fast": -750,
        "lose_weight": -500,
        "lose_weight_slow": -250,
        "maintain": 0,
        "lean_bulk": 250,
        "bulk": 500,
        "aggressive_bulk": 750,
    }
    target = tdee + adjustments[fitness_target]
    # Safety floor: never below 1200 kcal (women) or 1500 kcal (men)
    return max(1200, round(target))
```

**Example (continued):** Lose weight
```
Daily target = 2,602 − 500 = 2,102 kcal/day
```

### 3.4 Macro Gram Calculation

```python
def calculate_macros(daily_calories: int, macro_preset: dict, weight_kg: float) -> dict:
    """
    Convert macro percentages to grams.
    1g protein = 4 kcal, 1g carbs = 4 kcal, 1g fat = 9 kcal.
    """
    protein_cal = daily_calories * (macro_preset["protein_pct"] / 100)
    carbs_cal = daily_calories * (macro_preset["carbs_pct"] / 100)
    fat_cal = daily_calories * (macro_preset["fat_pct"] / 100)

    return {
        "protein_g": round(protein_cal / 4),
        "carbs_g": round(carbs_cal / 4),
        "fat_g": round(fat_cal / 9),
        "fiber_g": 25 if daily_calories < 2000 else 30,  # general guideline
        "protein_per_kg": round(protein_cal / 4 / weight_kg, 1),
    }
```

**Example (continued):** Balanced (50/25/25), 2,102 kcal
```
Protein: 2,102 × 0.25 / 4 = 131g  (1.8 g/kg ✓)
Carbs:   2,102 × 0.50 / 4 = 263g
Fat:     2,102 × 0.25 / 9 = 58g
Fiber:   30g
```

### 3.5 Per-Meal Calorie & Macro Targets

```python
def calculate_per_meal(daily_targets: dict, meal_structure: list) -> list:
    """
    Split daily targets across meal slots based on calorie_pct.
    meal_structure example: [
        {"slot": "breakfast", "calorie_pct": 20},
        {"slot": "lunch", "calorie_pct": 30},
        {"slot": "dinner", "calorie_pct": 35},
        {"slot": "snack", "calorie_pct": 15}
    ]
    """
    meals = []
    for slot in meal_structure:
        pct = slot["calorie_pct"] / 100
        meals.append({
            "slot": slot["slot"],
            "calories": round(daily_targets["daily_calories"] * pct),
            "protein_g": round(daily_targets["protein_g"] * pct),
            "carbs_g": round(daily_targets["carbs_g"] * pct),
            "fat_g": round(daily_targets["fat_g"] * pct),
        })
    return meals
```

**Example (continued):** 3 meals + 1 snack
```
Breakfast (20%):  420 kcal | 26g protein | 53g carbs | 12g fat
Lunch     (30%):  631 kcal | 39g protein | 79g carbs | 17g fat
Dinner    (35%):  736 kcal | 46g protein | 92g carbs | 20g fat
Snack     (15%):  315 kcal | 20g protein | 39g carbs |  9g fat
```

---

## 4. Meal Preference Presets

User picks a preset that configures both diet_profile + macro_preset together. Can be overridden individually.

| Preset ID | Label | Diet Profile | Macro Split (C/P/F) | Notes |
|---|---|---|---|---|
| `balanced` | Balanced | omnivore | 50 / 25 / 25 | Default for most users |
| `high_protein` | High Protein | omnivore | 30 / 40 / 30 | Fitness-focused, muscle building |
| `vegan` | Vegan | vegan | 55 / 20 / 25 | Plant-based, flag B12/iron |
| `vegan_athlete` | Vegan Athlete | vegan | 40 / 30 / 30 | Higher protein plant-based |
| `vegetarian` | Vegetarian | vegetarian | 50 / 25 / 25 | No meat/fish |
| `keto` | Keto | keto | 5 / 25 / 70 | Very low carb, high fat |
| `low_carb` | Low Carb | omnivore | 20 / 35 / 45 | Moderate restriction |
| `low_fat` | Low Fat | omnivore | 60 / 25 / 15 | Heart-healthy aligned |
| `diabetic` | Diabetic-Friendly | diabetic_friendly | 40 / 30 / 30 | Low-GI, controlled carbs, flag sugar |
| `dash` | Heart-Healthy (DASH) | heart_healthy | 55 / 20 / 25 | Low sodium emphasis |
| `mediterranean` | Mediterranean | mediterranean | 45 / 20 / 35 | Healthy fats, lean protein |
| `paleo` | Paleo | paleo | 25 / 35 / 40 | No grains/legumes/dairy |
| `whole30` | Whole30 | whole30 | 30 / 30 / 40 | Strict elimination |
| `anti_inflammatory` | Anti-Inflammatory | anti_inflammatory | 45 / 25 / 30 | For PCOS, autoimmune, etc. |
| `custom` | Custom | (user picks) | (user sets) | Full manual control |

### Preset → What it Configures

```python
def apply_meal_preset(preset_id: str, player: dict) -> dict:
    """
    A meal preference preset is a SHORTCUT that sets:
    1. diet_profile (hard filter for recipes)
    2. macro_preset (scoring weight for recipes)
    3. health flags (optional extra filters)
    """
    preset = PRESETS[preset_id]
    player["diet_profile"] = preset["diet_profile"]
    player["nutrition_goals"]["macro_preset"] = preset_id
    player["nutrition_goals"]["macros"] = preset["macros"]
    
    # Auto-enable relevant health tracking
    if preset_id == "diabetic":
        player["nutrition_goals"]["track_micros"].append("sugar")
        player["nutrition_goals"]["flag_high_gi"] = True
    elif preset_id == "dash":
        player["nutrition_goals"]["track_micros"].append("sodium")
    
    return player
```

---

## 5. Daily Progress Tracking

### 5.1 What We Track Per Day

| Metric | Source | Display |
|---|---|---|
| `calories_target` | Calculated from §3 | Number + progress bar |
| `calories_consumed` | Sum of locked-in meal calories | Progress fill |
| `protein_g_target` | From macro calc | Bar + number |
| `protein_g_consumed` | Sum of locked meals | Progress fill |
| `carbs_g_target` | From macro calc | Bar + number |
| `carbs_g_consumed` | Sum of locked meals | Progress fill |
| `fat_g_target` | From macro calc | Bar + number |
| `fat_g_consumed` | Sum of locked meals | Progress fill |
| `fiber_g` | 25–30g guideline | Optional bar |
| `sodium_mg` | If tracking | Optional bar |
| `sugar_g` | If diabetic preset | Optional bar |
| `water_ml` | Optional manual input | Optional bar |

### 5.2 Progress Calculation

```python
def calculate_daily_progress(plan: dict, targets: dict) -> dict:
    """
    Run after each dish is locked in or marked done.
    Returns progress percentages for all tracked metrics.
    """
    consumed = {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
    
    for slot in plan["quests"]:
        if slot["status"] in ("locked", "done"):
            recipe = get_recipe(slot["recipe_id"])
            consumed["calories"] += recipe["stat_buffs"]["calories"]
            consumed["protein_g"] += recipe["stat_buffs"]["protein"]
            consumed["carbs_g"] += recipe["stat_buffs"].get("carbs", 0)
            consumed["fat_g"] += recipe["stat_buffs"].get("fat", 0)
    
    return {
        "calories": {
            "consumed": consumed["calories"],
            "target": targets["daily_calories"],
            "pct": round(consumed["calories"] / targets["daily_calories"] * 100),
            "status": get_status(consumed["calories"], targets["daily_calories"])
        },
        "protein_g": {
            "consumed": consumed["protein_g"],
            "target": targets["protein_g"],
            "pct": round(consumed["protein_g"] / targets["protein_g"] * 100),
            "status": get_status(consumed["protein_g"], targets["protein_g"])
        },
        # ... same for carbs, fat, others
    }

def get_status(consumed: float, target: float) -> str:
    pct = consumed / target * 100
    if pct < 50:
        return "low"        # red zone
    elif pct < 80:
        return "on_track"   # yellow zone  
    elif pct <= 110:
        return "good"       # green zone
    else:
        return "over"       # red zone (exceeded)
```

### 5.3 Progress Bar Color Mapping (Game Theme)

| Status | Color | Stat Bar Appearance |
|---|---|---|
| `low` (< 50%) | `--error` | Red bar, pulsing "Low HP" warning |
| `on_track` (50–79%) | `--warning` | Yellow bar, steady |
| `good` (80–110%) | `--success` | Green bar, full glow |
| `over` (> 110%) | `--error` | Red bar, "OVER-BUFFED" label |

---

## 6. Data Model — Player Body Stats & Targets

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
  "calculated": {
    "bmr": 1679,
    "tdee": 2602,
    "daily_calories": 2102,
    "macros": {
      "protein_g": 131,
      "carbs_g": 263,
      "fat_g": 58,
      "fiber_g": 30,
      "protein_per_kg": 1.8
    },
    "per_meal": [
      { "slot": "breakfast", "calories": 420, "protein_g": 26, "carbs_g": 53, "fat_g": 12 },
      { "slot": "lunch",     "calories": 631, "protein_g": 39, "carbs_g": 79, "fat_g": 17 },
      { "slot": "dinner",    "calories": 736, "protein_g": 46, "carbs_g": 92, "fat_g": 20 },
      { "slot": "snack",     "calories": 315, "protein_g": 20, "carbs_g": 39, "fat_g": 9 }
    ]
  }
}
```

---

## 7. API Endpoints

```
POST   /api/player/body-stats      → Save/update body stats (age, gender, height, weight)
POST   /api/player/activity-level   → Save activity level
POST   /api/player/fitness-target   → Save fitness target
POST   /api/player/meal-preset      → Apply a meal preference preset

GET    /api/player/calculated       → Returns BMR, TDEE, daily calories, macro targets, per-meal targets
GET    /api/player/progress/today   → Returns daily progress (consumed vs target for all metrics)

POST   /api/player/recalculate      → Force recalculate (after body stats change)
```

---

## 8. Onboarding Integration

These screens map to the existing onboarding flow in [tree.md](tree.md):

```
Screen 2 (updated): "Your Adventure Stats"
  ├── Age (number input)
  ├── Gender (select: Male / Female / Other)
  ├── Height (input + unit toggle cm / ft'in")
  ├── Weight (input + unit toggle kg / lbs)
  └── Activity level (5 cards with descriptions)

Screen 3 (updated): "Choose Your Quest" (Fitness Target)
  ├── Visual cards with icons:
  │     🏃 Lose Weight (Fast / Normal / Slow)
  │     ⚖️ Maintain
  │     💪 Bulk (Lean / Normal / Aggressive)
  └── Shows calculated daily calorie target in real-time as user picks

Screen 4 (updated): "Meal Style" (Preference Preset)
  ├── Grid of preset cards:
  │     Balanced | High Protein | Vegan | Keto | Diabetic | Low Fat | Mediterranean | Custom
  ├── Each card shows: icon + macro pie chart + short description
  ├── Selecting a preset auto-fills: diet_profile + macros
  └── "Customize" button opens manual macro sliders

Screen 5 (same): "Set Your Wards" → Allergies + exclusions
Screen 6 (same): "Daily Quest Structure" → Meals per day
Screen 7 (same): "Equip Your Kitchen" → Appliances

Screen 8 (updated): "Review & Begin"
  └── NOW shows calculated summary:
        Daily Target: 2,102 kcal
        Macros: 131g P / 263g C / 58g F
        Meals: 4 (B/L/D/S)
        Per-meal breakdown preview
```
