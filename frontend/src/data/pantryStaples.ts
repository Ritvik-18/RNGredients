export interface PantryStaple {
  id: string;
  name: string;
  category: string;
  ingredient_id: string;
  qty: number;
  unit: string;
  shelfDays: number;
}

export const PANTRY_STAPLES: PantryStaple[] = [
  { id: 'ps_salt',          name: 'Salt',             category: 'spice',     ingredient_id: 'spice_salt',            qty: 500,  unit: 'g',       shelfDays: 1825 },
  { id: 'ps_pepper',        name: 'Black Pepper',     category: 'spice',     ingredient_id: 'spice_pepper_black',    qty: 100,  unit: 'g',       shelfDays: 1095 },
  { id: 'ps_olive_oil',     name: 'Olive Oil',        category: 'base',      ingredient_id: 'base_oil_olive',        qty: 500,  unit: 'ml',      shelfDays: 540 },
  { id: 'ps_veg_oil',       name: 'Vegetable Oil',    category: 'base',      ingredient_id: 'base_oil_vegetable',    qty: 500,  unit: 'ml',      shelfDays: 360 },
  { id: 'ps_rice',          name: 'Rice',             category: 'carb',      ingredient_id: 'carb_rice_basmati',     qty: 1000, unit: 'g',       shelfDays: 730 },
  { id: 'ps_pasta',         name: 'Pasta',            category: 'carb',      ingredient_id: 'carb_pasta_penne',      qty: 500,  unit: 'g',       shelfDays: 730 },
  { id: 'ps_oats',          name: 'Rolled Oats',      category: 'carb',      ingredient_id: 'carb_oats_rolled',      qty: 500,  unit: 'g',       shelfDays: 360 },
  { id: 'ps_bread',         name: 'Bread',            category: 'carb',      ingredient_id: 'carb_bread_wholewheat', qty: 1,    unit: 'loaf',    shelfDays: 7 },
  { id: 'ps_tomato_puree',  name: 'Tomato Puree',     category: 'base',      ingredient_id: 'base_tomato_puree',     qty: 400,  unit: 'g',       shelfDays: 730 },
  { id: 'ps_coconut_milk',  name: 'Coconut Milk',     category: 'base',      ingredient_id: 'base_coconut_milk_canned', qty: 1, unit: 'can',    shelfDays: 730 },
  { id: 'ps_garam_masala',  name: 'Garam Masala',     category: 'spice',     ingredient_id: 'spice_garam_masala',    qty: 50,   unit: 'g',       shelfDays: 1095 },
  { id: 'ps_turmeric',      name: 'Turmeric',         category: 'spice',     ingredient_id: 'spice_turmeric_powder', qty: 50,   unit: 'g',       shelfDays: 1095 },
  { id: 'ps_cumin',         name: 'Cumin Seeds',      category: 'spice',     ingredient_id: 'spice_cumin_seeds',     qty: 50,   unit: 'g',       shelfDays: 1095 },
  { id: 'ps_yogurt',        name: 'Plain Yogurt',     category: 'dairy',     ingredient_id: 'dairy_yogurt_plain',    qty: 500,  unit: 'g',       shelfDays: 14 },
  { id: 'ps_heavy_cream',   name: 'Heavy Cream',      category: 'dairy',     ingredient_id: 'dairy_cream_heavy',     qty: 200,  unit: 'ml',      shelfDays: 14 },
  { id: 'ps_cilantro',      name: 'Fresh Cilantro',   category: 'other',     ingredient_id: 'herb_cilantro_fresh',   qty: 1,    unit: 'bunch',   shelfDays: 7 },
];

export const PANTRY_CATEGORY_ICONS: Record<string, string> = {
  spice: '🌶️', base: '🫙', carb: '🌾', dairy: '🧀', protein: '🥩', other: '🌿',
};
