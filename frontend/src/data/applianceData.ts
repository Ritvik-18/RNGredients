import type { Appliance } from '../types';

export interface ApplianceInfo {
  id: Appliance;
  label: string;
  icon: string;
  desc: string;
}

export const APPLIANCES: ApplianceInfo[] = [
  { id: 'stovetop',       label: 'Stovetop',         icon: '🔥', desc: 'Boil, sauté, stir-fry, curries' },
  { id: 'oven',           label: 'Oven',             icon: '🟫', desc: 'Bake, roast, broil' },
  { id: 'microwave',      label: 'Microwave',        icon: '📡', desc: 'Reheat, steam, quick meals' },
  { id: 'blender',        label: 'Blender',          icon: '🌀', desc: 'Smoothies, soups, sauces' },
  { id: 'air_fryer',      label: 'Air Fryer',        icon: '💨', desc: 'Crispy food with less oil' },
  { id: 'pressure_cooker',label: 'Pressure Cooker',  icon: '⚡', desc: 'Beans, stews, dal in minutes' },
  { id: 'slow_cooker',    label: 'Slow Cooker',      icon: '🥘', desc: 'Set-and-forget stews & soups' },
  { id: 'grill',          label: 'Grill',            icon: '🔲', desc: 'Grilled meats, veggies, BBQ' },
  { id: 'rice_cooker',    label: 'Rice Cooker',      icon: '🍚', desc: 'Perfect rice every time' },
  { id: 'toaster',        label: 'Toaster',          icon: '🍞', desc: 'Toast, quick snacks' },
  { id: 'food_processor', label: 'Food Processor',   icon: '⚙️', desc: 'Chop, mince, shred quickly' },
];
