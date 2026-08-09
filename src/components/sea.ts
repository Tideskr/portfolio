/**
 * Geometry for the moonlit sea under the hero.
 *
 * Two rules decide everything in this file.
 *
 * Water is a body, not a line. Every swell is a closed shape filled down to
 * the floor of the frame, never a stroked curve — a stroked sine repeated at
 * four offsets reads as clipart no matter how it is coloured or timed.
 *
 * And the four silhouettes are authored separately. Different crest counts,
 * different spacing, different asymmetry, so no layer is another layer at a
 * new scale. The only thing they share is the tile width, which they have to,
 * because that is what makes the drift seamless.
 *
 * Everything is deterministic — an LCG, never `Math.random()` — so two builds
 * of the same commit produce byte-identical markup.
 */

/** One horizontal period. Each swell is drawn two tiles wide and slid by
 *  exactly one, so tile two arrives where tile one began and the loop has no
 *  seam to find. */
const TILE = 600;

/** Floor of the 1200×200 viewBox: where every swell closes. */
const FLOOR = 200;

/** `[x, y]`, with x inside one tile and smaller y meaning higher up. */
type Node = readonly [number, number];

/* Crest lines, back to front.
   Read the y column and a perspective ladder appears: rows 30, 42 and 50
   apart, amplitudes of 5, 13, 20 and 26. Both gaps widen toward the reader,
   the way rows of waves actually open out as they approach — and the near
   layers swing hard enough that their crest lines cross into each other's
   troughs. That crossing is the whole point. Four crest lines that stay in
   their own lanes read as four stripes no matter how they are filled; four
   that interleave read as one surface.
   Read the x column and they don't rhyme: the spacings were chosen against
   each other, not from a formula. */

/** Far water: distant chop. Six short periods, barely any amplitude, and a
 *  couple of shoulders (two nodes on the same side of the mean) so it does
 *  not degenerate into an even sawtooth of crests. */
const FAR: Node[] = [
  [0, 25],
  [44, 19],
  [92, 27],
  [128, 29],
  [172, 21],
  [216, 18.5],
  [256, 26.5],
  [300, 28],
  [348, 21.5],
  [396, 19],
  [446, 27],
  [508, 29],
  [552, 23],
];

/** Middle distance. Half as many crests, more than twice the swing, and one
 *  crest carrying a smaller one on its back. */
const MID: Node[] = [
  [0, 57],
  [52, 46],
  [104, 41],
  [158, 53],
  [206, 64.5],
  [262, 56],
  [300, 50],
  [352, 62],
  [398, 67],
  [452, 52],
  [498, 43.5],
  [548, 51],
];

/** Near water. Three swells with the asymmetry real waves have: they fall
 *  away faster than they build. */
const NEAR: Node[] = [
  [0, 99.5],
  [60, 83],
  [118, 76],
  [156, 87],
  [214, 110.5],
  [256, 116],
  [318, 102],
  [366, 81.5],
  [420, 77.5],
  [462, 92.5],
  [520, 112],
  [562, 107.5],
];

/** The body of water closest to the reader — one peaked swell, one with a
 *  long shoulder behind it, and a deep trough between them. Slow, heavy, and
 *  the darkest of the four. */
const FORE: Node[] = [
  [0, 153],
  [78, 128],
  [144, 120],
  [196, 136],
  [268, 164],
  [312, 172],
  [384, 156],
  [438, 127],
  [500, 122],
  [552, 140],
];

/** Index into a node list as if it repeated forever in both directions. */
function at(nodes: Node[], i: number) {
  const n = nodes.length;
  const k = ((i % n) + n) % n;
  const turn = Math.floor(i / n);
  return { x: nodes[k][0] + turn * TILE, y: nodes[k][1] };
}

/**
 * Slope through node `i`, as dy/dx.
 *
 * The two guards are what keep the curve looking like water. Flattening at a
 * sign change puts a level crown on every crest and trough instead of a spike;
 * the Fritsch–Carlson cap stops a long segment next to a short one from
 * bulging past its own endpoints, which is the failure mode that makes naive
 * Catmull–Rom splines look inflated.
 */
function slope(nodes: Node[], i: number) {
  const p0 = at(nodes, i - 1);
  const p1 = at(nodes, i);
  const p2 = at(nodes, i + 1);
  const d0 = p1.x - p0.x;
  const d1 = p2.x - p1.x;
  const s0 = (p1.y - p0.y) / d0;
  const s1 = (p2.y - p1.y) / d1;

  if (s0 * s1 <= 0) return 0;

  const m = (s0 * d1 + s1 * d0) / (d0 + d1);
  const cap = 3 * Math.min(Math.abs(s0), Math.abs(s1));
  return Math.sign(m) * Math.min(Math.abs(m), cap);
}

const r = (v: number) => String(Math.round(v * 10) / 10);

/** Two tiles of smooth crest line, closed to the floor. One node of overhang
 *  at each end covers subpixel rounding at the edges of the drift. */
function swellPath(nodes: Node[]) {
  const n = nodes.length;
  const first = at(nodes, -1);
  const last = at(nodes, 2 * n + 1);

  let d = `M${r(first.x)} ${r(first.y)}`;

  for (let i = -1; i <= 2 * n; i++) {
    const a = at(nodes, i);
    const b = at(nodes, i + 1);
    const w = (b.x - a.x) / 3;
    const ma = slope(nodes, i);
    const mb = slope(nodes, i + 1);
    d += `C${r(a.x + w)} ${r(a.y + ma * w)} ${r(b.x - w)} ${r(b.y - mb * w)} ${r(b.x)} ${r(b.y)}`;
  }

  return `${d}L${r(last.x)} ${FLOOR}L${r(first.x)} ${FLOOR}Z`;
}

export interface Swell {
  d: string;
  /** Fill class: `sea-1` is the faintest, `sea-4` the closest. */
  fill: string;
  /** Horizontal loop, seconds. */
  drift: number;
  /** Vertical bob, seconds. Coprime-ish with `drift` and with every other
   *  layer, so the silhouettes between layers never fall back into step. */
  bob: number;
  /** Half the bob's travel, in rem. */
  rise: string;
}

export const SWELLS: Swell[] = [
  { d: swellPath(FAR), fill: 'sea-1', drift: 34, bob: 13, rise: '0.35rem' },
  { d: swellPath(MID), fill: 'sea-2', drift: 26, bob: 11, rise: '0.5rem' },
  { d: swellPath(NEAR), fill: 'sea-3', drift: 19, bob: 9, rise: '0.7rem' },
  { d: swellPath(FORE), fill: 'sea-4', drift: 13, bob: 7.5, rise: '0.9rem' },
];

export interface Glint {
  /** Percent across the reflection column. */
  x: number;
  /** Percent down it: 0 is the far water, 100 the near. */
  y: number;
  /** Pixels. Flat, because water pulls a highlight sideways. */
  w: number;
  h: number;
  /** Brightest point of this glint's flicker. */
  peak: number;
  /** Flicker period, seconds. */
  dur: number;
  /** Negative, so the glint is already mid-cycle on the first frame. */
  delay: number;
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const round = (v: number, places: number) => {
  const f = 10 ** places;
  return Math.round(v * f) / f;
};

/**
 * The broken pieces of the moon's reflection.
 *
 * Perspective does all the work: the far end of the column is crowded with
 * small tight specks, the near end holds a few long ones spread wide. Sorted
 * far to near so the DOM order is also the paint order.
 */
export function glints(count: number): Glint[] {
  const rand = lcg(0x5ea9);
  const out: Glint[] = [];

  for (let i = 0; i < count; i++) {
    // Biased toward the horizon: reflections crowd as they recede, exactly as
    // the swells carrying them do.
    const y = 100 * rand() ** 1.7;
    const near = y / 100;
    // ...and the column opens out as it comes forward.
    const x = 50 + (rand() - 0.5) * (16 + y * 0.85);
    const h = 1.5 + y * 0.036;
    const w = h * (3.1 + rand() * 2.4);

    out.push({
      x: round(x, 2),
      y: round(y, 2),
      w: round(w, 2),
      h: round(h, 2),
      peak: round(0.42 + near * 0.44 + rand() * 0.12, 3),
      // Never a round number and never shared, so the column has no beat.
      dur: round(2.1 + rand() * 2.4, 2),
      delay: 0,
    });
  }

  for (const g of out) g.delay = round(-rand() * g.dur, 2);

  return out.sort((a, b) => a.y - b.y);
}
