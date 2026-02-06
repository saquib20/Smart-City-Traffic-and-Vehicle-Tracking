// frontend/src/utils/polylineAnim.js

function dist(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export function buildArcLengths(points) {
  const lens = [0];
  for (let i = 1; i < points.length; i++) {
    lens.push(lens[i - 1] + dist(points[i - 1], points[i]));
  }
  return lens;
}

export function pointAt(points, lens, t01) {
  if (!points || points.length === 0) return null;
  if (points.length === 1) return points[0];

  const total = lens[lens.length - 1];
  if (total === 0) return points[0];

  const target = t01 * total;

  let i = 1;
  while (i < lens.length && lens[i] < target) i++;

  const prevLen = lens[i - 1];
  const segLen = lens[i] - prevLen;
  const segT = segLen === 0 ? 0 : (target - prevLen) / segLen;

  const a = points[i - 1];
  const b = points[i];
  return [a[0] + (b[0] - a[0]) * segT, a[1] + (b[1] - a[1]) * segT];
}
