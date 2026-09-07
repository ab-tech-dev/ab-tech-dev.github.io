/** Shared scene poses. Values are independent of scroll direction and DOM layout. */
export type ScenePose = {
  spread: number;
  assembled: number;
  panels: number;
  wires: number;
  slash: number;
  spacing: number;
  rx: number;
  ry: number;
  rz: number;
  dark: number;
};
export type SystemState = {
  chapter: number;
  x: number;
  y: number;
  width: number;
  pointerX: number;
  pointerY: number;
};
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const POSES: readonly ScenePose[] = [
  {
    spread: 0,
    assembled: 0,
    panels: 0.65,
    wires: 0,
    slash: 1,
    spacing: 1.42,
    rx: 0.17,
    ry: -0.48,
    rz: -0.13,
    dark: 0,
  },
  {
    spread: 1,
    assembled: 0,
    panels: 1,
    wires: 1,
    slash: 0,
    spacing: 2.27,
    rx: 0.08,
    ry: 0,
    rz: 0.04,
    dark: 0,
  },
  {
    spread: 1,
    assembled: 1,
    panels: 1,
    wires: 0,
    slash: 0,
    spacing: 1.92,
    rx: -0.03,
    ry: -0.12,
    rz: -0.03,
    dark: 0,
  },
  {
    spread: 1,
    assembled: 1,
    panels: 0,
    wires: 0,
    slash: 0,
    spacing: 1.6,
    rx: 0,
    ry: 0.1,
    rz: 0,
    dark: 1,
  },
  {
    spread: 1,
    assembled: 1,
    panels: 0,
    wires: 0,
    slash: 0,
    spacing: 2.75,
    rx: 0,
    ry: 0,
    rz: 0,
    dark: 0,
  },
  {
    spread: 1,
    assembled: 0,
    panels: 1,
    wires: 0.3,
    slash: 0,
    spacing: 2.4,
    rx: 0.18,
    ry: -0.28,
    rz: -0.05,
    dark: 1,
  },
  {
    spread: 1,
    assembled: 1,
    panels: 1,
    wires: 0,
    slash: 0,
    spacing: 1.9,
    rx: 0.08,
    ry: 0.18,
    rz: 0,
    dark: 1,
  },
  {
    spread: 0.6,
    assembled: 0.5,
    panels: 0.9,
    wires: 0,
    slash: 0,
    spacing: 2.35,
    rx: 0.12,
    ry: -0.15,
    rz: 0.06,
    dark: 1,
  },
  {
    spread: 1,
    assembled: 1,
    panels: 0,
    wires: 0,
    slash: 0,
    spacing: 2.1,
    rx: 0,
    ry: -0.15,
    rz: 0,
    dark: 1,
  },
  {
    spread: 0,
    assembled: 1,
    panels: 0,
    wires: 0,
    slash: 1,
    spacing: 1.42,
    rx: 0.06,
    ry: -0.2,
    rz: -0.03,
    dark: 0,
  },
];
export function samplePose(chapter: number): ScenePose {
  const value = Math.max(0, Math.min(POSES.length - 1, chapter));
  const index = Math.floor(value);
  const from = POSES[index],
    to = POSES[Math.min(index + 1, POSES.length - 1)];
  const t = smooth(value - index);
  return Object.fromEntries(
    Object.keys(from).map((key) => [
      key,
      mix(from[key as keyof ScenePose], to[key as keyof ScenePose], t),
    ]),
  ) as ScenePose;
}
/** Resolve named stops from measured section positions, including direct hash loads. */
export function resolveStops(scroll: number, stops: readonly number[]) {
  for (let i = 0; i < stops.length - 1; i++) {
    if (scroll < stops[i + 1])
      return (
        i + clamp01((scroll - stops[i]) / Math.max(1, stops[i + 1] - stops[i]))
      );
  }
  return stops.length - 1;
}
