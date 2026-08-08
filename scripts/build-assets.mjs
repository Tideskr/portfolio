/**
 * Generates the raster assets that cannot live as SVG: the touch icon, the
 * PWA icons and the Open Graph card.
 *
 * They are committed to public/ rather than generated during the build — they
 * change roughly never, and a build step that needs a font renderer is a build
 * step that breaks in CI. Re-run with `pnpm assets` after editing the palette
 * or the wordmark.
 *
 * Text is drawn by sharp (Pango), not by the SVG rasteriser, because librsvg
 * ignores @font-face and would silently fall back to something else.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../public/', import.meta.url);

// Straight from src/styles/global.css — keep them in step by hand.
const C = {
  canvas: '#050b1a',
  deep: '#0b1836',
  swell: '#16264f',
  ink: '#e8eefb',
  inkDim: '#93a4c4',
  accent: '#4c8dff',
  beacon: '#f6b073',
  brass: '#c9b896',
};

/**
 * The favicon rose, parameterised so the icon exports and the OG watermark
 * share one drawing rather than drifting apart.
 */
function rose({ cx, cy, r, colour = C.brass, lit = C.beacon, opacity = 1 }) {
  const reach = r * 0.78;
  const waist = r * 0.16;
  const arm = (deg, fill, side) => {
    const pts =
      side === 'left'
        ? `${cx},${cy} ${cx},${cy - reach} ${cx - waist},${cy - waist}`
        : `${cx},${cy} ${cx},${cy - reach} ${cx + waist},${cy - waist}`;
    return `<polygon points="${pts}" fill="${fill}" opacity="${side === 'left' ? 0.42 : 0.92}" transform="rotate(${deg} ${cx} ${cy})"/>`;
  };

  return `<g opacity="${opacity}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colour}" stroke-width="${r * 0.035}" opacity="0.45"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.85}" fill="none" stroke="${colour}" stroke-width="${r * 0.02}" opacity="0.25"/>
    ${[0, 90, 180, 270].map((d) => arm(d, d === 0 ? lit : colour, 'right')).join('')}
    ${[0, 90, 180, 270].map((d) => arm(d, colour, 'left')).join('')}
    ${[45, 135, 225, 315]
      .map(
        (d) =>
          `<polygon points="${cx},${cy} ${cx},${cy - reach * 0.62} ${cx + waist * 0.6},${cy - waist * 0.6}" fill="${colour}" opacity="0.35" transform="rotate(${d} ${cx} ${cy})"/>`,
      )
      .join('')}
    <circle cx="${cx}" cy="${cy}" r="${r * 0.11}" fill="none" stroke="${lit}" stroke-width="${r * 0.03}" opacity="0.8"/>
  </g>`;
}

/**
 * A fixed star field. Seeded rather than random so re-running this script does
 * not produce a spurious diff on the committed PNG.
 */
function stars(count, w, h, seed = 20260807) {
  let s = seed;
  const next = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

  return Array.from({ length: count }, () => {
    const x = next() * w;
    const y = next() * h * 0.82;
    const r = 0.5 + next() * 1.4;
    // Stars thin out towards the horizon, where the glow washes them out.
    const o = (0.15 + next() * 0.7) * (1 - (y / h) * 0.55);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${o.toFixed(2)}"/>`;
  }).join('');
}

/** Icon artwork at any size; the rounded square is the whole canvas. */
function iconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.deep}"/><stop offset="1" stop-color="${C.canvas}"/>
    </linearGradient></defs>
    <rect width="64" height="64" rx="14" fill="url(#d)"/>
    ${rose({ cx: 32, cy: 32, r: 25.5 })}
  </svg>`;
}

/**
 * Apple crops the touch icon to its own rounded rect, so that one gets a full
 * square of background with no corner radius of its own.
 */
function touchIconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${C.canvas}"/>
    ${rose({ cx: 32, cy: 32, r: 24 })}
  </svg>`;
}

/**
 * A maskable icon is cropped by the launcher to whatever shape the platform
 * likes, so it bleeds to the edges and keeps the mark inside the guaranteed
 * safe zone — the centre circle at 80% width.
 */
function maskableIconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.deep}"/><stop offset="1" stop-color="${C.canvas}"/>
    </linearGradient></defs>
    <rect width="64" height="64" fill="url(#d)"/>
    ${rose({ cx: 32, cy: 32, r: 19 })}
  </svg>`;
}

const W = 1200;
const H = 630;

function ogBackground() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.canvas}"/>
        <stop offset="0.55" stop-color="${C.deep}"/>
        <stop offset="1" stop-color="${C.swell}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="1" r="0.75">
        <stop offset="0" stop-color="${C.accent}" stop-opacity="0.42"/>
        <stop offset="0.55" stop-color="${C.accent}" stop-opacity="0.08"/>
        <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="beam" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${C.beacon}" stop-opacity="0.75"/>
        <stop offset="1" stop-color="${C.beacon}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    ${stars(190, W, H)}
    <ellipse cx="${W / 2}" cy="${H}" rx="${W * 0.75}" ry="${H * 0.5}" fill="url(#glow)"/>

    <!-- The lighthouse on the horizon, the one bright warm point. Kept clear
         of the rose's south point so the two read as separate things. -->
    <circle cx="${W * 0.63}" cy="${H * 0.855}" r="44" fill="url(#beam)"/>
    <circle cx="${W * 0.63}" cy="${H * 0.855}" r="3.4" fill="${C.beacon}"/>

    ${rose({ cx: W * 0.815, cy: H * 0.43, r: 200, opacity: 0.5 })}

    <!-- Horizon. The site's TideRule, at poster scale. -->
    <line x1="72" y1="${H - 96}" x2="${W - 72}" y2="${H - 96}" stroke="${C.brass}" stroke-width="1" opacity="0.28"/>
  </svg>`;
}

/** Pango letter_spacing is in 1024ths of a point. */
const tracked = (px) => Math.round(px * 1024);

async function text({ value, font, color, spacing = 0, width }) {
  return sharp({
    text: {
      text: `<span foreground="${color}"${spacing ? ` letter_spacing="${tracked(spacing)}"` : ''}>${value}</span>`,
      font,
      rgba: true,
      align: 'left',
      ...(width ? { width, wrap: 'word' } : {}),
    },
  })
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // The SVG favicon and the raster icons are the same drawing, emitted twice,
  // so the mark cannot drift between the tab and the home screen.
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="skr.moe">
  <title>skr.moe</title>
  <defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.deep}"/><stop offset="1" stop-color="${C.canvas}"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="url(#d)"/>
  ${rose({ cx: 32, cy: 32, r: 25.5 })}
</svg>
`;
  await writeFile(new URL('favicon.svg', OUT), favicon);
  console.log(`favicon.svg  ${(favicon.length / 1024).toFixed(1)} kB`);

  // Icons.
  for (const [name, svg, size] of [
    ['apple-touch-icon.png', touchIconSvg(180), 180],
    ['icon-192.png', iconSvg(192), 192],
    ['icon-512.png', iconSvg(512), 512],
    ['icon-maskable-512.png', maskableIconSvg(512), 512],
  ]) {
    const buf = await sharp(Buffer.from(svg), { density: 384 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(new URL(name, OUT), buf);
    console.log(`${name}  ${(buf.length / 1024).toFixed(1)} kB`);
  }

  // Open Graph card.
  const bg = await sharp(Buffer.from(ogBackground())).png().toBuffer();

  const eyebrow = await text({
    value: 'CELESTIAL NAVIGATION',
    font: 'Georgia 15',
    color: C.brass,
    spacing: 4,
  });
  const wordmark = await text({ value: 'TideSkr', font: 'Georgia Bold 78', color: C.ink });
  const tagline = await text({
    value: 'I chart small, well-made things — tools, interfaces,\nand the odd corner of the internet.',
    font: 'Georgia 30',
    color: C.inkDim,
  });
  const domain = await text({ value: 'skr.moe', font: 'Consolas 26', color: C.beacon, spacing: 1 });

  const og = await sharp(bg)
    .composite([
      { input: eyebrow, left: 88, top: 150 },
      { input: wordmark, left: 84, top: 196 },
      { input: tagline, left: 88, top: 330 },
      { input: domain, left: 88, top: H - 128 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(new URL('og-default.png', OUT), og);
  console.log(`og-default.png  ${(og.length / 1024).toFixed(1)} kB`);
}

await main();
