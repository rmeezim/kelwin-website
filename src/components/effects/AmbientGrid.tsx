/**
 * AmbientGrid — site-wide drafting rules.
 * Faint vertical hairlines at a fixed rhythm across the whole viewport:
 * a constant, uniform texture (no cursor tracking, no masks) so the
 * charcoal reads as a drafted surface rather than a flat fill. Sits
 * above section backgrounds with pointer-events: none.
 */
export default function AmbientGrid() {
  return (
    <div className="ambient-grid" aria-hidden="true">
      <div className="ambient-grid-rules" />
    </div>
  );
}
