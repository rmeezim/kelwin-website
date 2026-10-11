/** A homepage section's behaviour: wired to its root element once the section plays
 *  (scrolls into view; the hero on load). Under prefers-reduced-motion it is called
 *  immediately with `reduced: true` and must leave the section in its final state with no
 *  timers. It returns a cleanup that undoes everything it set up — timers, listeners,
 *  observers, GSAP tweens/ScrollTriggers — because React strict mode mounts twice in dev. */
export type Behavior = (root: HTMLElement, opts: { reduced: boolean }) => void | (() => void);
