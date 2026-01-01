const SNAP = 8;

export function applySnap(
  value: number,
  targets: number[]
): number {
  for (const t of targets) {
    if (Math.abs(value - t) < SNAP) {
      return t;
    }
  }
  return value;
}
