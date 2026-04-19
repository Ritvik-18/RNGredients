# RNGredients — Ingredient Repository & Trackable Parameters

> **Build reference file.** This defines every ingredient category, normalized naming, units, and trackable fields.
> Use when building: inventory system, recipe matching, DB schema for grocery items, API validation.
> For architecture & algorithm → see [meal_prep.md](meal_prep.md)
> For user preferences & diets → see [user_preferences.md](user_preferences.md)

---

## 1. Ingredient Categories

Every ingredient belongs to exactly one primary category. Used for inventory UI grouping, nutritional estimation, and recipe filtering.

| Category ID | Category | Subcategories | Examples |
|---|---|---|---|
| `protein` | **Protein** | Red meat, Poultry, Fish, Seafood, Plant protein, Eggs | Chicken breast, salmon, tofu, lentils, eggs |
| `produce_veg` | **Vegetables** | Leafy greens, Root, Cruciferous, Alliums, Nightshades, Squash, Mushrooms, Sea vegetables | Spinach, carrots, broccoli, onion, tomato, zucchini, shiitake, nori |
| `produce_fruit` | **Fruits** | Berries, Citrus, Stone, Tropical, Melons, Dried | Strawberries, lemon, peach, mango, watermelon, raisins |
| `dairy` | **Dairy** | Milk, Cheese, Yogurt, Cream, Butter | Whole milk, cheddar, Greek yogurt, heavy cream |
| `dairy_alt` | **Dairy Alternatives** | Plant milk, Plant yogurt, Plant cheese, Plant butter | Oat milk, coconut yogurt, vegan cheddar |
| `grain` | **Grains & Starches** | Rice, Pasta, Bread, Flour, Cereal, Noodles, Other grains | Basmati rice, penne, sourdough, all-purpose flour, oats, quinoa |
| `legume` | **Legumes & Pulses** | Beans, Lentils, Chickpeas, Peas | Black beans, red lentils, chickpeas, split peas |
| `nut_seed` | **Nuts & Seeds** | Tree nuts, Seeds, Nut butters, Seed butters | Almonds, chia seeds, peanut butter, tahini |
| `oil_fat` | **Oils & Fats** | Cooking oils, Animal fats, Specialty oils | Olive oil, coconut oil, ghee, sesame oil |
| `condiment` | **Condiments & Sauces** | Soy-based, Vinegar-based, Hot sauce, Paste, Spreads | Soy sauce, balsamic vinegar, sriracha, tomato paste, mayo |
| `spice` | **Spices & Dried Herbs** | Ground spices, Whole spices, Spice blends, Dried herbs | Cumin, black pepper, garam masala, oregano |
| `herb_fresh` | **Fresh Herbs** | Leafy herbs, Woody herbs | Cilantro, basil, mint, rosemary, thyme |
| `sweetener` | **Sweeteners** | Refined, Natural, Artificial, Syrup | White sugar, honey, stevia, maple syrup |
| `baking` | **Baking Essentials** | Leaveners, Extracts, Thickeners, Chocolate | Baking soda, vanilla extract, cornstarch, cocoa powder |
| `beverage` | **Beverages** | Coffee, Tea, Juice, Stock/Broth | Ground coffee, green tea, orange juice, chicken broth |
| `frozen` | **Frozen** | Frozen veg, Frozen fruit, Frozen protein, Frozen meals | Frozen peas, frozen berries, frozen shrimp |
| `canned` | **Canned & Jarred** | Canned veg, Canned protein, Canned fruit, Jarred sauces | Canned tomatoes, canned tuna, canned peaches, marinara |
| `snack` | **Snacks & Misc** | Crackers, Chips, Wrappers, Noodles (instant) | Rice cakes, tortilla chips, spring roll wrappers |

---

## 1.1 Default Pantry Staples (Auto-Added on First Launch)

These are common kitchen basics that most people have. Pre-loaded into every new user's inventory with `is_pantry_staple: true`. User can remove any they don't have.

### Cooking Essentials
| Item | Category | Default Qty | Unit | Shelf Life |
|---|---|---|---|---|
| Salt | `spice` | 500 | g | 5 years |
| Black pepper | `spice` | 100 | g | 3 years |
| Olive oil | `oil_fat` | 500 | ml | 18 months |
| Vegetable/Canola oil | `oil_fat` | 500 | ml | 12 months |
| All-purpose flour | `grain` | 1000 | g | 12 months |
| White sugar | `sweetener` | 500 | g | indefinite |
| Butter | `dairy` | 250 | g | 3 months (fridge) |

### Spices & Seasonings
| Item | Category | Default Qty | Unit | Shelf Life |
|---|---|---|---|---|
| Garlic powder | `spice` | 50 | g | 3 years |
| Onion powder | `spice` | 50 | g | 3 years |
| Cumin | `spice` | 50 | g | 3 years |
| Paprika | `spice` | 50 | g | 3 years |
| Chili powder / Red pepper flakes | `spice` | 50 | g | 3 years |
| Cinnamon | `spice` | 50 | g | 3 years |
| Oregano (dried) | `spice` | 25 | g | 3 years |
| Bay leaves | `spice` | 10 | whole | 3 years |
| Turmeric | `spice` | 50 | g | 3 years |

### Pantry Staples
| Item | Category | Default Qty | Unit | Shelf Life |
|---|---|---|---|---|
| Rice (white or brown) | `grain` | 1000 | g | 2 years |
| Pasta (any shape) | `grain` | 500 | g | 2 years |
| Canned tomatoes | `canned` | 2 | can | 2 years |
| Tomato paste | `canned` | 1 | can | 2 years |
| Soy sauce | `condiment` | 250 | ml | 3 years |
| Vinegar (white or apple cider) | `condiment` | 500 | ml | indefinite |
| Honey | `sweetener` | 250 | g | indefinite |
| Baking soda | `baking` | 200 | g | indefinite |
| Baking powder | `baking` | 100 | g | 12 months |
| Vanilla extract | `baking` | 50 | ml | indefinite |
| Chicken/Vegetable broth | `beverage` | 1000 | ml | 2 years |
| Cornstarch | `baking` | 200 | g | indefinite |

### Condiments & Basics
| Item | Category | Default Qty | Unit | Shelf Life |
|---|---|---|---|---|
| Ketchup | `condiment` | 1 | bottle | 12 months |
| Mustard | `condiment` | 1 | bottle | 12 months |
| Mayonnaise | `condiment` | 1 | jar | 3 months (fridge) |
| Hot sauce | `condiment` | 1 | bottle | 3 years |

### Onboarding UI for Staples
```
Screen: "Stock Check"

We've added common kitchen staples to your inventory.
Uncheck anything you DON'T have:

  ☑ Salt              ☑ Black pepper      ☑ Olive oil
  ☑ Flour             ☑ Sugar             ☑ Butter
  ☑ Rice              ☑ Pasta             ☑ Soy sauce
  ☑ Canned tomatoes   ☑ Garlic powder     ☑ Cumin
  ☑ Paprika           ☑ Cinnamon          ☑ Oregano
  ☑ Vinegar           ☑ Honey             ☑ Baking soda
  ☑ Broth             ☑ Cornstarch        ...

  → [Continue with what I have]
```

> Staples are flagged `is_pantry_staple: true` and are NOT counted as "inventory match" in the loot table (since everyone has them). They are only checked for presence — if missing, they appear in the missing ingredients list.

---

## 2. Ingredient Data Model

Every ingredient in the user's inventory and in recipes uses this schema:

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
  "unit_system": "metric",

  "nutrition_per_100g": {
    "calories": 165,
    "protein_g": 31,
    "carbs_g": 0,
    "fat_g": 3.6,
    "fiber_g": 0,
    "sugar_g": 0,
    "sodium_mg": 74,
    "cholesterol_mg": 85,
    "saturated_fat_g": 1.0,
    "trans_fat_g": 0,
    "potassium_mg": 256,
    "iron_mg": 0.7,
    "calcium_mg": 11,
    "vitamin_a_iu": 21,
    "vitamin_c_mg": 0,
    "vitamin_d_iu": 5,
    "vitamin_b12_mcg": 0.3
  },

  "glycemic_index": null,
  "glycemic_load": null,
  "fodmap_level": "low",

  "allergen_flags": [],
  "dietary_flags": ["gluten_free", "dairy_free", "keto", "paleo", "whole30"],
  "religious_flags": {
    "halal": "requires_certification",
    "kosher": "meat",
    "hindu_vegetarian": false,
    "jain": false
  },

  "storage": {
    "default_location": "fridge",
    "shelf_life_days_pantry": null,
    "shelf_life_days_fridge": 3,
    "shelf_life_days_freezer": 180,
    "best_before_indicator": "use_by"
  },

  "cooking_properties": {
    "requires_cooking": true,
    "min_internal_temp_f": 165,
    "common_methods": ["grill", "bake", "pan_sear", "stir_fry", "poach", "sous_vide"],
    "prep_actions": ["trim", "slice", "dice", "pound", "marinate"]
  },

  "seasonality": ["year_round"],
  "cost_tier": "medium",
  "purine_level": "low",
  "histamine_level": "low"
}
```

---

## 3. Trackable Parameters Per Ingredient

### 3.1 Core Nutritional Values (per 100g or per serving)

| Parameter | Unit | Why Track |
|---|---|---|
| `calories` | kcal | Calorie budget per meal slot |
| `protein_g` | g | STR stat / muscle building |
| `carbs_g` | g | STA stat / energy |
| `fat_g` | g | DEF stat / satiety |
| `fiber_g` | g | Digestive health, FODMAP filtering |
| `sugar_g` | g | Diabetic-friendly filtering |
| `sodium_mg` | mg | DASH / hypertension filtering |
| `cholesterol_mg` | mg | Heart-healthy filtering |
| `saturated_fat_g` | g | Heart-healthy filtering |
| `trans_fat_g` | g | Should always be 0; flag if present |

### 3.2 Micronutrients (Optional / Advanced)

| Parameter | Unit | Why Track |
|---|---|---|
| `potassium_mg` | mg | CKD filtering (must limit) |
| `phosphorus_mg` | mg | CKD filtering (must limit) |
| `iron_mg` | mg | Vegan/vegetarian iron tracking |
| `calcium_mg` | mg | Dairy-free diet tracking |
| `vitamin_a_iu` | IU | General nutrition |
| `vitamin_c_mg` | mg | Immune health |
| `vitamin_d_iu` | IU | Deficiency common in indoor populations |
| `vitamin_b12_mcg` | mcg | Critical for vegans |
| `folate_mcg` | mcg | Pregnancy tracking |
| `zinc_mg` | mg | Immune health |
| `magnesium_mg` | mg | General health |
| `omega3_mg` | mg | Anti-inflammatory diets |

### 3.3 Health & Sensitivity Flags

| Parameter | Type | Values | Why Track |
|---|---|---|---|
| `allergen_flags` | string[] | `peanut`, `tree_nut`, `dairy`, `egg`, `wheat`, `soy`, `fish`, `shellfish`, `sesame`, `celery`, `mustard`, `lupin`, `mollusk`, `sulfite` | Hard-block allergens in recipe filtering |
| `glycemic_index` | int (0–100) | Low ≤55, Med 56–69, High ≥70 | Diabetic-friendly filtering |
| `glycemic_load` | float | Low ≤10, Med 11–19, High ≥20 | More accurate than GI alone |
| `fodmap_level` | enum | `low`, `moderate`, `high` | IBS / Low-FODMAP diet filtering |
| `purine_level` | enum | `low`, `moderate`, `high` | Gout filtering |
| `histamine_level` | enum | `low`, `moderate`, `high` | Histamine intolerance filtering |
| `nightshade` | bool | true/false | Nightshade sensitivity |
| `salicylate_level` | enum | `low`, `moderate`, `high` | Salicylate sensitivity |

### 3.4 Dietary Compatibility Flags

| Flag | Type | Meaning |
|---|---|---|
| `gluten_free` | bool | Safe for celiac / gluten intolerant |
| `dairy_free` | bool | No milk-derived ingredients |
| `vegan` | bool | No animal products |
| `vegetarian` | bool | No meat/fish |
| `keto` | bool | Net carbs < 5g per serving |
| `paleo` | bool | Fits paleo rules |
| `whole30` | bool | Fits Whole30 rules |
| `low_sodium` | bool | < 140mg sodium per serving |
| `low_sugar` | bool | < 5g sugar per serving |
| `raw` | bool | Not cooked / can be eaten raw |

### 3.5 Religious Compatibility

| Flag | Type | Values |
|---|---|---|
| `halal` | enum | `yes`, `requires_certification`, `no` |
| `kosher` | enum | `pareve`, `meat`, `dairy`, `no` |
| `hindu_vegetarian` | bool | No meat, no eggs |
| `sattvic` | bool | Hindu veg + no onion/garlic |
| `jain` | bool | Vegetarian + no root vegetables |

### 3.6 Inventory & Freshness Tracking

| Parameter | Type | Why Track |
|---|---|---|
| `quantity` | float | How much the user has |
| `unit` | enum | See §4 below |
| `purchase_date` | date | Calculate remaining shelf life |
| `expiry_date` | date | The decay timer — drives urgency scoring |
| `storage_location` | enum | `pantry`, `fridge`, `freezer` — affects shelf life calc |
| `opened` | bool | Opened items expire faster |
| `shelf_life_remaining_days` | computed | `expiry_date - today` → drives decay urgency weight in algorithm |
| `decay_urgency` | computed | `0.0` (fresh) to `1.0` (expires today) → used in loot table weighting |

### 3.7 Cooking Properties

| Parameter | Type | Why Track |
|---|---|---|
| `requires_cooking` | bool | Safety — raw chicken vs. raw carrot |
| `min_internal_temp_f` | int | Food safety (poultry 165°F, beef 145°F, etc.) |
| `common_methods` | string[] | Match against user's available equipment |
| `prep_actions` | string[] | Used to build crafting queue steps |
| `prep_time_min` | int | Estimate for chopping, slicing, etc. |
| `cook_time_min` | int | Active/passive cook time |

### 3.8 Cost & Seasonality (Optional)

| Parameter | Type | Why Track |
|---|---|---|
| `cost_tier` | enum | `budget`, `medium`, `premium` — for budget-conscious users |
| `cost_per_unit` | float | Actual price if user inputs it |
| `seasonality` | string[] | `spring`, `summer`, `fall`, `winter`, `year_round` |
| `local_availability` | bool | Flag for locally-sourced preference |

---

## 4. Valid Units & Conversions

### 4.1 Volume

| Unit | Abbreviation | Base (mL) |
|---|---|---|
| Milliliter | ml | 1 |
| Teaspoon | tsp | 4.93 |
| Tablespoon | tbsp | 14.79 |
| Fluid ounce | fl oz | 29.57 |
| Cup | cup | 236.59 |
| Pint | pt | 473.18 |
| Quart | qt | 946.35 |
| Liter | L | 1000 |
| Gallon | gal | 3785.41 |

### 4.2 Weight/Mass

| Unit | Abbreviation | Base (g) |
|---|---|---|
| Gram | g | 1 |
| Ounce | oz | 28.35 |
| Pound | lb | 453.59 |
| Kilogram | kg | 1000 |

### 4.3 Count/Discrete

| Unit | Usage |
|---|---|
| `whole` | 1 lemon, 2 eggs |
| `clove` | garlic cloves |
| `slice` | bread slices, cheese slices |
| `piece` | generic count |
| `bunch` | herbs (cilantro, parsley) |
| `head` | lettuce, garlic |
| `stalk` | celery |
| `sprig` | rosemary, thyme |
| `can` | canned goods (standard 400g) |
| `jar` | jarred goods |
| `packet` | spice packets, instant noodles |
| `pinch` | spices (≈0.3g) |
| `dash` | liquid spices (≈0.6ml) |
| `handful` | approximate (~30g nuts, ~15g herbs) |

### 4.4 Conversion Rules for the App
```
- Store ALL quantities internally in grams (weight) or mL (volume)
- Display in user's preferred unit system (metric / imperial)
- Recipe matching compares in base units only
- "1 cup rice" → convert to 185g for matching against inventory "500g rice"
- Maintain a per-ingredient density table for volume↔weight conversion
  (1 cup flour = 125g, but 1 cup sugar = 200g, 1 cup rice = 185g)
```

---

## 5. Ingredient Name Normalization

Recipes and user input will use many names for the same thing. The system needs a normalization layer.

### 5.1 Synonym Table (Examples)

| Canonical Name | Aliases |
|---|---|
| `chicken_breast` | chicken, breast of chicken, boneless chicken, chicken fillet |
| `ground_beef` | minced beef, hamburger meat, beef mince |
| `bell_pepper` | capsicum, sweet pepper, bell pepper red/green/yellow |
| `cilantro` | coriander leaves, fresh coriander, Chinese parsley |
| `eggplant` | aubergine, brinjal |
| `zucchini` | courgette |
| `scallion` | green onion, spring onion, shallot (in some regions) |
| `cornstarch` | corn flour (UK), maize starch |
| `all_purpose_flour` | plain flour, AP flour, white flour |
| `heavy_cream` | double cream (UK), thickened cream (AU) |
| `shrimp` | prawn |
| `arugula` | rocket |
| `chickpeas` | garbanzo beans |

### 5.2 Normalization Rules
```
1. Lowercase all input
2. Strip adjectives: "fresh", "organic", "large", "small", "diced", "chopped"
3. Map to canonical name via synonym table
4. If no match, fuzzy-match (Levenshtein distance ≤ 2) against canonical names
5. If still no match, prompt user to confirm category + create new entry
```

---

## 6. Ingredient Substitution Map (for Missing Items)

When a recipe needs an ingredient the user doesn't have, suggest substitutions:

| Missing Ingredient | Substitutions | Ratio |
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
| Breadcrumbs | Crushed crackers, Oats, Almond flour | 1:1 |
| Cornstarch | Arrowroot, Tapioca starch, Flour (2x amount) | 1:1 (arrow/tapioca) |
| Honey | Maple syrup, Agave | 1:1 |
| Chicken broth | Vegetable broth, Mushroom broth, Water + bouillon | 1:1 |
| Garlic (fresh) | Garlic powder | 1 clove = 1/8 tsp powder |
| Fresh herbs | Dried herbs | 1 tbsp fresh = 1 tsp dried |

> Substitution must also pass allergen/dietary/religious checks before being shown.

---

## 7. Missing Ingredient Shopping Suggestions

When a rolled dish is missing 1–3 ingredients, don't reject it — show it with shopping indicators.

### 7.1 Threshold Logic

```python
def classify_dish_availability(recipe, user_inventory):
    """
    Classify how available a dish is based on ingredient coverage.
    """
    total = len(recipe.ingredients)
    owned = count_owned(recipe.ingredients, user_inventory)
    missing = total - owned
    missing_items = get_missing(recipe.ingredients, user_inventory)
    
    if missing == 0:
        return "full_match"          # ✅ All ingredients available
    elif missing <= 2 and all(is_cheap_common(i) for i in missing_items):
        return "almost_match"        # 🛒 Only 1-2 common items missing
    elif missing <= 3:
        return "near_match"          # 🛒 A few items missing
    elif owned / total >= 0.6:
        return "partial_match"       # ⚠️ Most ingredients available
    else:
        return "low_match"           # ❌ Too many missing, de-prioritize
```

### 7.2 Dish Card Missing Indicator UI

```
┌────────────────────────────────────┐
│  Veggie Stir Fry                   │
│  ⏱ 25 min  |  🔥 580 kcal         │
│  📦 92% matched                    │
│                                    │
│  🛒 Missing (2 items):             │
│     • Sesame oil     ~$3.50        │
│     • Fresh ginger   ~$1.00        │
│                                    │
│  [🛒 Add to Shopping List]         │
│  [🔄 Substitute: use olive oil +   │
│      garlic powder instead]        │
│                                    │
│  [❤️ Heart]  [💔 Skip]  [🔁 Re-roll]│
└────────────────────────────────────┘
```

### 7.3 Shopping List Aggregation

```python
def build_shopping_list(today_plan):
    """
    After all slots are locked, aggregate all missing items.
    De-duplicate and combine quantities.
    """
    shopping = {}
    for slot in today_plan.quests:
        for item in slot.missing_ingredients:
            if item.name in shopping:
                shopping[item.name]["quantity"] += item.quantity
            else:
                shopping[item.name] = {
                    "name": item.name,
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "category": item.category,
                    "used_in": [slot.slot_name],
                    "estimated_cost": item.avg_cost,
                    "substitutable": bool(SUBSTITUTION_MAP.get(item.name))
                }
    return sorted(shopping.values(), key=lambda x: x["category"])
```

### 7.4 Shopping List Output

```
🛒 Shopping List for Today's Prep

Produce
  ☐ Fresh ginger    30g     ~$1.00   (used in: Lunch, Dinner)
  ☐ Lemon           1 whole ~$0.50   (used in: Dinner)

Oils & Condiments
  ☐ Sesame oil      2 tbsp  ~$3.50   (used in: Lunch)
    └ 🔄 Substitute available: olive oil

Estimated Total: ~$5.00

[📤 Share List]  [📋 Copy to Clipboard]
```
