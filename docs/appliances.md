# RNGredients — Kitchen Appliances & Equipment Reference

> **Build reference file.** This defines every kitchen appliance/tool a user can select.
> Use when building: onboarding equipment selection, recipe filtering by required equipment, crafting queue generation.
> For user preferences → see [user_preferences.md](user_preferences.md)
> For architecture & algorithm → see [meal_prep.md](meal_prep.md)

---

## 1. Major Cooking Appliances

These are the primary heat-source appliances. Each unlocks a set of cooking methods and recipe types.

### 1.1 Stovetop / Range / Hob

| Field | Value |
|---|---|
| **ID** | `stovetop` |
| **Also known as** | Range, hob, burner, cooktop |
| **Types** | Gas, Electric coil, Induction, Ceramic |
| **Unlocks methods** | Boiling, simmering, sautéing, stir-frying, pan-frying, deep-frying, poaching, blanching, reducing, caramelizing, toasting (dry pan), steaming (with lid) |
| **Unlocks cookware** | Saucepan, frying pan, skillet, wok, stock pot, Dutch oven (stovetop mode) |
| **Common recipes** | Stir fry, pasta, soup, scrambled eggs, pancakes, curries, sauces |
| **Assumption if missing** | Severely limits cooking — only raw, microwave, and no-heat recipes available |

### 1.2 Oven

| Field | Value |
|---|---|
| **ID** | `oven` |
| **Types** | Conventional, Convection/fan, Gas, Toaster oven |
| **Unlocks methods** | Baking, roasting, broiling, gratinating, dehydrating (low temp), braising (Dutch oven) |
| **Unlocks recipes** | Casseroles, roasted meats, roasted vegetables, baked goods, pizza, lasagna, sheet pan meals, gratins |
| **Notes** | Convection cooks ~25°F lower / ~25% faster. Toaster oven works for small batches only. |

### 1.3 Microwave

| Field | Value |
|---|---|
| **ID** | `microwave` |
| **Unlocks methods** | Reheating, steaming (with cover), defrosting, mug cooking |
| **Unlocks recipes** | Mug cakes, steamed vegetables, reheated batch meals, melted butter/chocolate, oatmeal |
| **Notes** | Almost universally available. Treat as baseline. |

### 1.4 Air Fryer

| Field | Value |
|---|---|
| **ID** | `air_fryer` |
| **Unlocks methods** | Air frying, roasting (small batch), reheating (crispy), dehydrating (some models) |
| **Unlocks recipes** | Crispy chicken, fries, roasted chickpeas, vegetables, fish fillets, reheated pizza |
| **Notes** | Can substitute for oven in many small-batch recipes. Faster preheat. |

### 1.5 Instant Pot / Electric Pressure Cooker

| Field | Value |
|---|---|
| **ID** | `pressure_cooker` |
| **Also known as** | Instant Pot, Multi-cooker |
| **Unlocks methods** | Pressure cooking, slow cooking, sautéing, steaming, rice cooking, yogurt making |
| **Unlocks recipes** | Beans (from dry in 30 min), stews, chili, risotto, bone broth, pulled pork, hard/soft boiled eggs, dal |
| **Notes** | Replaces slow cooker + rice cooker + steamer in many cases. Flag as multi-function. |

### 1.6 Slow Cooker / Crock-Pot

| Field | Value |
|---|---|
| **ID** | `slow_cooker` |
| **Unlocks methods** | Slow braising, stewing, slow roasting, keeping warm |
| **Unlocks recipes** | Chili, pulled pork, pot roast, soups, oatmeal (overnight), mulled beverages |
| **Notes** | Ideal for set-and-forget recipes. Tag these as "passive_craft_time" dominant. |

### 1.7 Grill (Outdoor/Indoor)

| Field | Value |
|---|---|
| **ID** | `grill` |
| **Types** | Gas grill, Charcoal grill, Electric grill, Grill pan (stovetop) |
| **Unlocks methods** | Grilling, smoking, charring, BBQ |
| **Unlocks recipes** | Grilled meats, grilled vegetables, kabobs, burgers, grilled fish, corn on the cob |
| **Notes** | Seasonal/weather-dependent for outdoor. Indoor grill pan is a stovetop accessory. |

### 1.8 Toaster / Toaster Oven

| Field | Value |
|---|---|
| **ID** | `toaster` |
| **Unlocks methods** | Toasting, light broiling (toaster oven), reheating |
| **Unlocks recipes** | Toast, bagels, open-face sandwiches, small gratins (toaster oven) |
| **Notes** | Toaster oven can substitute for oven in single-serving recipes. |

### 1.9 Deep Fryer

| Field | Value |
|---|---|
| **ID** | `deep_fryer` |
| **Unlocks methods** | Deep frying |
| **Unlocks recipes** | French fries, fried chicken, donuts, tempura, falafel, spring rolls |
| **Notes** | Less common in home kitchens. Air fryer often substitutes. |

### 1.10 Sous Vide / Immersion Circulator

| Field | Value |
|---|---|
| **ID** | `sous_vide` |
| **Unlocks methods** | Sous vide (precision low-temp cooking) |
| **Unlocks recipes** | Perfect steak, chicken breast, eggs, salmon, infused oils, custard |
| **Notes** | Often requires finishing step (sear on stovetop or torch). |

### 1.11 Smoker

| Field | Value |
|---|---|
| **ID** | `smoker` |
| **Types** | Electric, Pellet, Offset, Kamado |
| **Unlocks methods** | Hot smoking, cold smoking |
| **Unlocks recipes** | Smoked brisket, ribs, salmon, turkey, cheese |
| **Notes** | Long cook times (4–16 hours). Almost entirely passive_craft_time. |

### 1.12 Pizza Oven

| Field | Value |
|---|---|
| **ID** | `pizza_oven` |
| **Unlocks methods** | High-heat baking (800°F+) |
| **Unlocks recipes** | Neapolitan pizza, flatbread, naan |
| **Notes** | Niche. Standard oven with pizza stone is a common substitute. |

---

## 2. Countertop Appliances (Prep & Processing)

These don't directly apply heat but are critical for prep and recipe capability.

### 2.1 Blender

| Field | Value |
|---|---|
| **ID** | `blender` |
| **Types** | Countertop blender, Immersion/stick blender, High-speed (Vitamix, Blendtec) |
| **Unlocks** | Smoothies, pureed soups, sauces, batters, nut milk, dressings, frozen drinks |
| **Notes** | High-speed blenders can also make nut butters, hot soup, ice cream base. Immersion blender works in-pot. |

### 2.2 Food Processor

| Field | Value |
|---|---|
| **ID** | `food_processor` |
| **Unlocks** | Chopping (bulk), slicing, shredding, dough mixing, hummus, pesto, energy balls, pie crust |
| **Notes** | Overlaps with blender for some tasks, but better for solid/chunky processing. |

### 2.3 Stand Mixer

| Field | Value |
|---|---|
| **ID** | `stand_mixer` |
| **Also known as** | KitchenAid mixer |
| **Unlocks** | Bread dough, pizza dough, whipped cream, meringue, cookie dough, cake batter |
| **Notes** | Primarily for baking-heavy users. Hand mixer substitutes for most tasks except dough. |

### 2.4 Hand Mixer

| Field | Value |
|---|---|
| **ID** | `hand_mixer` |
| **Unlocks** | Whipping, beating, mixing batters, mashed potatoes |
| **Notes** | Lighter-duty alternative to stand mixer. Cannot handle heavy dough. |

### 2.5 Rice Cooker

| Field | Value |
|---|---|
| **ID** | `rice_cooker` |
| **Unlocks** | Perfectly cooked rice, quinoa, oatmeal, steamed vegetables (with tray), congee |
| **Notes** | Set-and-forget. Frees up stovetop. Pressure cooker can substitute. |

### 2.6 Waffle Maker

| Field | Value |
|---|---|
| **ID** | `waffle_maker` |
| **Unlocks** | Waffles, hash browns, paninis (hack), waffle-iron grilled cheese |
| **Notes** | Breakfast-focused. |

### 2.7 Sandwich Press / Panini Press

| Field | Value |
|---|---|
| **ID** | `sandwich_press` |
| **Unlocks** | Paninis, grilled sandwiches, pressed wraps, quesadillas |
| **Notes** | Stovetop + heavy skillet is a common substitute. |

### 2.8 Electric Griddle

| Field | Value |
|---|---|
| **ID** | `electric_griddle` |
| **Unlocks** | Pancakes (large batch), eggs, bacon, French toast, smash burgers |
| **Notes** | Good for cooking for 4+ people simultaneously. |

### 2.9 Juicer

| Field | Value |
|---|---|
| **ID** | `juicer` |
| **Types** | Centrifugal, Masticating (cold press) |
| **Unlocks** | Fresh juices, juice-based marinades |
| **Notes** | Niche. Blender + strainer substitutes. |

### 2.10 Dehydrator

| Field | Value |
|---|---|
| **ID** | `dehydrator` |
| **Unlocks** | Jerky, dried fruit, fruit leather, dried herbs, kale chips |
| **Notes** | Oven on lowest setting (~170°F) can substitute for some items. |

### 2.11 Ice Cream Maker

| Field | Value |
|---|---|
| **ID** | `ice_cream_maker` |
| **Unlocks** | Homemade ice cream, sorbet, frozen yogurt, gelato |
| **Notes** | Dessert-only. No-churn methods exist without equipment. |

### 2.12 Bread Machine

| Field | Value |
|---|---|
| **ID** | `bread_machine` |
| **Unlocks** | Fresh bread, pizza dough, jam, cinnamon rolls |
| **Notes** | Set-and-forget bread. Oven + stand mixer substitutes. |

### 2.13 Espresso Machine / Coffee Maker

| Field | Value |
|---|---|
| **ID** | `coffee_maker` |
| **Unlocks** | Coffee (obviously), but also: coffee-based marinades, tiramisu, coffee-rubbed meats |
| **Notes** | Relevant for recipes that require brewed coffee/espresso as ingredient. |

---

## 3. Essential Hand Tools & Cookware

Not selectable as "appliances" but tracked so the system knows what techniques are possible.

### 3.1 Cookware

| Item | ID | Required For |
|---|---|---|
| Frying pan / Skillet | `skillet` | Sautéing, pan-frying, searing |
| Non-stick pan | `nonstick_pan` | Eggs, crepes, delicate items |
| Cast iron skillet | `cast_iron` | Searing, cornbread, high-heat stovetop |
| Wok | `wok` | Stir-fry, deep-frying, steaming |
| Saucepan (small) | `saucepan_small` | Sauces, boiling eggs, heating liquids |
| Stock pot (large) | `stock_pot` | Soups, pasta, stock, boiling corn |
| Dutch oven | `dutch_oven` | Braising, stews, bread baking, deep fry |
| Baking sheet / Sheet pan | `sheet_pan` | Roasting, sheet pan dinners, cookies |
| Baking dish (9x13) | `baking_dish` | Casseroles, lasagna, baked pasta |
| Muffin tin | `muffin_tin` | Muffins, cupcakes, egg cups |
| Loaf pan | `loaf_pan` | Bread, meatloaf, pound cake |
| Pizza stone / Steel | `pizza_stone` | Pizza, flatbread |
| Steamer basket | `steamer_basket` | Steaming vegetables, dumplings, fish |

### 3.2 Prep Tools

| Item | ID | Required For |
|---|---|---|
| Chef's knife | `chefs_knife` | Essentially all prep (assumed as baseline) |
| Cutting board | `cutting_board` | All prep (assumed as baseline) |
| Mixing bowls | `mixing_bowls` | Marinating, mixing, serving (assumed) |
| Measuring cups/spoons | `measuring` | Accurate portioning (assumed) |
| Colander / Strainer | `colander` | Draining pasta, rinsing beans, washing produce |
| Rolling pin | `rolling_pin` | Pie crust, cookies, pasta, flatbread |
| Mortar & pestle | `mortar_pestle` | Grinding spices, making curry paste |
| Mandoline slicer | `mandoline` | Uniform thin slicing (potatoes, cucumbers) |
| Thermometer (meat) | `meat_thermometer` | Food safety for proteins |
| Kitchen scale | `kitchen_scale` | Accurate ingredient measurement |
| Zester / Microplane | `zester` | Citrus zest, nutmeg, hard cheese |
| Spiralizer | `spiralizer` | Zucchini noodles, veggie spirals |
| Garlic press | `garlic_press` | Mincing garlic quickly |
| Salad spinner | `salad_spinner` | Drying washed greens |

---

## 4. Equipment Data Model

```json
{
  "id": "air_fryer",
  "display_name": "Air Fryer",
  "category": "major_appliance",
  "unlocks_methods": ["air_fry", "roast_small", "reheat_crispy", "dehydrate"],
  "substitutes_for": ["oven"],
  "substituted_by": ["oven"],
  "power_source": "electric",
  "typical_capacity": "2-6 quarts",
  "icon": "🍳"
}
```

---

## 5. Equipment → Cooking Method Matrix

Use this when filtering recipes. A recipe's `required_methods` must be satisfiable by the user's equipment set.

| Method | Required Equipment (any one) |
|---|---|
| `boil` | stovetop, pressure_cooker, rice_cooker, microwave (limited) |
| `simmer` | stovetop, slow_cooker, pressure_cooker |
| `saute` | stovetop, pressure_cooker (sauté mode) |
| `stir_fry` | stovetop + wok, stovetop + skillet |
| `pan_fry` | stovetop + skillet |
| `deep_fry` | deep_fryer, stovetop + stock_pot, air_fryer (not true deep fry) |
| `bake` | oven, toaster (small items), air_fryer (small items) |
| `roast` | oven, air_fryer (small batch) |
| `broil` | oven (broil mode), toaster (some) |
| `grill` | grill, grill pan (stovetop) |
| `steam` | stovetop + steamer_basket, microwave + cover, pressure_cooker, rice_cooker |
| `pressure_cook` | pressure_cooker |
| `slow_cook` | slow_cooker, pressure_cooker (slow mode), oven (low temp) |
| `sous_vide` | sous_vide |
| `smoke` | smoker, grill (indirect heat) |
| `blend` | blender |
| `process` | food_processor, blender (some tasks) |
| `knead` | stand_mixer, hand (no equipment) |
| `whip` | stand_mixer, hand_mixer, whisk (hand) |
| `toast` | toaster, oven (broil), stovetop (dry pan), air_fryer |
| `dehydrate` | dehydrator, oven (low), air_fryer (some models) |
| `no_cook` | — (no equipment needed) |

---

## 6. Substitution Logic

When a recipe requires equipment the user doesn't have:

```python
def find_equipment_substitute(required_method, user_equipment):
    """
    Check the method matrix.
    If user has ANY equipment that satisfies the method → pass.
    If not → check if an alternative method achieves similar result.
    """
    possible_equipment = METHOD_MATRIX[required_method]
    user_has = [e for e in possible_equipment if e in user_equipment]
    
    if user_has:
        return user_has[0]  # user can do this method
    
    # Check for approximate substitutions
    APPROX_SUBS = {
        "deep_fry": "air_fry",      # not same but close
        "grill": "broil",            # oven broil ≈ grill
        "slow_cook": "simmer",       # stovetop simmer ≈ slow cook (less hands-free)
        "bake": "air_fry",           # air fryer for small items
        "smoke": None,               # no real substitute
        "sous_vide": "poach",        # poaching is a rough approximation
    }
    
    alt_method = APPROX_SUBS.get(required_method)
    if alt_method and can_do(alt_method, user_equipment):
        return f"substitute: {alt_method} instead of {required_method}"
    
    return None  # recipe not feasible with user's equipment
```

---

## 7. Default Equipment Presets

Pre-check common appliances during onboarding so users don't start from zero.

### 7.1 Kitchen Profiles (Quick-Select)

| Profile | Pre-Checked Equipment | Target User |
|---|---|---|
| **Minimal (Dorm/Studio)** | Microwave, Toaster | College students, dorm rooms |
| **Basic (Standard Kitchen)** | Stovetop, Oven, Microwave, Toaster, Blender | Default for most users |
| **Well-Equipped** | Stovetop, Oven, Microwave, Toaster, Blender, Food Processor, Rice Cooker, Air Fryer | Home cook enthusiasts |
| **Pro Kitchen** | All major + all countertop appliances | Serious home cooks |
| **Custom** | Nothing pre-checked | User selects everything manually |

### 7.2 Default Selection Logic

```python
def get_default_equipment(profile: str = "basic") -> list:
    profiles = {
        "minimal": ["microwave", "toaster"],
        "basic": ["stovetop", "oven", "microwave", "toaster", "blender"],
        "well_equipped": [
            "stovetop", "oven", "microwave", "toaster", "blender",
            "food_processor", "rice_cooker", "air_fryer"
        ],
        "pro": list(ALL_APPLIANCES),
        "custom": [],
    }
    return profiles.get(profile, profiles["basic"])
```

> On onboarding, the "Basic" profile is pre-selected. User adjusts from there.

---

## 8. Onboarding Equipment Selection UI Spec

```
Screen: "Equip Your Kitchen"

[Quick Setup — choose your kitchen type]
  ○ Minimal (Dorm)    ○ Basic ●    ○ Well-Equipped    ○ Pro    ○ Custom

[Major Appliances — pick what you have]
  ☑ Stovetop / Range
  ☑ Oven
  ☑ Microwave
  ☐ Air Fryer
  ☐ Instant Pot / Pressure Cooker
  ☐ Slow Cooker
  ☐ Grill
  ☐ Sous Vide
  ☐ Toaster / Toaster Oven
  ☐ Deep Fryer
  ☐ Smoker
  ☐ Pizza Oven

[Countertop Tools — pick what you have]
  ☑ Blender
  ☐ Food Processor
  ☐ Stand Mixer
  ☐ Hand Mixer
  ☐ Rice Cooker
  ☐ Waffle Maker
  ☐ Sandwich Press
  ☐ Electric Griddle
  ☐ Juicer
  ☐ Dehydrator
  ☐ Ice Cream Maker
  ☐ Bread Machine

[Special Cookware — optional, improves recipe matching]
  ☐ Wok
  ☐ Cast Iron Skillet
  ☐ Dutch Oven
  ☐ Steamer Basket
  ☐ Pizza Stone
  ☐ Spiralizer
  ☐ Rolling Pin

→ Based on your equipment, you can make ~2,400 / 3,000 recipes in our database.
→ [Continue]
```
