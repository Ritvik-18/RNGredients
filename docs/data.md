# RNGredients — Data Reference

> **All configurable options, formulas, ingredient data, and equipment.** The single source of truth for enums, validation rules, and reference tables.
> Related: [architecture.md](architecture.md) (technical blueprint), [features.md](features.md) (screens & UI), [themes.md](themes.md) (palettes)

---

## 1. Dietary Profiles (Choose One Primary)

| Diet | Description | Excludes |
|---|---|---|
| **Omnivore** | No restrictions | — |
| **Vegetarian** | No meat or fish | Meat, poultry, fish, seafood |
| **Lacto-Vegetarian** | Vegetarian + dairy | Meat, poultry, fish, seafood, eggs |
| **Ovo-Vegetarian** | Vegetarian + eggs | Meat, poultry, fish, seafood, dairy |
| **Pescatarian** | Vegetarian + fish/seafood | Meat, poultry |
| **Vegan** | No animal products | Meat, poultry, fish, seafood, dairy, eggs, honey |
| **Raw Vegan** | Vegan + no cooking above 48°C | All cooked food + animal products |
| **Flexitarian** | Mostly plant-based, occasional meat | — (flag meat meals as occasional) |
| **Keto** | Very low carb, high fat | High-carb foods (bread, pasta, rice, sugar, most fruits) |
| **Paleo** | "Ancestral" eating | Grains, legumes, dairy, processed foods, refined sugar |
| **Whole30** | Strict elimination | Sugar, alcohol, grains, legumes, soy, dairy |
| **Mediterranean** | Plant-forward, healthy fats | Processed foods, red meat (limited) |
| **Low-FODMAP** | For IBS/digestive issues | High-FODMAP foods (garlic, onion, wheat, certain fruits) |
| **Carnivore** | Animal products only | All plant-based foods |
| **Diabetic-Friendly** | Low glycemic index | High-GI foods, excess sugar |
| **Heart-Healthy (DASH)** | Low sodium, lean protein | High-sodium, saturated fats, processed meats |
| **Anti-Inflammatory** | Reduce inflammation | Sugar, refined carbs, trans fats, processed meats |

---

## 2. Allergies & Intolerances (Multi-Select)

### 2.1 Top 14 Allergens (EU/FDA — Hard Exclusions)

| Allergen | Common Sources |
|---|---|
| **Peanuts** | Peanut butter, satay sauce, some Asian dishes |
| **Tree Nuts** | Almonds, cashews, walnuts, pecans, pistachios, hazelnuts, macadamia |
| **Milk / Dairy** | Cheese, butter, cream, yogurt, whey, casein |
| **Eggs** | Baked goods, mayonnaise, pasta, meringue |
| **Wheat** | Bread, pasta, couscous, soy sauce, seitan |
| **Soy** | Tofu, tempeh, soy sauce, edamame, miso |
| **Fish** | Cod, salmon, tuna, anchovy, fish sauce |
| **Shellfish** | Shrimp, crab, lobster, mussels, oysters, clams |
| **Sesame** | Tahini, hummus, sesame oil, some breads |
| **Celery** | Stews, soups, spice mixes |
| **Mustard** | Sauces, dressings, marinades |
| **Lupin** | Flour in pastries (EU) |
| **Mollusks** | Squid, octopus, snails |
| **Sulfites** | Wine, dried fruits, preservatives |

### 2.2 Intolerances (Soft Exclusions)

| Intolerance | Affected Foods |
|---|---|
| **Lactose** | Milk, soft cheese, ice cream |
| **Gluten** | Wheat, barley, rye, some oats |
| **Fructose** | Apples, pears, honey, agave, HFCS |
| **Histamine** | Aged cheese, fermented foods, cured meats, red wine |
| **Nightshades** | Tomatoes, peppers, potatoes, eggplant |
| **Corn** | Cornstarch, corn syrup, tortillas |
| **Caffeine** | Coffee, tea, chocolate |
| **Alcohol** | Wine, beer, spirits, cooking wine |
| **MSG** | Chinese food, canned soups, processed snacks |
| **Artificial Sweeteners** | Diet soda, sugar-free products |
| **Salicylates** | Berries, spices, mint, tea |
| **FODMAP sensitivity** | Onion, garlic, wheat, beans, certain fruits |

### 2.3 Custom Exclusions (Free Text)

Any ingredient the user avoids (e.g., "cilantro", "blue cheese"). Stored as soft exclusions with same filtering behavior as allergens.

---

## 3. Meal Structure

| Option | Meals | Default Calorie Split |
|---|---|---|
| **2 meals** | Lunch + Dinner | 45% / 55% |
| **3 meals** | Breakfast + Lunch + Dinner | 25% / 35% / 40% |
| **3 + Snack** | B + L + D + 1 Snack | 20% / 30% / 35% / 15% |
| **3 + 2 Snacks** | B + L + D + AM + PM Snack | 20% / 25% / 30% / 12.5% / 12.5% |
| **4 meals** | B + Mid-Morning + L + D | 20% / 15% / 30% / 35% |
| **5 meals** | B + Snack + L + Snack + D | 20% / 10% / 25% / 10% / 35% |
| **6 meals (bodybuilding)** | Every 2.5–3 hours | ~16.7% each |
| **1 meal (OMAD)** | One Meal A Day | 100% |
| **IF 16:8** | 2–3 meals in 8-hour window | User picks window start |
| **IF 20:4** | 1–2 meals in 4-hour window | User picks window start |
| **Custom** | User defines count + labels | User sets calorie split |

### Meal Type Tags

Each slot can be tagged: `breakfast`, `lunch`, `dinner`, `snack`, `pre-workout`, `post-workout`, `dessert`

---

## 4. Cuisine Preferences (Multi-Select)

| Region | Cuisines |
|---|---|
| **Asian** | Chinese, Japanese, Korean, Thai, Vietnamese, Indian, Filipino, Indonesian, Malaysian |
| **European** | Italian, French, Spanish, Greek, German, British, Scandinavian, Eastern European |
| **Mediterranean** | Greek, Turkish, Lebanese, Moroccan, Israeli |
| **Americas** | Mexican, Tex-Mex, Brazilian, Peruvian, American, Southern/Soul, Cajun/Creole, Caribbean |
| **African** | Ethiopian, Nigerian, Moroccan, South African, West/East African |
| **Middle Eastern** | Lebanese, Persian, Turkish, Egyptian, Iraqi |
| **Other** | Fusion, Comfort Food, Street Food |

Optional: "Surprise me" flag → ignores cuisine weighting for maximum variety.

---

## 5. Religious & Cultural Dietary Laws (Optional)

| Selection | Rules Applied |
|---|---|
| **Halal** | No pork, no alcohol, meat must be halal-certified |
| **Kosher** | No pork, no shellfish, no mixing meat + dairy |
| **Hindu Vegetarian** | No meat, no eggs; some exclude onion/garlic (Sattvic) |
| **Jain** | Vegetarian + no root vegetables |
| **Buddhist Vegetarian** | Typically no meat; some exclude alliums |
| **Lenten (Christian)** | No meat on Fridays / fasting periods; fish allowed |
| **Seventh-day Adventist** | Often vegetarian, no pork/shellfish, no alcohol/caffeine |
| **Rastafari (Ital)** | No meat (often), no salt, no processed food |
| **Fasting periods** | User sets date ranges for stricter rules (Ramadan, Lent, Navratri) |

---

## 6. Health Conditions & Preference Priority

### Health Conditions (Affects Hard Filters)

| Condition | Dietary Implication |
|---|---|
| **Type 1 / Type 2 Diabetes** | Low-GI, controlled carbs, flag sugar |
| **Hypertension** | Low sodium (DASH alignment) |
| **High Cholesterol** | Low saturated fat, limit red meat |
| **GERD / Acid Reflux** | Avoid citrus, tomato, spicy, caffeine |
| **IBS** | Low-FODMAP recommendations |
| **Kidney Disease (CKD)** | Low potassium, low phosphorus, controlled protein |
| **Gout** | Low purine (limit organ meats, shellfish, red meat) |
| **Celiac Disease** | Strict gluten-free |
| **Crohn's / IBD** | Low-fiber during flares |
| **PCOS** | Low-GI, anti-inflammatory |
| **Pregnancy** | Avoid raw fish, excess caffeine, unpasteurized dairy |
| **Eating Disorder Recovery** | Option to hide calorie numbers; gentle balanced meals |

> **Disclaimer**: Not medical advice. Users should consult their doctor.

### Preference Priority (Conflict Resolution)

```
PRIORITY (highest to lowest):
──────────────────────────
1. Allergies               ← HARD BLOCK — never show these ingredients
2. Health Conditions       ← HARD BLOCK — exclude flagged categories
3. Religious Dietary Laws  ← HARD BLOCK — exclude forbidden items
4. Dietary Profile         ← HARD FILTER — only show matching recipes
5. Intolerances            ← SOFT FILTER — warn but allow override
6. Custom Exclusions       ← SOFT FILTER — warn but allow override
7. Macro Targets           ← SCORING — weight during loot table
8. Cuisine Preferences     ← SCORING — weight during loot table
9. Cooking Preferences     ← SCORING — weight by time/skill/equipment
```

If conflicting (e.g., Keto + Hindu Vegetarian): flag tension, show viable recipe count, suggest adjustment.

---

## 7. Calorie & Macro Formulas

### 7.1 Body Stats Input

| Field | Type | Validation |
|---|---|---|
| `age` | int | 13–120 |
| `gender` | enum | male, female, other |
| `height_cm` | float | 100–250 cm |
| `weight_kg` | float | 30–300 kg |
| `activity_level` | enum | See below |

Imperial conversions: `height_cm = (feet × 30.48) + (inches × 2.54)`, `weight_kg = lbs × 0.4536`

### 7.2 Activity Levels

| Level | Label | TDEE Multiplier |
|---|---|---|
| `sedentary` | Desk job, no exercise | 1.2 |
| `lightly_active` | Light exercise 1–3 days/week | 1.375 |
| `moderately_active` | Moderate exercise 3–5 days/week | 1.55 |
| `very_active` | Hard exercise 6–7 days/week | 1.725 |
| `extra_active` | Very hard exercise + physical job | 1.9 |

### 7.3 Fitness Targets

| Target | Adjustment | Suggested Macro | Protein (g/kg) |
|---|---|---|---|
| Aggressive Cut | TDEE − 750 | High Protein | 2.0–2.4 |
| Lose Weight | TDEE − 500 | High Protein | 1.8–2.2 |
| Slow Cut | TDEE − 250 | Balanced | 1.6–2.0 |
| Maintain | TDEE ± 0 | Balanced | 1.4–1.8 |
| Lean Bulk | TDEE + 250 | High Protein | 1.8–2.2 |
| Bulk | TDEE + 500 | Balanced | 1.6–2.0 |
| Aggressive Bulk | TDEE + 750 | Balanced | 1.6–2.0 |

### 7.4 Formulas

**BMR (Mifflin-St Jeor):**
```python
def calculate_bmr(gender, weight_kg, height_cm, age):
    if gender == "male":
        return round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5)
    elif gender == "female":
        return round((10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161)
    else:  # average of male and female
        male = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
        female = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
        return round((male + female) / 2)
```

**TDEE:** `BMR × activity_multiplier`

**Daily Target:** `TDEE + fitness_adjustment` (floor: 1200 kcal)

**Macros (% → grams):**
```python
protein_g = round(daily_cal * protein_pct / 100 / 4)  # 1g protein = 4 kcal
carbs_g   = round(daily_cal * carbs_pct / 100 / 4)    # 1g carbs = 4 kcal
fat_g     = round(daily_cal * fat_pct / 100 / 9)      # 1g fat = 9 kcal
fiber_g   = 25 if daily_cal < 2000 else 30
```

**Per-Meal Split:** Each slot gets `daily_target × slot.calorie_pct / 100` for all macros.

**Example:** Male, 72kg, 175cm, 28yo, moderately active, lose weight, balanced (50/25/25)
```
BMR:     1,679 kcal
TDEE:    2,602 kcal
Target:  2,102 kcal (−500)
Protein: 131g (1.8 g/kg)  |  Carbs: 263g  |  Fat: 58g  |  Fiber: 30g

Per meal (3+snack): B 420/26/53/12  L 631/39/79/17  D 736/46/92/20  S 315/20/39/9
```

### 7.5 Meal Preference Presets

Shortcuts that set diet_profile + macro split together. User can override.

| Preset | Diet | Macros (C/P/F) | Notes |
|---|---|---|---|
| Balanced | Omnivore | 50/25/25 | Default |
| High Protein | Omnivore | 30/40/30 | Fitness-focused |
| Vegan | Vegan | 55/20/25 | Flag B12/iron |
| Vegan Athlete | Vegan | 40/30/30 | Higher protein plant-based |
| Vegetarian | Vegetarian | 50/25/25 | No meat/fish |
| Keto | Keto | 5/25/70 | Very low carb |
| Low Carb | Omnivore | 20/35/45 | Moderate restriction |
| Low Fat | Omnivore | 60/25/15 | Heart-healthy aligned |
| Diabetic | Diabetic-Friendly | 40/30/30 | Low-GI, flag sugar |
| DASH | Heart-Healthy | 55/20/25 | Low sodium emphasis |
| Mediterranean | Mediterranean | 45/20/35 | Healthy fats |
| Paleo | Paleo | 25/35/40 | No grains/legumes/dairy |
| Whole30 | Whole30 | 30/30/40 | Strict elimination |
| Anti-Inflammatory | Anti-Inflammatory | 45/25/30 | For PCOS, autoimmune |
| Custom | (user picks) | (user sets) | Full manual control |

### 7.6 Daily Progress Tracking

```python
def get_status(consumed, target):
    pct = consumed / target * 100
    if pct < 50:    return "low"       # red — pulsing warning
    elif pct < 80:  return "on_track"  # yellow — steady
    elif pct <= 110: return "good"     # green — full glow
    else:           return "over"      # red — "OVER-BUFFED"
```

### 7.7 Micronutrient Tracking (Optional)

Fiber (g), Sodium (mg), Sugar (g), Iron (mg), Calcium (mg), Vitamin B12 (mcg) — toggled per user.

---

## 8. Ingredient Reference

### 8.1 Categories

| ID | Category | Examples |
|---|---|---|
| `protein` | Protein | Chicken, salmon, tofu, lentils, eggs |
| `produce_veg` | Vegetables | Spinach, carrots, broccoli, onion, tomato |
| `produce_fruit` | Fruits | Strawberries, lemon, mango, raisins |
| `dairy` | Dairy | Whole milk, cheddar, Greek yogurt, cream |
| `dairy_alt` | Dairy Alternatives | Oat milk, coconut yogurt, vegan cheese |
| `grain` | Grains & Starches | Rice, pasta, bread, flour, oats, quinoa |
| `legume` | Legumes & Pulses | Black beans, red lentils, chickpeas |
| `nut_seed` | Nuts & Seeds | Almonds, chia seeds, peanut butter, tahini |
| `oil_fat` | Oils & Fats | Olive oil, coconut oil, ghee |
| `condiment` | Condiments & Sauces | Soy sauce, balsamic vinegar, sriracha |
| `spice` | Spices & Dried Herbs | Cumin, paprika, garam masala, oregano |
| `herb_fresh` | Fresh Herbs | Cilantro, basil, rosemary, thyme |
| `sweetener` | Sweeteners | Sugar, honey, maple syrup, stevia |
| `baking` | Baking Essentials | Baking soda, vanilla extract, cornstarch |
| `beverage` | Beverages | Coffee, tea, juice, broth |
| `frozen` | Frozen | Frozen peas, frozen berries, frozen shrimp |
| `canned` | Canned & Jarred | Canned tomatoes, canned tuna, marinara |
| `snack` | Snacks & Misc | Rice cakes, tortilla chips, wrappers |

### 8.2 Default Pantry Staples (Auto-Added on First Launch)

Flagged `is_pantry_staple: true`. NOT counted for inventory match scoring (everyone has them). Checked for presence only — if missing, appear in shopping list.

**Cooking Essentials:** Salt, Black pepper, Olive oil, Vegetable oil, All-purpose flour, White sugar, Butter

**Spices:** Garlic powder, Onion powder, Cumin, Paprika, Chili powder, Cinnamon, Oregano (dried), Bay leaves, Turmeric

**Pantry:** Rice, Pasta, Canned tomatoes, Tomato paste, Soy sauce, Vinegar, Honey, Baking soda, Baking powder, Vanilla extract, Broth, Cornstarch

**Condiments:** Ketchup, Mustard, Mayonnaise, Hot sauce

### 8.3 Ingredient Data Model

```json
{
  "id": "uuid",
  "name": "chicken breast",
  "normalized_name": "chicken_breast",
  "aliases": ["chicken", "breast of chicken", "boneless chicken"],
  "category": "protein",
  "subcategory": "poultry",
  "quantity": 500,
  "unit": "grams",

  "nutrition_per_100g": {
    "calories": 165, "protein_g": 31, "carbs_g": 0, "fat_g": 3.6,
    "fiber_g": 0, "sugar_g": 0, "sodium_mg": 74, "cholesterol_mg": 85,
    "saturated_fat_g": 1.0, "potassium_mg": 256, "iron_mg": 0.7,
    "calcium_mg": 11, "vitamin_b12_mcg": 0.3
  },

  "glycemic_index": null,
  "fodmap_level": "low",
  "allergen_flags": [],
  "dietary_flags": ["gluten_free", "dairy_free", "keto", "paleo", "whole30"],
  "religious_flags": { "halal": "requires_certification", "kosher": "meat", "hindu_vegetarian": false, "jain": false },

  "storage": { "default_location": "fridge", "shelf_life_days_fridge": 3, "shelf_life_days_freezer": 180 },
  "cooking_properties": { "requires_cooking": true, "min_internal_temp_f": 165, "common_methods": ["grill", "bake", "pan_sear", "stir_fry"] },
  "cost_tier": "medium",
  "purine_level": "low",
  "histamine_level": "low"
}
```

### 8.4 Trackable Parameters

**Core Nutrition (per 100g):** calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol, saturated fat, trans fat

**Micronutrients (optional):** potassium, phosphorus, iron, calcium, vitamin A/C/D/B12, folate, zinc, magnesium, omega-3

**Health Flags:** allergen_flags (14 allergens), glycemic_index/load, fodmap_level, purine_level, histamine_level, nightshade, salicylate_level

**Dietary Flags:** gluten_free, dairy_free, vegan, vegetarian, keto, paleo, whole30, low_sodium, low_sugar, raw

**Religious Flags:** halal (yes/requires_cert/no), kosher (pareve/meat/dairy/no), hindu_vegetarian, sattvic, jain

**Inventory Tracking:** quantity, unit, purchase_date, expiry_date, storage_location (pantry/fridge/freezer), opened, decay_urgency (computed 0.0–1.0)

---

## 9. Units & Conversions

### Volume

| Unit | Abbr | mL |
|---|---|---|
| Milliliter | ml | 1 |
| Teaspoon | tsp | 4.93 |
| Tablespoon | tbsp | 14.79 |
| Fluid ounce | fl oz | 29.57 |
| Cup | cup | 236.59 |
| Liter | L | 1000 |

### Weight

| Unit | Abbr | Grams |
|---|---|---|
| Gram | g | 1 |
| Ounce | oz | 28.35 |
| Pound | lb | 453.59 |
| Kilogram | kg | 1000 |

### Count

`whole`, `clove`, `slice`, `piece`, `bunch`, `head`, `stalk`, `sprig`, `can`, `jar`, `packet`, `pinch` (~0.3g), `dash` (~0.6ml), `handful` (~30g)

### Conversion Rules
- Store ALL quantities internally in grams (weight) or mL (volume)
- Display in user's preferred unit system
- Recipe matching compares in base units only
- Maintain per-ingredient density table for volume↔weight (1 cup flour = 125g, 1 cup sugar = 200g, 1 cup rice = 185g)

---

## 10. Ingredient Name Normalization

### Synonym Table

| Canonical | Aliases |
|---|---|
| `chicken_breast` | chicken, breast of chicken, boneless chicken, chicken fillet |
| `ground_beef` | minced beef, hamburger meat, beef mince |
| `bell_pepper` | capsicum, sweet pepper |
| `cilantro` | coriander leaves, fresh coriander, Chinese parsley |
| `eggplant` | aubergine, brinjal |
| `zucchini` | courgette |
| `scallion` | green onion, spring onion |
| `cornstarch` | corn flour (UK), maize starch |
| `all_purpose_flour` | plain flour, AP flour, white flour |
| `heavy_cream` | double cream (UK), thickened cream (AU) |
| `shrimp` | prawn |
| `arugula` | rocket |
| `chickpeas` | garbanzo beans |

### Normalization Rules
1. Lowercase all input
2. Strip adjectives: "fresh", "organic", "large", "small", "diced", "chopped"
3. Map to canonical name via synonym table
4. Fuzzy-match (Levenshtein ≤ 2)
5. If no match, prompt user to confirm category

---

## 11. Ingredient Substitutions

| Missing | Substitutions | Ratio |
|---|---|---|
| Butter | Coconut oil, Olive oil, Ghee, Applesauce (baking) | 1:1 (oil), 1:0.75 (applesauce) |
| Eggs (baking) | Flax egg, Chia egg, Banana, Applesauce | 1 egg = 1 tbsp flax + 3 tbsp water |
| Milk | Any plant milk, Water + butter | 1:1 |
| Heavy cream | Coconut cream, Cashew cream | 1:1 |
| Sour cream | Greek yogurt, Coconut yogurt | 1:1 |
| Soy sauce | Coconut aminos, Tamari (GF) | 1:1 |
| Lemon juice | Lime juice, White vinegar | 1:1 (lime), 1:0.5 (vinegar) |
| Rice | Quinoa, Cauliflower rice (low-carb), Couscous | 1:1 |
| Pasta | Zucchini noodles, Chickpea pasta, Rice noodles | 1:1 |
| Honey | Maple syrup, Agave | 1:1 |
| Chicken broth | Vegetable broth, Mushroom broth, Water + bouillon | 1:1 |
| Garlic (fresh) | Garlic powder | 1 clove = 1/8 tsp powder |
| Fresh herbs | Dried herbs | 1 tbsp fresh = 1 tsp dried |

> Substitutions must also pass allergen/dietary/religious checks before being shown.

### Missing Ingredient Logic

```python
def classify_availability(recipe, inventory):
    total = len(recipe.ingredients)
    owned = count_owned(recipe.ingredients, inventory)
    missing = total - owned

    if missing == 0:                           return "full_match"     # ✅
    elif missing <= 2 and all_cheap(missing):   return "almost_match"  # 🛒
    elif missing <= 3:                          return "near_match"    # 🛒
    elif owned / total >= 0.6:                  return "partial_match" # ⚠️
    else:                                       return "low_match"     # ❌
```

### Shopping List Aggregation

After all slots locked: de-duplicate missing items, combine quantities, group by category. Show per-item: name, qty, estimated cost, used in which meals, substitute available?

---

## 12. Kitchen Equipment

### 12.1 Major Appliances

| ID | Name | Unlocks |
|---|---|---|
| `stovetop` | Stovetop / Range | Boiling, simmering, sautéing, stir-frying, pan-frying, steaming |
| `oven` | Oven | Baking, roasting, broiling, braising |
| `microwave` | Microwave | Reheating, steaming, mug cooking |
| `air_fryer` | Air Fryer | Air frying, small-batch roasting, crispy reheating |
| `pressure_cooker` | Instant Pot / Pressure Cooker | Pressure cooking, slow cooking, sautéing, rice cooking |
| `slow_cooker` | Slow Cooker / Crock-Pot | Slow braising, stewing |
| `grill` | Grill | Grilling, smoking, charring, BBQ |
| `toaster` | Toaster / Toaster Oven | Toasting, light broiling |
| `deep_fryer` | Deep Fryer | Deep frying |
| `sous_vide` | Sous Vide | Precision low-temp cooking |
| `smoker` | Smoker | Hot/cold smoking |
| `pizza_oven` | Pizza Oven | High-heat baking (800°F+) |

### 12.2 Countertop Appliances

| ID | Name | Unlocks |
|---|---|---|
| `blender` | Blender | Smoothies, pureed soups, sauces, nut milk |
| `food_processor` | Food Processor | Bulk chopping, shredding, hummus, pesto, dough |
| `stand_mixer` | Stand Mixer | Bread dough, whipped cream, meringue, cake batter |
| `hand_mixer` | Hand Mixer | Whipping, beating, mashed potatoes |
| `rice_cooker` | Rice Cooker | Rice, quinoa, oatmeal, steamed veg |
| `waffle_maker` | Waffle Maker | Waffles, hash browns |
| `sandwich_press` | Sandwich Press | Paninis, quesadillas |
| `electric_griddle` | Electric Griddle | Pancakes (batch), eggs, bacon |
| `juicer` | Juicer | Fresh juices |
| `dehydrator` | Dehydrator | Jerky, dried fruit, kale chips |
| `ice_cream_maker` | Ice Cream Maker | Ice cream, sorbet, frozen yogurt |
| `bread_machine` | Bread Machine | Fresh bread, pizza dough |
| `coffee_maker` | Coffee Maker | Coffee, coffee-based marinades, tiramisu |

### 12.3 Cooking Method → Equipment Matrix

| Method | Required Equipment (any one) |
|---|---|
| `boil` | stovetop, pressure_cooker, rice_cooker, microwave (limited) |
| `simmer` | stovetop, slow_cooker, pressure_cooker |
| `saute` | stovetop, pressure_cooker (sauté mode) |
| `stir_fry` | stovetop + wok/skillet |
| `pan_fry` | stovetop + skillet |
| `deep_fry` | deep_fryer, stovetop + stock_pot |
| `bake` | oven, toaster (small), air_fryer (small) |
| `roast` | oven, air_fryer (small batch) |
| `broil` | oven (broil mode) |
| `grill` | grill, grill pan (stovetop) |
| `steam` | stovetop + steamer_basket, microwave, pressure_cooker, rice_cooker |
| `pressure_cook` | pressure_cooker |
| `slow_cook` | slow_cooker, pressure_cooker, oven (low temp) |
| `sous_vide` | sous_vide |
| `smoke` | smoker, grill (indirect) |
| `blend` | blender |
| `process` | food_processor, blender (some) |
| `toast` | toaster, oven, stovetop (dry pan), air_fryer |
| `no_cook` | — (no equipment) |

### 12.4 Equipment Substitution

```python
APPROX_SUBS = {
    "deep_fry": "air_fry",     # not same but close
    "grill": "broil",          # oven broil ≈ grill
    "slow_cook": "simmer",     # stovetop (less hands-free)
    "bake": "air_fry",         # small items
    "sous_vide": "poach",      # rough approximation
    "smoke": None,             # no real substitute
}
```

### 12.5 Kitchen Profiles (Quick-Select for Onboarding)

| Profile | Pre-Checked |
|---|---|
| **Minimal (Dorm)** | Microwave, Toaster |
| **Basic** | Stovetop, Oven, Microwave, Toaster, Blender |
| **Well-Equipped** | Basic + Food Processor, Rice Cooker, Air Fryer |
| **Pro** | All appliances |
| **Custom** | Nothing pre-checked |

---

## 13. Cooking Preferences

### Skill Level

| Level | In-Game Label | Recipe Constraint |
|---|---|---|
| Novice (Lv 1–3) | Just started cooking | Max 5 steps, basic techniques |
| Intermediate (Lv 4–7) | Comfortable in kitchen | Up to 10 steps, moderate techniques |
| Advanced (Lv 8–10) | Confident cook | No restrictions |

### Max Prep Time

| Setting | Max Active Time |
|---|---|
| Quick | ≤ 30 min |
| Normal | 30–60 min |
| Committed | 60–90 min |
| Chef Mode | 90+ min (no limit) |

### Preferred Cooking Methods (Optional)

Baking, Grilling, Stir-fry, Steaming, Raw/No-cook, One-pot, Sheet pan, Slow-cook

### Lifestyle & Scheduling

| Mode | Description |
|---|---|
| Daily Prep | Plan and cook each day |
| Weekly Batch | Prep all on 1–2 days |
| Hybrid | Batch-prep base, assemble daily |

Servings: 1, 2, 3–4 (family), 5+, or custom per meal.
