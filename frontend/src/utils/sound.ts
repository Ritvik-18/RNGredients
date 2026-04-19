let enabled = true;

const cache = new Map<string, HTMLAudioElement>();

function load(path: string): HTMLAudioElement {
  if (!cache.has(path)) {
    const a = new Audio(path);
    a.preload = 'auto';
    cache.set(path, a);
  }
  return cache.get(path)!;
}

function play(path: string, volume = 0.5) {
  if (!enabled) return;
  try {
    const audio = load(path);
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = volume;
    clone.play().catch(() => {});
  } catch { /* ignore */ }
}

export const Sound = {
  setEnabled: (v: boolean) => { enabled = v; },
  tap:        () => play('/sounds/Button_Toggle.m4a', 0.4),
  back:       () => play('/sounds/Button_Back.m4a', 0.4),
  transition: () => play('/sounds/Button_Transition.m4a', 0.5),
  scroll:     () => play('/sounds/Scroll_Bar.m4a', 0.3),
};
