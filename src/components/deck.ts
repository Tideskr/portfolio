/**
 * The homepage deck.
 *
 * Four acts share one viewport-sized stage and none of them ever moves. The
 * stage is sticky; an otherwise empty track behind it supplies the scroll.
 * What scrolling actually drives is a pair of curves — how far the outgoing
 * act has dissolved, how far the incoming one has arrived — and nothing else.
 *
 * Translating the content is the one thing this file must never do. A page
 * that slides is a page you can feel scrolling, and the whole point is that
 * you cannot: the sea behind is fixed, so the acts have to be fixed too, or
 * the two read as separate pictures moving past each other.
 *
 * Everything that decides how it feels is in the block below. The CSS reads
 * `--depart` and `--arrive` off each act and does the rest, so a frame costs
 * five custom-property writes and no layout reads at all.
 */

/**
 * Where the deck is worth having. Below this the acts cannot fit a viewport
 * without clipping — three post cards stacked on a phone are taller than the
 * screen — and a stage that has to scroll internally is worse than no stage.
 * Under the cutoff the page falls back to four ordinary sections.
 *
 * Kept in sync by hand with the media query in global.css. One string in two
 * languages is the price of not shipping a CSS-in-JS runtime for one query.
 */
export const DECK_QUERY = '(min-width: 48rem) and (min-height: 40rem)';

/**
 * The two curves, as `[start, end]` positions within one act change.
 *
 * One act change is `--deck-track` tall — set in global.css and measured off
 * the element rather than repeated here, so the two can't drift. Everything
 * below is a fraction of that.
 *
 * They no longer overlap. Departure ends at 0.40 and arrival opens at 0.42,
 * leaving a hair of a gap where the outgoing act is gone and the incoming one
 * has not started. The gap is deliberate and it is small: long enough to be a
 * beat where the sea is the only thing on screen, too short to read as a stall.
 *
 * The head of DEPART is alone by a much wider margin — for the first stretch
 * of a scroll, whatever you do, only the outgoing act responds. That is the
 * "nothing is arriving yet" beat the whole effect is built around.
 */
const DEPART = [0.04, 0.4] as const;
const ARRIVE = [0.42, 0.94] as const;

/**
 * The closing dissolve, as `[start, end]` within the exit track.
 *
 * Without this the last act does not leave — it scrolls away, a whole viewport
 * of ordinary sliding tacked onto the end of a page built to never slide, with
 * the reader holding a settled act on screen the entire way down. So the deck
 * spends one last stretch of track taking it apart: the final act dissolves on
 * the same grammar as every other, the frosted panel goes with it, and what the
 * footer rises out of is bare sea.
 *
 * Nearly the whole track, unlike DEPART. The other curves can afford slack at
 * either end because the next act is arriving into it; this one has nothing
 * arriving, so slack here is literally an empty screen the reader has to scroll
 * past to reach the footer. It ends at 0.98 for the same reason.
 */
const EXIT = [0.02, 0.98] as const;

/**
 * Snap radius, as a fraction of one act change.
 *
 * Stop inside this much of a settled act and the deck finishes the job; stop
 * anywhere else and it leaves the picture exactly where you left it. Which is
 * the point — a deck that always snaps has taken the scroll away from you, and
 * one that never does can leave you parked mid-dissolve with two half-acts on
 * screen and no way to tell that was your own doing rather than a bug.
 */
const SNAP = 0.12;

/** How long the scroll has to be still before a snap may fire. Under ~120ms it
 *  starts catching the pauses inside a slow drag, which feels like the page
 *  tugging back against the hand still moving it. */
const SNAP_IDLE = 170;

/** Duration of the snap glide, and the ease it runs on — the same curve as
 *  `--ease-tide` in the stylesheet. */
const SNAP_MS = 460;

/**
 * How the fixed scene follows the page once the track runs out and the footer
 * arrives. Slower than the content (0.45) so the picture keeps its depth, and
 * capped so the sea never leaves the frame entirely.
 */
const LIFT_RATE = 0.45;
const LIFT_MAX = 0.22;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Hermite ease between two thresholds — flat at both ends, so an act neither
 *  jumps off the mark nor lands hard. */
function smoothstep(from: number, to: number, v: number) {
  const t = clamp01((v - from) / (to - from));
  return t * t * (3 - 2 * t);
}

/** `off` is hidden, `live` is untouched; the two in between are the only
 *  states that cost anything to paint. */
type State = 'off' | 'leaving' | 'entering' | 'live';

export function initDeck(deck: HTMLElement) {
  const acts = Array.from(deck.querySelectorAll<HTMLElement>('[data-act]'));
  if (acts.length < 2) return;

  const root = document.documentElement;
  const last = acts.length - 1;
  const wide = window.matchMedia(DECK_QUERY);

  // Last written state per act. Attribute writes invalidate style, so they
  // happen on a crossing and not on a frame.
  const state: (State | '')[] = acts.map(() => '');

  let top = 0;
  let track = 1;
  let exit = 1;
  let floor = 0;
  let vh = 1;
  let queued = false;

  function measure() {
    vh = window.innerHeight || 1;
    top = deck.getBoundingClientRect().top + window.scrollY;

    // Both lengths are derived rather than declared: the deck is however tall
    // the stylesheet made it, so `--deck-track` and `--deck-exit` stay the one
    // place either is written down. Reading `--deck-exit` gives pixels because
    // it is registered as a `<length>` — an unregistered one would come back
    // as the literal string "170dvh".
    const exitCSS = getComputedStyle(deck).getPropertyValue('--deck-exit');
    exit = Math.max(1, parseFloat(exitCSS) || vh);
    // What is left after the exit and the one viewport the stage occupies,
    // split between the transitions.
    track = Math.max(1, (deck.offsetHeight - vh - exit) / last);
    // Where the stage stops sticking and starts riding up with the page.
    floor = top + deck.offsetHeight - vh;
  }

  function mark(k: number, next: State) {
    if (state[k] === next) return;
    state[k] = next;
    acts[k].dataset.state = next;
    // Everything in the stage is technically on screen, so the browser will
    // not skip an invisible act on its own — Tab would walk straight into it.
    acts[k].toggleAttribute('inert', next === 'off');
  }

  function write() {
    queued = false;
    if (!wide.matches) return;

    const y = window.scrollY;

    // Past the last transition the deck spends its exit track taking the final
    // act apart, so `depart` keeps meaning the same thing all the way down.
    const end = top + last * track;
    const closing = y > end;

    const p = Math.min(last, Math.max(0, (y - top) / track));
    // The last act has nothing after it, so the final track belongs to the one
    // before: `p === last` is that transition finished, not a new one.
    const i = closing ? last : Math.min(Math.floor(p), last - 1);
    const t = closing ? clamp01((y - end) / exit) : p - i;

    const depart = closing
      ? smoothstep(EXIT[0], EXIT[1], t)
      : smoothstep(DEPART[0], DEPART[1], t);
    const arrive = closing ? 1 : smoothstep(ARRIVE[0], ARRIVE[1], t);

    acts[i].style.setProperty('--depart', String(depart));
    if (!closing) acts[i + 1].style.setProperty('--arrive', String(arrive));

    for (let k = 0; k <= last; k++) {
      if (k === i) mark(k, depart >= 1 ? 'off' : depart <= 0 ? 'live' : 'leaving');
      else if (!closing && k === i + 1)
        mark(k, arrive >= 1 ? 'live' : arrive <= 0 ? 'off' : 'entering');
      else mark(k, 'off');
    }

    // Only the opening act goes without a panel. Riding the glass in on the
    // arrival curve means it appears with the second act and then simply
    // stays — 2→3 and 3→4 never make it flicker off and back on — and it
    // leaves again with the last act, so the footer rises out of bare sea.
    root.style.setProperty(
      '--glass',
      String(closing ? 1 - depart : i === 0 ? arrive : 1),
    );

    // Weather belongs to the opening act alone. Clouds behind the frosted
    // panel would be weather happening on the far side of a bathroom window.
    root.style.setProperty('--sky-cloud', String(i === 0 && !closing ? 1 - depart : 0));

    const over = Math.max(0, y - floor);
    root.style.setProperty(
      '--scene-lift',
      String(-Math.min(over * LIFT_RATE, vh * LIFT_MAX)),
    );
  }

  /* ── Settling ────────────────────────────────────────────────────────
     Every act change has two rest points and a long middle. Stopping in the
     middle is allowed — that was the whole reason not to snap — but stopping
     just short of a rest point is almost never what anyone meant, and leaving
     it there is what makes a deck feel like it is fighting the wheel. So the
     glide only ever covers the last little bit, and only once the scroll has
     actually stopped. */

  let idle = 0;
  let glide = 0;
  let from = 0;
  let to = 0;
  let started = 0;

  /** Cancel on any input. A snap that survives the reader's next gesture is a
   *  snap that has taken the page away from them. */
  function drop() {
    if (!glide) return;
    cancelAnimationFrame(glide);
    glide = 0;
  }

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

  function step(now: number) {
    const t = clamp01((now - started) / SNAP_MS);
    window.scrollTo(0, from + (to - from) * ease(t));
    glide = t < 1 ? requestAnimationFrame(step) : 0;
  }

  function settle() {
    if (!wide.matches || glide) return;

    const y = window.scrollY;
    // Nothing to settle to once the deck is behind you: the exit track ends in
    // the footer, which is a destination of its own.
    if (y <= top || y >= top + last * track) return;

    const p = (y - top) / track;
    const near = Math.round(p);
    const gap = p - near;
    if (gap === 0 || Math.abs(gap) > SNAP) return;

    from = y;
    to = top + near * track;
    started = performance.now();
    glide = requestAnimationFrame(step);
  }

  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(write);
    }
    // A programmatic scroll fires this too, so the timer has to stay parked
    // while the glide runs or it would immediately queue another one.
    if (glide) return;
    clearTimeout(idle);
    idle = window.setTimeout(settle, SNAP_IDLE);
  }

  /** Hand the acts back to the stylesheet, for when the deck is switched off
   *  mid-session by a resize or a rotation. */
  function release() {
    for (let k = 0; k <= last; k++) {
      state[k] = '';
      delete acts[k].dataset.state;
      acts[k].removeAttribute('inert');
      acts[k].style.removeProperty('--depart');
      acts[k].style.removeProperty('--arrive');
    }
    root.style.removeProperty('--glass');
    root.style.removeProperty('--sky-cloud');
    root.style.removeProperty('--scene-lift');
  }

  function sync() {
    drop();
    if (!wide.matches) return release();
    measure();
    write();
  }

  /**
   * Deep links have to be translated, not followed. Every act sits at the top
   * of the stage, so the browser's own jump to `#notes` finds an element that
   * is already in view and does nothing at all.
   */
  function seek() {
    if (!wide.matches || !location.hash) return;
    const id = location.hash.slice(1);
    const k = acts.findIndex((a) => a.id === id);
    if (k > 0) window.scrollTo({ top: top + k * track, behavior: 'instant' });
  }

  measure();
  seek();
  write();

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('hashchange', seek);
  wide.addEventListener('change', sync);

  // Any deliberate input outranks a pending settle.
  for (const ev of ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const) {
    window.addEventListener(ev, drop, { passive: true });
  }
}
