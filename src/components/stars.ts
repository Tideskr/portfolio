/**
 * The starfield over the sea.
 *
 * This used to be eight radial gradients in a 340×300 tile, repeated. That is
 * cheap and it is also the one thing a night sky must never look like: the eye
 * finds the period in about a second, and once it does the whole picture reads
 * as wallpaper.
 *
 * So the stars are placed instead of tiled, and placed unevenly on purpose.
 * Roughly a third of them are dropped near a star already on the canvas, which
 * is what gives the field its patches and voids — an even scatter reads as
 * deliberate, and deliberate reads as fake. The moon washes out whatever sits
 * close to it, because a sky where the stars survive the moonlight is a sky
 * nobody has ever stood under.
 *
 * Deterministic — an LCG, never `Math.random()` — so two builds of the same
 * commit produce byte-identical markup. Same reason as ./sea.ts.
 */

/** The lower edge of the field, in percent of the viewport. Past this the mask
 *  in `starfield` has faded them out anyway, and stars over water read as
 *  noise rather than as sky. */
const HORIZON = 66;

/** The moon, from global.css: `--glade-x` across, and the radii of the halo it
 *  casts in `moonlight`. Stars are dimmed by their distance from it in those
 *  units, so moving the moon moves the clearing it burns in the field. */
const MOON = { x: 68, y: 16, rx: 46, ry: 34 };

export interface Star {
  /** Percent across the viewport. */
  x: number;
  /** Percent down it. */
  y: number;
  /** Diameter in px. */
  size: number;
  /** Resting opacity, and the top of the breath for the ones that breathe. */
  peak: number;
  /** 0 white, 1 grey, 2 accent blue. */
  hue: 0 | 1 | 2;
  /** Breathing period in seconds. 0 for the ones that hold still. */
  dur: number;
  /** Negative, so a breathing star is already mid-cycle on the first frame. */
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

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export function stars(count: number): Star[] {
  const rand = lcg(0x57a2f);
  const out: Star[] = [];

  for (let i = 0; i < count; i++) {
    let x = rand() * 100;
    let y = HORIZON * rand() ** 0.82;

    // Every third star or so is a neighbour of one already placed. Scatter
    // alone gives a field with no patches and no voids, and a sky with neither
    // is a sky the eye stops looking at.
    if (i > 6 && rand() < 0.32) {
      const near = out[Math.floor(rand() * out.length)];
      x = clamp(near.x + (rand() - 0.5) * 12, 0, 100);
      y = clamp(near.y + (rand() - 0.5) * 8, 0, HORIZON);
    }

    // Small and faint by default; the exponents are what keep the handful of
    // bright ones rare enough to still count as bright.
    const scale = rand() ** 2.3;
    const size = 0.9 + scale * 1.5;

    // Distance from the moon in halo radii. Inside one radius the sky is lit
    // and the stars go with it.
    const wash = Math.min(
      1,
      Math.hypot((x - MOON.x) / MOON.rx, (y - MOON.y) / MOON.ry),
    );

    const peak = (0.26 + scale * 0.34 + rand() ** 1.7 * 0.4) * (0.34 + wash * 0.66);

    const tint = rand();
    const hue = tint < 0.06 ? 2 : tint < 0.3 ? 1 : 0;

    // A third of them breathe. All of them breathing is a christmas tree, and
    // the still ones are what give the moving ones something to move against.
    const breathes = rand() < 0.34;
    const dur = breathes ? 3.6 + rand() * 5.4 : 0;

    out.push({
      x: round(x, 2),
      y: round(y, 2),
      size: round(size, 2),
      peak: round(peak, 3),
      hue,
      dur: round(dur, 2),
      delay: breathes ? round(-rand() * dur, 2) : 0,
    });
  }

  return out;
}
