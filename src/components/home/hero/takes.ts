/* ── The Operating Feed · the film's three takes (one per system Kelwin runs) ──────────
   This list is the hero film's only config. The section renders one chapter per take and
   the behaviour cuts between them every TAKE_MS on a loop of TAKES.length × TAKE_MS.

   PLACEHOLDER FOOTAGE (today): no take has `video`, so each take is a CSS crop of the
   frosted film plate (src/assets/km/film-room.webp) keyed to [data-take] in hero.css —
   exactly the approved mockup.

   DROPPING IN REAL FOOTAGE: put the clips in /public (e.g. /public/film/take-01.mp4 +
   take-01.webp) and give the take a `video`:
       video: { src: "/film/take-01.mp4", poster: "/film/take-01.webp" }
   Paths are /public paths WITHOUT the GitHub Pages basePath (it is prefixed at render).
   That take then renders <video class="km-film__plate" muted playsInline loop
   preload="metadata"> inside the same 2.39 : 1 frame (no layout change); its CSS crop,
   camera move and footage cues are switched off, and the behaviour plays / pauses / rewinds
   the active take's video in step with the cuts (never autoplay under reduced motion —
   the poster is the still). Grade and frame clips for 2.39 : 1, muted, ≤ 8 s each.
   Takes can be swapped one at a time; takes without `video` keep their CSS crop.
   The rail's geometry in hero.css (three thirds on the ruler's major ticks, the playhead
   stops, the per-take crops) is drawn for exactly three takes.                          */

export type TakeGlyph = "contour" | "trace" | "orbit";

export type Take = {
  /** Two-digit chapter index shown on the rail and the slate. */
  index: string;
  /** The capability the take shows — the chapter's name. */
  name: string;
  /** The nav capability glyph drawn on the active chapter. */
  glyph: TakeGlyph;
  /** Real footage for this take, once it exists. */
  video?: { src: string; poster?: string };
};

export const TAKES: Take[] = [
  { index: "01", name: "Narrative Systems", glyph: "contour" },
  { index: "02", name: "GTM Infrastructure", glyph: "trace" },
  { index: "03", name: "GTM Intelligence", glyph: "orbit" },
];

/** Each take runs 8 s; the loop is TAKES.length × TAKE_MS (24 s). */
export const TAKE_MS = 8000;

/** The establishing montage after the entrance: hard cuts to take 02 and take 03 at these
 *  times (ms after play), each held ~3 s so its chapter name can be read. */
export const MONTAGE_MS = [3600, 6400];
