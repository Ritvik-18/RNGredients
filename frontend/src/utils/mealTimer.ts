import type { MealSlot } from '../types';

export function getCurrentMealSlot(slots: MealSlot[]): MealSlot | null {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slotsWithTime = slots.filter(s => s.time);
  if (slotsWithTime.length === 0) return null;

  for (let i = 0; i < slotsWithTime.length; i++) {
    const slot = slotsWithTime[i];
    const [h, m] = slot.time!.split(':').map(Number);
    const slotMin = h * 60 + m;
    const nextSlotMin = i < slotsWithTime.length - 1
      ? (() => { const [nh, nm] = slotsWithTime[i + 1].time!.split(':').map(Number); return nh * 60 + nm; })()
      : 24 * 60;

    if (nowMin >= slotMin && nowMin < nextSlotMin) return slot;
  }
  return null;
}

export function isDueMealSlot(slot: MealSlot, windowMin = 30): boolean {
  if (!slot.time) return false;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [h, m] = slot.time.split(':').map(Number);
  const slotMin = h * 60 + m;
  return nowMin >= slotMin && nowMin < slotMin + windowMin;
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export const DEFAULT_MEAL_TIMES: Record<string, string> = {
  breakfast: '08:00',
  lunch:     '13:00',
  dinner:    '19:00',
  snack:     '16:00',
  snack_am:  '10:30',
  snack_pm:  '16:00',
};
