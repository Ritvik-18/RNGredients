# Recipe Grimoire (Database Structure & Nomenclature)

This document serves as the master database for recipes in the **RNGredients** app. It establishes strict nomenclature and sub-variables for ingredients, appliances, and categories to ensure the RNG matching algorithm can flawlessly shortlist and filter dishes based on the player's inventory.

All recipes are sourced from reputable culinary standards (adapted from sources like Dassana's Veg Recipes, Swasthi's Recipes, and Serious Eats) and structured for programmatic parsing.

---

## 1. Nomenclature & Taxonomy Guidelines

To ensure the filtering algorithm (Loot Table) works perfectly, all recipes must adhere strictly to the following variable names.

### Categories (`cuisine_type`)
- `indian_north`, `indian_south`, `thai`, `continental`, `mediterranean`, `mexican`, `fusion`

### Meal Types (`meal_type`)
- `breakfast`, `lunch`, `dinner`, `snack`, `beverage`

### Dietary Tags (`dietary_tags`)
- `vegetarian`, `vegan`, `gluten_free`, `high_protein`, `low_carb`, `dairy_free`

### Appliances (`appliances_required`)
- `stovetop`, `oven`, `microwave`, `blender`, `pressure_cooker`, `air_fryer`, `toaster`

### Base Ingredients (`ingredients.id`)
*Naming Convention: `[category]_[specific_name]_[state]`*
- **Proteins**: `protein_paneer`, `protein_chicken_breast`, `protein_tofu`, `protein_eggs`, `protein_chickpeas_canned`
- **Vegetables**: `veg_onion_red`, `veg_tomato_fresh`, `veg_spinach_fresh`, `veg_bell_pepper_mixed`, `veg_potato_russet`, `veg_broccoli_head`, `veg_cucumber`, `veg_lemon`
- **Carbs/Grains**: `carb_rice_basmati`, `carb_rice_jasmine`, `carb_pasta_penne`, `carb_bread_wholewheat`, `carb_oats_rolled`
- **Spices/Herbs**: `spice_garam_masala`, `spice_turmeric_powder`, `spice_cumin_seeds`, `herb_cilantro_fresh`, `herb_basil_thai`, `spice_curry_paste_green`, `spice_salt`, `spice_pepper_black`
- **Liquids/Bases**: `base_coconut_milk_canned`, `base_tomato_puree`, `base_oil_olive`, `base_oil_vegetable`, `dairy_cream_heavy`, `dairy_yogurt_plain`

---

## 2. Recipe Entries

### [RECIPE_001] Palak Paneer (Spinach & Cottage Cheese Curry)
*Source Inspiration: Dassana's Veg Recipes*

- **ID**: `rec_palak_paneer_01`
- **Title**: Authentic Palak Paneer
- **Asset**: `/assets/images/recipes/palak_paneer.webp` (Placeholder for high-res retro pixel art / food photography)
- **Cuisine Type**: `indian_north`
- **Meal Type**: `dinner`, `lunch`
- **Dietary Tags**: `vegetarian`, `gluten_free`, `high_protein`
- **Prep Time (Passive)**: 10 mins
- **Cook Time (Active)**: 25 mins
- **Appliances Required**: `stovetop`, `blender`
- **Stat Buffs**: `Calories: 350`, `Protein: 18g`, `Carbs: 12g`, `Fat: 26g`

**Ingredients Required**:
| Ingredient ID | Common Name | Quantity | Unit | Note |
|---|---|---|---|---|
| `protein_paneer` | Paneer (Cottage Cheese) | 250 | grams | Cubed |
| `veg_spinach_fresh` | Fresh Spinach | 500 | grams | Washed |
| `veg_onion_red` | Red Onion | 1 | medium | Finely chopped |
| `veg_tomato_fresh` | Fresh Tomato | 2 | medium | Chopped |
| `spice_garam_masala` | Garam Masala | 1 | tsp | |
| `spice_turmeric_powder` | Turmeric Powder | 0.5 | tsp | |
| `base_oil_vegetable` | Vegetable Oil | 2 | tbsp | |
| `dairy_cream_heavy` | Heavy Cream | 2 | tbsp | Optional garnish |

**Crafting Steps**:
1. Blanch the `veg_spinach_fresh` in boiling water for 2 minutes, then transfer to ice water. Blend into a smooth puree using `blender`.
2. Heat `base_oil_vegetable` on `stovetop`. Sauté `veg_onion_red` until golden brown.
3. Add `veg_tomato_fresh` and cook until soft and oil separates.
4. Stir in `spice_turmeric_powder` and `spice_garam_masala`.
5. Pour in the spinach puree and simmer for 5 minutes.
6. Gently fold in `protein_paneer` cubes and simmer for another 3 minutes. Garnish with `dairy_cream_heavy`.

---

### [RECIPE_002] Thai Green Curry with Vegetables & Tofu
*Source Inspiration: Cookie and Kate / Thai Kitchen Standards*

- **ID**: `rec_thai_green_curry_01`
- **Title**: Thai Green Curry
- **Asset**: `/assets/images/recipes/thai_green_curry.webp`
- **Cuisine Type**: `thai`
- **Meal Type**: `dinner`
- **Dietary Tags**: `vegan`, `vegetarian`, `gluten_free`
- **Prep Time (Passive)**: 15 mins
- **Cook Time (Active)**: 20 mins
- **Appliances Required**: `stovetop`
- **Stat Buffs**: `Calories: 420`, `Protein: 12g`, `Carbs: 25g`, `Fat: 32g`

**Ingredients Required**:
| Ingredient ID | Common Name | Quantity | Unit | Note |
|---|---|---|---|---|
| `spice_curry_paste_green` | Green Curry Paste | 3 | tbsp | Check for vegan status |
| `base_coconut_milk_canned` | Coconut Milk | 1 | can | Full fat preferred |
| `protein_tofu` | Firm Tofu | 200 | grams | Pressed and cubed |
| `veg_broccoli_head` | Broccoli | 1 | cup | Florets |
| `veg_bell_pepper_mixed` | Bell Peppers | 1 | cup | Sliced |
| `herb_basil_thai` | Thai Basil | 0.5 | cup | Fresh leaves |
| `base_oil_vegetable` | Vegetable Oil | 1 | tbsp | |
| `carb_rice_jasmine` | Jasmine Rice | 1 | cup | For serving |

**Crafting Steps**:
1. Heat `base_oil_vegetable` on `stovetop`. Sauté `spice_curry_paste_green` for 1 minute until fragrant.
2. Pour in `base_coconut_milk_canned` and stir until smooth. Bring to a gentle simmer.
3. Add `protein_tofu`, `veg_broccoli_head`, and `veg_bell_pepper_mixed`. Simmer for 10-12 minutes until vegetables are tender-crisp.
4. Remove from heat and stir in `herb_basil_thai`.
5. Serve hot over steamed `carb_rice_jasmine`.

---

### [RECIPE_003] Mediterranean Chickpea Salad
*Source Inspiration: The Mediterranean Dish*

- **ID**: `rec_med_chickpea_salad_01`
- **Title**: Fresh Mediterranean Chickpea Salad
- **Asset**: `/assets/images/recipes/med_chickpea_salad.webp`
- **Cuisine Type**: `mediterranean`
- **Meal Type**: `lunch`, `snack`
- **Dietary Tags**: `vegan`, `vegetarian`, `gluten_free`, `high_protein`
- **Prep Time (Passive)**: 15 mins
- **Cook Time (Active)**: 0 mins
- **Appliances Required**: None
- **Stat Buffs**: `Calories: 310`, `Protein: 15g`, `Carbs: 45g`, `Fat: 10g`

**Ingredients Required**:
| Ingredient ID | Common Name | Quantity | Unit | Note |
|---|---|---|---|---|
| `protein_chickpeas_canned`| Canned Chickpeas | 1 | can | Rinsed and drained |
| `veg_cucumber` | Cucumber | 1 | medium | Diced |
| `veg_tomato_fresh` | Tomato | 2 | medium | Diced |
| `veg_onion_red` | Red Onion | 0.5 | medium | Finely diced |
| `herb_cilantro_fresh` | Fresh Cilantro/Parsley | 0.25 | cup | Chopped |
| `veg_lemon` | Lemon (for juice) | 1 | whole | Juiced |
| `base_oil_olive` | Extra Virgin Olive Oil | 2 | tbsp | |
| `spice_salt` | Salt | 1 | tsp | To taste |

**Crafting Steps**:
1. In a large mixing bowl, combine `protein_chickpeas_canned`, `veg_cucumber`, `veg_tomato_fresh`, and `veg_onion_red`.
2. In a small jar, shake together `base_oil_olive`, juice from `veg_lemon`, and `spice_salt` to create the dressing.
3. Pour dressing over the salad and toss well to combine.
4. Garnish with `herb_cilantro_fresh`. Best served chilled.

---

### [RECIPE_004] Savory Masala Veggie Oats
*Source Inspiration: Swasthi's Recipes / Indian Continental Fusion*

- **ID**: `rec_masala_oats_01`
- **Title**: Savory Masala Oats
- **Asset**: `/assets/images/recipes/masala_oats.webp`
- **Cuisine Type**: `fusion`
- **Meal Type**: `breakfast`, `snack`
- **Dietary Tags**: `vegetarian`, `low_carb`
- **Prep Time (Passive)**: 5 mins
- **Cook Time (Active)**: 10 mins
- **Appliances Required**: `stovetop`
- **Stat Buffs**: `Calories: 250`, `Protein: 8g`, `Carbs: 35g`, `Fat: 7g`

**Ingredients Required**:
| Ingredient ID | Common Name | Quantity | Unit | Note |
|---|---|---|---|---|
| `carb_oats_rolled` | Rolled Oats | 0.5 | cup | |
| `veg_onion_red` | Red Onion | 0.5 | medium | Finely chopped |
| `veg_tomato_fresh` | Tomato | 1 | medium | Chopped |
| `veg_bell_pepper_mixed` | Bell Pepper | 0.25 | cup | Chopped |
| `spice_turmeric_powder` | Turmeric Powder | 0.25 | tsp | |
| `spice_garam_masala` | Garam Masala | 0.5 | tsp | |
| `base_oil_vegetable` | Vegetable Oil | 1 | tsp | |
| `herb_cilantro_fresh` | Cilantro | 2 | tbsp | For garnish |

**Crafting Steps**:
1. Heat `base_oil_vegetable` on `stovetop`. Sauté `veg_onion_red` until translucent.
2. Add `veg_tomato_fresh` and `veg_bell_pepper_mixed`, cooking until soft.
3. Stir in `spice_turmeric_powder` and `spice_garam_masala` for 30 seconds.
4. Add `carb_oats_rolled` and 1.5 cups of water.
5. Cook for 5-7 minutes, stirring occasionally until the oats reach a porridge-like consistency.
6. Garnish with `herb_cilantro_fresh` and serve hot.
