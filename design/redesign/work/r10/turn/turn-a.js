/* ═══ turn-a.js · THE TURN, alternative A: "On the line" (round 10 prototype, second pass) ═══════
   Kelwin's own page turn, made from the founder's footer pick ("A · On the line"): the footer's
   signature (a hairline with a + at each end, the lockup standing on it with its lower fifth
   buried behind it, set right) played full screen between two pages. No slanted edge, no
   sideways sweep, no flicker, no small logo centred on a panel.

   LEAVING (a link is clicked): two flat graphite shutters close onto a seam from above and below
   (0–280). Only once they meet is a red line ruled along the seam, left to right, a + registering
   at each end (260–480), so the line is never drawn over the live page. The lockup then rises
   out of the line, large and quiet, as it does in the footer (380–620). The next page is
   requested at 620.
   ARRIVING: the shutters are closed from the first paint, the line and the lockup already there
   (entering the site cold, the line is ruled and the lockup rises first). Then the lockup sinks
   back into the line (0–180), and AS THE SHUTTERS PART (140–460) the line leaves the seam: it
   shrinks and travels onto the page's own short red rule, the 48×2 rule under an interior
   headline (140–700), takes its colour and becomes it. The headline writes itself in above it.
   Where there is no interior headline rule wholly in view — the homepage (its approved hero
   motion is left exactly as it is), a page opened scrolled to an anchor, a back/forward return,
   a failed navigation — the line runs back into its left + instead and the page's own rule draws
   as it always has. If the reader scrolls or the window changes size while the line travels, the
   travel is cancelled: the line runs back where it is and the rule simply appears in its place.

   Same three parts, markers, API and safety as lib/turn.js (tool/home.py or swap.py lift them):
   · km:turn-head    runs BEFORE FIRST PAINT. When motion is allowed it injects this variant's
                     <style> into <head> (so nothing of it exists otherwise), closes the shutters
                     (html.km-ta-arrive, + km-ta-cold unless this page was reached by a turn) and
                     arms a 2.5s safety that lifts them whatever happens next.
   · km:turn-markup  the shutters, the lockup, the two + marks and the line, written first in
                     <body>. It carries [hidden]: no script (so no style) = no panel.
   · km:turn-body    runs at the END OF <body>, BEFORE the slot boot: the lift and the hand-off, the
                     write-in (lib/turn.js parts 1 and 3, verbatim), and the leave on internal link
                     clicks (lifted if the next page never arrives; lifted on a back/forward return).
   window.KMTurn = { motion, warm, t0, safety, body, open }: the boot waits on KMTurn.open, which
   resolves as the lift starts (never before the h1 is split, never after the safety); the boot
   then plays the first section 180ms later, as the shutters part.
   Reduced motion: no style, no class, no split, no turn. Arrived-by-a-turn is the same one
   sessionStorage flag ("km-turn"). Timings are the custom properties at the top of the style.

   States on <html> (own names, so the kit's §13 turn CSS still inlined in a page stays inert):
     km-ta-leave    leaving: the shutters close, the line is ruled, the lockup rises
     km-ta-arrive   the shutters are closed from the first paint (+ km-ta-cold entering cold)
     km-ta-lift     the lockup sinks, the shutters part, the + marks fade
     km-ta-hand     the line travels onto the page's rule (its path is set on the line as --tx --ty --sx)
     km-ta-back     no rule to land on: the line runs back into its left + mark
   The rule the line lands on carries .km-ta-target (held invisible, its own draw off) until the
   line arrives, then .km-ta-landed (shown; its draw stays off, so it never draws a second time).
   Positions: the seam sits at 56% of the window, whole-pixel where the browser can round (the
   plain percentage otherwise), so the line, the two hairlines and the lockup's cut coincide. */

/* <km:turn-head> */
(function (d) {
  if (window.KMTurn) return;
  var T = window.KMTurn = { motion: false, warm: false, t0: (window.performance && performance.now()) || 0 };
  try { T.motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (!T.motion) return;   /* reduced motion: no style, no class, nothing */
  /* the brand lockup (site/brand/kelwin-lockup.svg, byte for byte), embedded so the turn never waits on a fetch:
     arriving, the lockup must stand on the line in the very first frame (a fetched mask can miss it and blink) */
  var LOCKUP = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 734 152' fill='%23000'%3E%3Crect x='0' y='0' width='152' height='45'/%3E%3Crect x='108' y='0' width='44' height='152'/%3E%3Crect x='0' y='60' width='94' height='38'/%3E%3Crect x='55' y='60' width='39' height='92'/%3E%3Crect x='0' y='114' width='42' height='38'/%3E%3Cpath fill-rule='evenodd' d='M366.88 139.37C366.74 139.31 364.99 139.14 363.00 139.01C361.01 138.88 358.81 138.66 358.12 138.53C357.44 138.40 356.43 138.22 355.88 138.13C355.32 138.04 354.37 137.76 353.75 137.51C353.13 137.26 351.95 136.86 351.12 136.63C350.30 136.40 348.68 135.75 347.52 135.21C346.37 134.66 345.19 134.10 344.90 133.98C344.61 133.85 343.63 133.27 342.72 132.68C341.82 132.10 340.53 131.29 339.87 130.88C339.22 130.46 338.37 129.84 338.01 129.50C337.64 129.16 336.78 128.36 336.11 127.72C333.79 125.56 330.48 121.91 329.99 120.98C329.82 120.65 329.05 119.42 328.29 118.25C327.53 117.08 326.41 115.00 325.79 113.62C325.18 112.25 324.52 110.90 324.34 110.63C324.15 110.36 324.00 109.97 324.00 109.76C324.01 109.34 323.13 106.37 322.60 105.00C322.41 104.52 322.09 102.86 321.88 101.31C321.67 99.76 321.39 98.02 321.26 97.44C320.87 95.75 320.94 84.78 321.35 82.80C321.54 81.88 321.83 80.06 322.00 78.75C322.17 77.44 322.41 76.17 322.55 75.92C322.79 75.45 323.32 73.69 323.76 71.88C324.13 70.35 326.58 65.03 327.91 62.88C330.19 59.16 333.55 54.97 335.38 53.55C335.93 53.12 336.82 52.36 337.36 51.86C338.79 50.53 342.63 48.02 345.00 46.86C349.20 44.82 351.94 43.76 353.10 43.74C353.39 43.74 353.84 43.57 354.11 43.37C354.38 43.17 354.91 43.00 355.30 43.00C355.69 43.00 356.65 42.84 357.44 42.64C360.36 41.91 362.32 41.75 368.26 41.75C374.14 41.75 375.74 41.89 378.81 42.65C379.60 42.84 380.53 43.00 380.89 43.00C381.24 43.00 381.78 43.14 382.08 43.30C382.38 43.47 383.39 43.80 384.33 44.05C385.96 44.47 387.14 44.96 390.75 46.73C392.65 47.66 392.80 47.75 395.20 49.33C399.28 52.02 404.65 57.40 406.52 60.67C406.94 61.40 407.39 62.05 407.51 62.13C407.82 62.32 411.00 68.85 411.00 69.29C411.00 69.48 411.15 69.86 411.34 70.13C411.53 70.40 411.83 71.30 412.01 72.12C412.19 72.95 412.48 73.93 412.67 74.30C412.85 74.67 413.00 75.36 413.00 75.83C413.00 76.30 413.16 77.13 413.35 77.68C414.04 79.63 414.32 84.04 414.19 90.70C414.12 94.23 413.98 97.31 413.89 97.54C413.79 97.76 413.47 98.02 413.17 98.10C412.87 98.18 396.79 98.24 377.43 98.25C349.50 98.25 342.21 98.31 342.12 98.56C341.95 99.03 342.41 102.19 342.85 103.62C343.66 106.26 344.27 107.76 344.99 108.92C345.40 109.58 345.86 110.39 346.00 110.72C346.62 112.13 349.82 115.49 352.25 117.28C354.32 118.80 357.96 120.65 359.58 120.99C360.15 121.12 361.13 121.38 361.75 121.59C363.89 122.29 368.54 122.54 372.06 122.16C373.81 121.97 375.39 121.70 375.56 121.56C375.73 121.41 376.38 121.17 377.00 121.01C378.43 120.63 380.56 119.64 381.95 118.72C382.54 118.32 383.12 118.00 383.23 118.00C383.58 118.00 387.43 113.86 388.14 112.71C390.18 109.44 390.32 109.26 391.10 109.12C391.53 109.04 396.17 109.01 401.43 109.05C413.01 109.14 412.30 108.91 410.90 112.18C409.08 116.40 408.91 116.75 408.46 117.16C408.21 117.39 408.00 117.73 408.00 117.92C408.00 118.10 407.61 118.82 407.12 119.50C406.64 120.18 406.25 120.86 406.25 121.00C406.25 121.14 406.05 121.45 405.81 121.69C405.57 121.93 404.58 123.08 403.60 124.25C401.80 126.41 401.36 126.83 397.86 129.81C395.89 131.47 390.35 135.00 389.70 135.00C389.51 135.00 389.13 135.16 388.85 135.36C388.37 135.70 386.36 136.47 384.50 137.04C384.02 137.18 383.51 137.39 383.38 137.50C383.24 137.62 382.00 137.90 380.62 138.13C379.25 138.36 378.02 138.62 377.89 138.70C377.76 138.78 376.12 138.92 374.26 139.03C372.40 139.13 370.03 139.27 369.00 139.35C367.97 139.43 367.01 139.44 366.88 139.37ZM223.94 137.73C223.53 137.49 223.50 134.34 223.50 78.36C223.50 19.62 223.51 19.24 224.00 18.75C224.48 18.27 224.84 18.25 233.60 18.25C241.89 18.25 242.74 18.29 243.23 18.69L243.76 19.12L243.82 45.00C243.87 67.77 243.92 70.88 244.25 70.93C244.46 70.96 245.39 70.03 246.38 68.81C247.34 67.62 248.97 65.69 250.01 64.51C251.04 63.34 252.39 61.76 253.00 61.00C253.61 60.24 254.96 58.67 256.00 57.50C257.04 56.33 258.53 54.57 259.32 53.59C260.11 52.61 261.01 51.55 261.32 51.22C261.64 50.89 262.39 50.01 263.01 49.25C263.62 48.49 265.14 46.71 266.37 45.28C267.61 43.85 269.30 41.86 270.12 40.87C270.95 39.88 272.64 37.89 273.88 36.45C275.11 35.02 278.66 30.87 281.75 27.24C284.84 23.60 287.87 20.09 288.47 19.44L289.57 18.25L301.50 18.25C311.69 18.25 313.48 18.30 313.74 18.62C314.22 19.19 315.04 18.14 306.29 28.24C300.08 35.40 296.97 38.98 294.00 42.37C292.42 44.18 289.16 47.94 286.75 50.75C284.34 53.55 280.94 57.48 279.20 59.48C262.90 78.15 263.19 77.81 263.29 78.47C263.34 78.74 265.75 81.64 268.66 84.92C271.56 88.19 276.23 93.47 279.03 96.65C281.83 99.82 284.52 102.86 284.99 103.40C285.47 103.93 287.16 105.84 288.74 107.64C290.33 109.43 292.64 112.03 293.88 113.40C296.17 115.94 301.54 122.03 303.97 124.83C304.70 125.68 306.11 127.27 307.09 128.35C308.07 129.44 309.23 130.73 309.66 131.23C310.09 131.72 311.48 133.28 312.75 134.70C314.20 136.31 315.00 137.40 314.91 137.63C314.79 137.95 312.99 138.00 301.97 138.00L289.17 138.00L288.19 136.94C287.64 136.35 286.06 134.53 284.66 132.89C283.27 131.25 281.22 128.88 280.12 127.64C279.01 126.39 277.55 124.70 276.87 123.88C276.18 123.05 275.56 122.32 275.47 122.25C275.10 121.94 270.72 116.88 269.38 115.22C268.57 114.20 267.71 113.21 267.49 113.00C267.26 112.79 265.63 110.94 263.86 108.88C259.21 103.45 256.15 99.92 254.00 97.50C252.97 96.33 251.56 94.70 250.88 93.88C250.21 93.05 249.48 92.20 249.26 91.98C248.57 91.26 247.39 89.91 246.01 88.25C245.27 87.36 244.49 86.62 244.27 86.62C243.91 86.62 243.87 89.04 243.81 112.11C243.76 132.12 243.68 137.64 243.44 137.79C242.96 138.09 224.46 138.03 223.94 137.73ZM429.03 137.66C428.82 137.41 428.77 120.66 428.81 74.22L428.88 11.12L438.60 11.06C445.55 11.01 448.41 11.07 448.66 11.28C448.94 11.51 449.00 21.67 449.00 74.44C449.00 120.24 448.92 137.42 448.72 137.66C448.30 138.16 429.44 138.16 429.03 137.66ZM487.74 137.23C487.44 136.81 487.10 136.10 486.98 135.67C486.39 133.42 485.65 131.05 485.34 130.46C485.16 130.10 485.00 129.56 485.00 129.26C485.00 128.97 484.85 128.42 484.67 128.05C484.48 127.68 484.18 126.70 484.00 125.88C483.82 125.05 483.59 124.26 483.50 124.12C483.40 123.99 483.02 122.86 482.65 121.62C482.27 120.39 481.80 118.87 481.60 118.25C481.05 116.55 480.51 114.81 480.00 113.00C479.46 111.13 479.06 109.94 478.62 108.86C478.45 108.44 478.17 107.43 478.00 106.61C477.83 105.79 477.61 105.01 477.51 104.88C477.41 104.74 476.97 103.44 476.52 102.00C476.08 100.56 475.44 98.53 475.09 97.50C474.75 96.47 474.26 94.84 474.00 93.88C473.74 92.91 473.19 91.11 472.78 89.88C472.37 88.64 471.52 85.94 470.88 83.88C470.25 81.81 469.61 79.79 469.47 79.38C469.32 78.96 469.12 78.28 469.02 77.87C468.91 77.45 468.71 76.89 468.57 76.62C468.42 76.35 468.16 75.45 467.99 74.62C467.81 73.80 467.59 73.01 467.50 72.88C467.33 72.63 466.07 68.63 465.33 66.00C465.12 65.24 464.80 64.29 464.62 63.88C464.44 63.46 464.17 62.56 464.00 61.88C463.84 61.19 463.56 60.23 463.39 59.75C462.71 57.88 462.44 57.05 461.85 55.00C461.03 52.19 460.22 49.59 459.47 47.38C459.33 46.96 459.04 45.96 458.82 45.15C458.46 43.75 458.46 43.65 458.89 43.33C459.26 43.06 461.23 43.01 468.96 43.06C477.21 43.12 478.60 43.18 478.76 43.50C479.12 44.20 479.99 47.23 480.14 48.31C480.22 48.89 480.43 49.77 480.61 50.25C480.99 51.28 481.35 52.62 481.99 55.38C482.24 56.47 482.57 57.71 482.71 58.12C483.00 59.00 483.35 60.35 484.00 63.12C484.25 64.22 484.57 65.46 484.71 65.88C485.00 66.74 485.33 68.04 486.00 70.88C486.26 71.97 486.70 73.66 486.99 74.62C487.27 75.59 487.73 77.33 487.99 78.50C488.26 79.67 488.71 81.41 488.99 82.38C489.27 83.34 489.73 85.12 490.01 86.34C490.29 87.56 490.62 88.76 490.76 89.01C490.89 89.26 491.00 89.76 491.00 90.12C491.00 90.48 491.15 91.08 491.34 91.45C491.53 91.82 491.82 92.91 491.99 93.88C492.16 94.84 492.45 96.02 492.62 96.50C493.04 97.67 493.45 99.23 493.92 101.50C494.14 102.53 494.45 103.77 494.62 104.25C495.02 105.35 495.41 106.82 495.99 109.40C496.24 110.51 496.57 111.66 496.72 111.94C496.87 112.23 497.01 112.78 497.01 113.17C497.03 114.17 497.87 116.12 498.28 116.12C498.48 116.12 498.71 115.71 498.83 115.12C498.94 114.57 499.15 113.79 499.29 113.38C499.43 112.96 499.65 112.12 499.78 111.50C500.04 110.20 500.91 106.97 501.29 105.88C501.43 105.46 501.70 104.39 501.89 103.50C502.21 102.01 502.44 101.18 503.37 98.00C503.55 97.38 503.83 96.26 503.99 95.50C504.16 94.74 504.44 93.62 504.62 93.00C505.24 90.92 505.72 89.13 506.11 87.50C506.33 86.61 506.73 85.09 507.02 84.12C507.30 83.16 507.73 81.47 507.98 80.38C508.23 79.28 508.56 78.06 508.72 77.67C508.87 77.28 509.00 76.74 509.00 76.46C509.00 76.18 509.16 75.60 509.35 75.16C509.54 74.73 509.84 73.64 510.01 72.75C510.18 71.86 510.47 70.75 510.66 70.28C510.85 69.82 511.00 69.16 511.00 68.83C511.00 68.49 511.13 67.97 511.29 67.67C511.45 67.38 511.77 66.29 512.01 65.25C512.72 62.16 513.05 60.91 513.32 60.25C513.46 59.91 513.77 58.72 514.02 57.62C514.68 54.72 515.01 53.48 515.40 52.55C515.59 52.10 515.75 51.48 515.75 51.17C515.75 50.87 515.98 49.83 516.26 48.87C516.55 47.91 516.88 46.65 517.01 46.07C517.13 45.49 517.46 44.56 517.75 44.01L518.26 43.00L528.37 43.00C536.18 43.00 538.52 43.07 538.67 43.31C538.94 43.72 539.43 45.41 540.00 47.88C540.68 50.75 541.01 52.02 541.29 52.88C541.43 53.29 541.74 54.53 541.98 55.62C542.22 56.72 542.54 58.02 542.69 58.50C543.10 59.84 543.50 61.41 544.01 63.75C544.27 64.92 544.60 66.13 544.74 66.45C544.88 66.77 545.00 67.31 545.00 67.65C545.00 67.99 545.15 68.58 545.34 68.95C545.52 69.32 545.81 70.36 545.97 71.25C546.25 72.84 546.43 73.55 547.47 77.12C547.75 78.09 548.10 79.52 548.23 80.31C548.37 81.10 548.60 81.97 548.74 82.23C548.88 82.50 549.00 83.03 549.00 83.42C549.00 83.81 549.15 84.41 549.33 84.76C549.51 85.11 549.80 86.12 549.97 87.01C550.27 88.56 550.48 89.37 551.50 93.00C551.75 93.89 552.20 95.75 552.50 97.12C552.81 98.50 553.26 100.30 553.52 101.12C554.04 102.81 554.66 105.29 554.99 107.05C555.11 107.69 555.33 108.43 555.46 108.68C555.60 108.93 555.88 110.04 556.09 111.14C556.30 112.23 556.59 113.45 556.73 113.83C556.88 114.22 557.00 114.83 557.00 115.20C557.01 116.12 557.39 116.71 557.76 116.34C558.00 116.10 558.28 115.11 558.99 111.88C559.11 111.32 559.38 110.37 559.58 109.75C560.01 108.42 560.74 105.53 561.01 104.12C561.12 103.57 561.38 102.62 561.59 102.00C561.80 101.38 562.22 99.75 562.51 98.38C562.81 97.00 563.19 95.54 563.37 95.12C563.54 94.71 563.76 93.98 563.85 93.50C564.21 91.60 565.07 88.08 565.38 87.25C565.76 86.23 567.00 81.05 567.00 80.50C567.00 80.29 567.17 79.81 567.37 79.43C567.57 79.04 567.81 78.31 567.90 77.80C567.99 77.29 568.23 76.26 568.43 75.50C568.64 74.74 568.89 73.68 568.99 73.12C569.09 72.57 569.30 71.84 569.45 71.50C569.60 71.16 570.02 69.58 570.38 68.00C570.73 66.42 571.15 64.79 571.29 64.38C571.44 63.96 571.72 62.95 571.91 62.12C572.10 61.30 572.54 59.56 572.89 58.25C573.24 56.94 573.73 55.03 573.98 54.00C574.93 50.08 575.05 49.60 575.30 48.88C575.44 48.46 575.72 47.39 575.92 46.50C576.11 45.61 576.47 44.48 576.70 44.00L577.12 43.12L586.12 43.06C591.08 43.02 595.37 43.04 595.66 43.12C595.95 43.19 596.26 43.43 596.35 43.64C596.52 44.08 595.92 46.37 595.36 47.45C595.16 47.82 595.00 48.26 595.00 48.43C595.00 48.91 593.70 53.35 593.48 53.63C593.37 53.78 593.16 54.34 593.03 54.88C592.41 57.33 591.73 59.67 591.50 60.12C591.25 60.62 590.80 62.13 590.14 64.64C589.96 65.34 589.67 66.18 589.49 66.52C589.31 66.85 589.07 67.52 588.97 68.00C588.57 69.74 587.80 72.39 587.43 73.25C587.22 73.73 586.80 75.03 586.49 76.12C586.17 77.22 585.49 79.47 584.96 81.11C584.43 82.75 584.00 84.27 583.99 84.49C583.99 84.70 583.77 85.32 583.50 85.88C583.23 86.43 583.01 87.04 583.01 87.23C583.00 87.64 582.14 90.52 581.48 92.38C581.23 93.06 580.80 94.47 580.51 95.50C580.22 96.53 579.87 97.68 579.74 98.06C579.61 98.44 579.39 99.06 579.26 99.44C579.13 99.82 578.78 100.97 578.49 102.00C578.20 103.03 577.76 104.44 577.52 105.12C577.27 105.81 576.82 107.28 576.51 108.38C576.20 109.47 575.75 110.94 575.51 111.62C574.86 113.44 574.00 116.34 574.00 116.72C574.00 116.90 573.83 117.40 573.63 117.84C573.26 118.61 572.96 119.59 572.14 122.62C571.92 123.45 571.61 124.35 571.45 124.62C571.29 124.90 571.07 125.52 570.97 126.00C570.54 127.88 569.76 130.51 569.47 131.05C569.30 131.37 569.08 132.02 568.97 132.50C568.53 134.56 567.52 137.59 567.21 137.78C566.80 138.04 546.73 138.07 546.36 137.81C546.22 137.71 545.98 137.12 545.83 136.50C545.68 135.88 545.43 135.04 545.28 134.62C544.81 133.29 543.75 129.14 543.75 128.61C543.75 128.33 543.65 127.99 543.53 127.86C543.29 127.62 542.35 124.20 541.97 122.25C541.85 121.63 541.60 120.73 541.41 120.25C541.05 119.35 540.81 118.47 540.02 115.25C539.76 114.22 539.44 113.04 539.30 112.62C538.88 111.44 538.31 109.25 537.99 107.62C537.83 106.80 537.61 106.01 537.50 105.88C537.28 105.59 536.62 103.17 536.10 100.75C535.91 99.86 535.59 98.73 535.41 98.25C535.05 97.35 534.81 96.46 534.02 93.25C533.76 92.22 533.44 91.04 533.30 90.62C532.88 89.44 532.31 87.25 531.99 85.62C531.83 84.80 531.61 84.01 531.50 83.88C531.30 83.62 530.77 81.73 530.00 78.50C529.76 77.47 529.44 76.29 529.30 75.88C528.71 74.17 528.27 72.56 528.12 71.56C527.97 70.59 527.63 70.04 527.35 70.31C527.20 70.46 526.59 72.72 526.12 74.88C525.91 75.84 525.59 77.07 525.40 77.62C524.72 79.63 524.29 81.14 524.15 82.00C524.07 82.48 523.77 83.66 523.48 84.62C523.19 85.59 522.81 86.88 522.62 87.50C522.44 88.12 522.16 89.24 522.00 90.00C521.84 90.76 521.55 91.73 521.35 92.16C521.16 92.60 521.00 93.19 521.00 93.49C521.00 93.79 520.87 94.27 520.72 94.55C520.57 94.84 520.24 95.99 519.99 97.10C519.75 98.21 519.30 99.91 519.01 100.88C518.71 101.84 518.37 103.13 518.24 103.75C518.03 104.75 517.51 106.59 516.69 109.25C516.54 109.73 516.22 110.97 515.98 112.00C515.74 113.03 515.42 114.24 515.27 114.69C515.12 115.13 514.88 115.87 514.72 116.31C514.57 116.76 514.35 117.69 514.23 118.38C514.03 119.50 513.53 121.29 512.62 124.12C512.44 124.68 512.23 125.52 512.15 126.00C512.01 126.82 511.27 129.45 510.71 131.12C510.57 131.54 510.26 132.78 510.01 133.88C509.50 136.11 509.00 137.53 508.62 137.81C508.49 137.91 503.85 137.99 498.33 138.00L488.28 138.00L487.74 137.23ZM606.38 137.77C606.30 137.64 606.24 116.35 606.25 90.47C606.25 53.30 606.32 43.36 606.57 43.20C607.10 42.86 625.60 42.95 625.95 43.30C626.39 43.74 626.39 137.26 625.95 137.70C625.58 138.07 606.61 138.14 606.38 137.77ZM647.17 137.83C647.08 137.74 647.00 116.50 647.00 90.63C647.00 54.39 647.07 43.53 647.30 43.30C647.52 43.08 650.06 43.00 657.17 43.00C666.63 43.00 666.74 43.01 667.01 43.52C667.20 43.87 667.27 45.50 667.22 48.32C667.17 50.92 667.24 52.62 667.38 52.67C667.52 52.71 668.42 51.98 669.40 51.05C670.96 49.55 675.89 46.01 676.43 46.00C676.54 46.00 677.30 45.65 678.12 45.23C679.67 44.45 682.65 43.32 683.75 43.10C684.09 43.03 684.94 42.82 685.62 42.63C686.31 42.44 687.56 42.17 688.39 42.02C690.34 41.67 699.89 41.67 701.86 42.01C704.57 42.49 707.11 43.08 707.75 43.38C708.09 43.55 708.80 43.76 709.33 43.86C709.85 43.95 711.22 44.47 712.38 45.01C713.53 45.56 714.56 46.00 714.67 46.00C714.78 46.00 715.49 46.42 716.25 46.94C717.01 47.46 717.91 48.01 718.25 48.17C719.58 48.77 725.08 54.09 726.33 55.98C728.61 59.42 730.80 63.60 731.13 65.12C731.21 65.54 731.43 66.27 731.61 66.75C732.66 69.62 732.89 70.89 733.62 77.52C734.16 82.37 734.19 137.28 733.66 137.72C733.41 137.93 730.60 137.99 723.72 137.94L714.12 137.88L713.99 110.50C713.85 82.15 713.83 81.59 712.78 76.12C712.50 74.64 711.87 72.88 711.36 72.16C711.16 71.87 711.00 71.45 711.00 71.23C711.00 70.43 708.38 66.84 706.42 64.97C703.78 62.43 700.32 60.62 697.00 60.04C690.63 58.93 690.80 58.94 688.13 59.37C683.09 60.18 681.90 60.51 679.35 61.78C674.00 64.43 669.97 69.50 668.54 75.38C668.28 76.47 667.91 77.88 667.73 78.50C667.47 79.39 667.37 85.77 667.26 108.50C667.19 124.38 667.03 137.52 666.92 137.69C666.77 137.93 664.51 138.00 657.03 138.00C651.70 138.00 647.26 137.93 647.17 137.83ZM392.81 81.75C393.14 81.75 393.02 77.53 392.66 76.68C392.48 76.24 392.18 75.26 392.00 74.51C391.82 73.76 391.36 72.64 390.97 72.01C390.58 71.39 390.14 70.60 389.99 70.26C389.25 68.57 385.93 65.17 383.20 63.31C382.14 62.59 381.21 62.00 381.14 62.00C381.07 62.00 380.18 61.60 379.16 61.12C378.14 60.63 376.58 60.08 375.71 59.89C374.84 59.71 373.79 59.42 373.38 59.26C372.19 58.79 362.87 58.84 361.73 59.32C361.23 59.52 360.23 59.82 359.49 59.98C355.66 60.80 349.60 65.12 347.03 68.88C345.96 70.42 344.00 73.94 344.00 74.30C344.00 74.47 343.79 75.18 343.53 75.87C343.27 76.56 342.92 77.63 342.76 78.25C342.61 78.87 342.37 79.81 342.23 80.34C342.08 80.95 342.07 81.41 342.22 81.59C342.40 81.80 349.02 81.86 367.54 81.81C381.34 81.78 392.71 81.75 392.81 81.75ZM613.95 31.01C613.03 30.92 612.13 30.72 611.95 30.59C611.77 30.45 611.11 30.14 610.47 29.91C607.89 28.96 604.93 25.33 604.08 22.06C603.49 19.82 603.72 15.28 604.50 13.50C605.52 11.19 607.42 8.79 608.94 7.91C612.18 6.02 613.67 5.64 617.15 5.81C620.05 5.94 621.10 6.28 623.42 7.81C624.99 8.84 627.00 10.88 627.00 11.44C627.00 11.57 627.22 11.87 627.50 12.12C627.77 12.37 628.07 12.98 628.16 13.47C628.25 13.97 628.48 14.74 628.66 15.18C628.87 15.67 629.00 16.94 629.00 18.43C629.00 22.42 627.79 25.30 625.04 27.93C623.75 29.16 623.15 29.52 620.75 30.56C619.69 31.02 616.23 31.25 613.95 31.01Z'/%3E%3C/svg%3E";
  var css = [
    ":root {",
    "  --km-ta-leave: 620ms;      /* leaving: click → the next page is requested (the lockup is up by then) */",
    "  --km-ta-hold-cold: 560ms;  /* entering cold: the line is ruled, the lockup rises, then the lift */",
    "  --km-ta-hold-warm: 60ms;   /* arriving by a turn: everything is already there */",
    "  --km-ta-part-at: 140ms;    /* the lift: the lockup sinks, then the shutters part and the line leaves */",
    "  --km-ta-part: 320ms;       /* the shutters part */",
    "  --km-ta-hand: 560ms;       /* the line travels onto the page's rule */",
    "  --km-ta-back: 280ms;       /* no rule in view: the line runs back into its left + */",
    "  --km-ta-ease: cubic-bezier(.6, 0, .4, 1);",
    "}",
    ".km-ta {",
    "  display: block; position: fixed; inset: 0; z-index: 1000; pointer-events: none; visibility: hidden; overflow: hidden;",
    "  zoom: calc(1 / var(--page-zoom, 1));   /* chrome: never shrinks with the zoomed 1440 stage */",
    "  --m: 64px; --y: 56%; --lw: .7;        /* margin · the seam · the lockup's share of the measure (the footer's 70%) */",
    "}",
    "@supports (top: round(down, 56%, 1px)) { .km-ta { --y: round(down, 56%, 1px); } }",
    "@media (max-width: 1023px) { .km-ta { --m: 24px; } }",
    "@media (max-width: 767px) { .km-ta { --m: 16px; --lw: .86; } }",
    "html.km-ta-leave .km-ta, html.km-ta-arrive .km-ta { visibility: visible; }",
    /* the shutters: flat graphite (the footer's ground), straight edges, a hairline on the seam side */
    ".km-ta__sh { position: absolute; left: 0; right: 0; background: var(--bg); }",
    ".km-ta__sh--t { top: 0; height: var(--y); box-shadow: inset 0 -1px 0 var(--line-2); transform: translateY(-101%); }",
    ".km-ta__sh--b { top: var(--y); bottom: 0; box-shadow: inset 0 1px 0 var(--line-2); transform: translateY(101%); }",
    /* the lockup: set right, standing on the line; its box ends where the line begins and holds the
       top four fifths, so the lower fifth is buried behind the line (the footer's cut) */
    ".km-ta__lk { position: absolute; right: var(--m); bottom: calc(100% - var(--y) + 1px); width: calc((100% - 2 * var(--m)) * var(--lw)); aspect-ratio: 734 / 121.6; overflow: hidden; color: var(--line-2); }",
    ".km-ta__lk > .km-logo { display: block; width: 100%; height: auto; transform: translateY(101%); }",
    ".km-ta__lk > .km-logo { --logo-src: url(\"" + LOCKUP + "\"); }",
    /* a + at each end of the line (13px, 1px bars), centred on its ends */
    ".km-ta__reg { position: absolute; top: calc(var(--y) - 7px); width: 13px; height: 13px; opacity: 0; }",
    ".km-ta__reg::before, .km-ta__reg::after { content: \"\"; position: absolute; background: var(--fg-2); }",
    ".km-ta__reg::before { left: 0; right: 0; top: 6px; height: 1px; }",
    ".km-ta__reg::after { top: 0; bottom: 0; left: 6px; width: 1px; }",
    ".km-ta__reg--l { left: calc(var(--m) - 6px); }",
    ".km-ta__reg--r { left: calc(100% - var(--m) - 7px); }",
    /* the line: 2px red, margin to margin, centred on the seam (over both hairlines) */
    ".km-ta__line { position: absolute; left: var(--m); right: var(--m); top: calc(var(--y) - 1px); height: 2px; background: var(--signal); transform: scaleX(0); transform-origin: 0 50%; }",
    "@keyframes km-ta-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }",
    "@keyframes km-ta-back { from { transform: scaleX(1); } to { transform: scaleX(0); } }",
    "@keyframes km-ta-hand { from { transform: translate(0px, 0px) scale(1, 1); } to { transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(var(--sx, 1), 1); background-color: var(--to, var(--signal)); } }",
    "@keyframes km-ta-on { from { opacity: 0; } to { opacity: 1; } }",
    "@keyframes km-ta-off { from { opacity: 1; } to { opacity: 0; } }",
    "@keyframes km-ta-close-t { from { transform: translateY(-101%); } to { transform: none; } }",
    "@keyframes km-ta-close-b { from { transform: translateY(101%); } to { transform: none; } }",
    "@keyframes km-ta-open-t { from { transform: none; } to { transform: translateY(-101%); } }",
    "@keyframes km-ta-open-b { from { transform: none; } to { transform: translateY(101%); } }",
    "@keyframes km-ta-rise { from { transform: translateY(101%); } to { transform: none; } }",
    "@keyframes km-ta-sink { from { transform: none; } to { transform: translateY(101%); } }",
    /* leaving: 0–280 the shutters close · 260–480 the line is ruled along the seam (a + at each end
       as it gets there) · 380–620 the lockup rises out of the line */
    "html.km-ta-leave .km-ta__sh--t { animation: km-ta-close-t 280ms var(--km-ta-ease) both; }",
    "html.km-ta-leave .km-ta__sh--b { animation: km-ta-close-b 280ms var(--km-ta-ease) both; }",
    "html.km-ta-leave .km-ta__reg--l { animation: km-ta-on 80ms linear 250ms both; }",
    "html.km-ta-leave .km-ta__line { animation: km-ta-draw 220ms cubic-bezier(.3, 0, .2, 1) 260ms both; }",
    "html.km-ta-leave .km-ta__reg--r { animation: km-ta-on 80ms linear 440ms both; }",
    "html.km-ta-leave .km-ta__lk > .km-logo { animation: km-ta-rise 240ms cubic-bezier(.2, .7, .3, 1) 380ms both; }",
    /* arriving: closed from the first paint, everything already there (warm) */
    "html.km-ta-arrive .km-ta__sh, html.km-ta-arrive .km-ta__line, html.km-ta-arrive .km-ta__lk > .km-logo { transform: none; }",
    "html.km-ta-arrive .km-ta__reg { opacity: 1; }",
    /* …entering cold: 40–280 the line is ruled · 200–460 the lockup rises · the lift at 560 */
    "html.km-ta-arrive.km-ta-cold .km-ta__reg--l { animation: km-ta-on 80ms linear both; }",
    "html.km-ta-arrive.km-ta-cold .km-ta__line { animation: km-ta-draw 240ms cubic-bezier(.3, 0, .2, 1) 40ms both; }",
    "html.km-ta-arrive.km-ta-cold .km-ta__reg--r { animation: km-ta-on 80ms linear 260ms both; }",
    "html.km-ta-arrive.km-ta-cold .km-ta__lk > .km-logo { animation: km-ta-rise 260ms cubic-bezier(.2, .7, .3, 1) 200ms both; }",
    /* the lift: 0–180 the lockup sinks into the line · 140–460 the shutters part · 140– the + marks
       fade and the line leaves (the hand-off, or the run back) */
    "html.km-ta-arrive.km-ta-lift .km-ta__lk > .km-logo { animation: km-ta-sink 180ms cubic-bezier(.5, 0, .75, 0) both; }",
    "html.km-ta-arrive.km-ta-lift .km-ta__sh--t { animation: km-ta-open-t var(--km-ta-part) var(--km-ta-ease) var(--km-ta-part-at) both; }",
    "html.km-ta-arrive.km-ta-lift .km-ta__sh--b { animation: km-ta-open-b var(--km-ta-part) var(--km-ta-ease) var(--km-ta-part-at) both; }",
    "html.km-ta-arrive.km-ta-lift .km-ta__reg { animation: km-ta-off 160ms linear var(--km-ta-part-at) both; }",
    "html.km-ta-arrive.km-ta-hand .km-ta__line { animation: km-ta-hand var(--km-ta-hand) cubic-bezier(.65, 0, .35, 1) var(--km-ta-part-at) both; }",
    "html.km-ta-arrive.km-ta-back .km-ta__line { animation: km-ta-back var(--km-ta-back) cubic-bezier(.65, 0, .35, 1) var(--km-ta-part-at) both; }",
    "html.km-ta-arrive.km-ta-back .km-ta__reg--l { animation: km-ta-off 160ms linear calc(var(--km-ta-part-at) + var(--km-ta-back)) both; }",
    /* the page's rule: invisible, its own draw off, until the line lands on it; then simply there */
    ".ac-rule.km-ta-target { opacity: 0 !important; animation: none !important; }",
    ".ac-rule.km-ta-landed { animation: none !important; }"
  ].join("\n");
  var s = document.createElement("style");
  s.setAttribute("data-km-turn", "a"); s.textContent = css;
  (document.head || d).appendChild(s);
  if (document.body) return;   /* too late to cover the first paint: no arrival */
  try { T.warm = sessionStorage.getItem("km-turn") === "1"; sessionStorage.removeItem("km-turn"); } catch (e) {}
  d.classList.add("km-ta-arrive"); if (!T.warm) d.classList.add("km-ta-cold");
  T.safety = setTimeout(function () { d.classList.remove("km-ta-arrive", "km-ta-cold", "km-ta-lift", "km-ta-hand", "km-ta-back"); }, 2500);
})(document.documentElement);
/* </km:turn-head> */

/* <km:turn-body> */
(function () {
  var d = document.documentElement, T = window.KMTurn;
  if (!T || T.body) return;
  T.body = true;

  /* <km:turn-markup> */
  var KM_TURN_MARKUP = '<div class="km-ta" data-surface="dark" aria-hidden="true" hidden><div class="km-ta__sh km-ta__sh--t"></div><div class="km-ta__sh km-ta__sh--b"></div><div class="km-ta__lk"><span class="km-logo"></span></div><span class="km-ta__reg km-ta__reg--l"></span><span class="km-ta__reg km-ta__reg--r"></span><div class="km-ta__line"></div></div>';
  /* </km:turn-markup> */
  if (!document.querySelector(".km-ta")) document.body.insertAdjacentHTML("afterbegin", KM_TURN_MARKUP);
  var panel = document.querySelector(".km-ta"), line = panel.querySelector(".km-ta__line");

  var css = getComputedStyle(d);
  function ms(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
  var LEAVE = ms("--km-ta-leave", 620), PART_AT = ms("--km-ta-part-at", 140), PART = ms("--km-ta-part", 320);
  var HAND = ms("--km-ta-hand", 560), BACK = ms("--km-ta-back", 280);
  var HOLD = T.warm ? ms("--km-ta-hold-warm", 60) : ms("--km-ta-hold-cold", 560);
  var END = PART_AT + Math.max(PART, HAND, BACK + 160) + 60;   /* the lift is over: the classes come off */
  function now() { return performance.now(); }

  /* 1 · the write-in is prepared first: the h1 is split once its face has loaded (the letters
     are measured as set), and nothing plays before that */
  function noop() {}
  function wait(t) { return new Promise(function (ok) { setTimeout(ok, Math.max(0, t)); }); }
  var heads = T.motion ? document.querySelectorAll(".ac-ihead > h1.ac-statement") : [];   /* the page h1 only */
  var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var face = Promise.resolve();
  if (heads.length && document.fonts && document.fonts.load) {
    var hcs = getComputedStyle(heads[0]);
    face = document.fonts.load(hcs.fontWeight + " " + hcs.fontSize + " " + hcs.fontFamily).then(noop, noop);
  }
  var split = Promise.all([fonts, face]).then(function () { Array.prototype.forEach.call(heads, writeIn); }).then(noop, noop);

  /* 2 · arriving: hold, then lift. KMTurn.open resolves as the lift starts (and never before
     the split; never later than the safety). The line then hands off to the page's rule. */
  var opened, lifted = false, clearer = 0, landSafety = 0, target = null, travelling = false;
  var openP = new Promise(function (ok) { opened = ok; });
  T.open = Promise.race([Promise.all([openP, split]), wait(T.t0 + 2500 - now())]).then(noop);

  /* the rule to land on: the rule under an INTERIOR page headline (.ac-ihead), wholly inside the
     window and shown, measured as laid out (before the boot plays, every rule is in its final
     place). The homepage hero's rule is never a target: its approved motion stays as it is. */
  function findRule() {
    var vw = window.innerWidth, vh = window.innerHeight, rules = document.querySelectorAll(".ac-ihead > .ac-rule");
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i].getBoundingClientRect();
      if (r.width < 1 || r.height <= 0 || r.left < 0 || r.top < 0 || r.right > vw || r.bottom > vh) continue;
      var cs = getComputedStyle(rules[i]);
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
      return rules[i];
    }
    return null;
  }
  function release() {   /* the rule is shown in its place (its own draw stays off) */
    if (!target) return;
    target.classList.add("km-ta-landed"); target.classList.remove("km-ta-target"); target = null;
  }
  function land() {   /* the line becomes the rule: in the same frame, the rule shows and the line goes */
    clearTimeout(landSafety); stopWatch();
    if (!travelling) return;
    travelling = false;
    release();
    line.style.visibility = "hidden";
  }
  function onLineEnd(e) { if (e.target === line && e.animationName === "km-ta-hand") land(); }
  line.addEventListener("animationend", onLineEnd);
  /* a scroll or a resize while the line travels: the path it measured is no longer true — cancel
     the travel, let the line run back where it is, and show the rule in its own place */
  function abort() {
    if (!travelling) return;
    travelling = false; clearTimeout(landSafety); stopWatch();
    var m = getComputedStyle(line).transform; m = (m && m !== "none") ? m : "";
    d.classList.remove("km-ta-hand");
    release();
    if (line.animate) {
      line.animate([{ transform: (m || "translate(0px, 0px)") + " scaleX(1)" }, { transform: (m || "translate(0px, 0px)") + " scaleX(0)" }],
        { duration: 200, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" });
    } else line.style.visibility = "hidden";
  }
  function watch() { window.addEventListener("scroll", abort, { passive: true }); window.addEventListener("resize", abort); }
  function stopWatch() { window.removeEventListener("scroll", abort); window.removeEventListener("resize", abort); }
  function handOff() {   /* map the line onto the rule: its left end onto the rule's left end, centre line onto centre line */
    /* measured from layout boxes, never from the line's current transform (it may still be drawing):
       the rule's box is brought into the panel's own pixels (the panel is zoom-corrected, never transformed) */
    var p = panel.getBoundingClientRect(), b = target.getBoundingClientRect(), w = line.offsetWidth;
    var z = p.width / (panel.offsetWidth || p.width) || 1;
    if (w < 1 || b.width <= 0) return false;
    line.style.setProperty("--tx", ((b.left - p.left) / z - line.offsetLeft).toFixed(2) + "px");
    line.style.setProperty("--ty", (((b.top + b.height / 2) - p.top) / z - (line.offsetTop + line.offsetHeight / 2)).toFixed(2) + "px");
    line.style.setProperty("--sx", (b.width / z / w).toFixed(5));
    line.style.setProperty("--to", getComputedStyle(target).backgroundColor);
    travelling = true;
    d.classList.add("km-ta-hand");
    watch();
    landSafety = setTimeout(land, PART_AT + HAND + 120);   /* if animationend never comes */
    return true;
  }
  function clear() {   /* the turn is over: the panel hides, the line is put back for the next turn */
    clearTimeout(clearer); clearTimeout(landSafety); stopWatch();
    if (travelling) land();
    release();
    d.classList.remove("km-ta-arrive", "km-ta-cold", "km-ta-lift", "km-ta-hand", "km-ta-back");
    if (line.getAnimations) line.getAnimations().forEach(function (an) { if (!an.animationName) an.cancel(); });
    line.style.visibility = "";
  }
  function lift(hand) {   /* hand: a fresh page (not a back/forward return or a failed navigation) */
    clearTimeout(T.safety); clearTimeout(clearer);
    target = hand ? findRule() : null;
    if (target) target.classList.add("km-ta-target");
    d.classList.add("km-ta-lift");
    if (!target || !handOff()) { release(); d.classList.add("km-ta-back"); }
    opened();
    clearer = setTimeout(clear, END);
  }
  function liftOnce() { if (!lifted) { lifted = true; lift(true); } }
  if (T.motion && d.classList.contains("km-ta-arrive")) {
    /* entering cold, the line is ruled and the lockup rises first: the lift waits for them to finish
       (they start with the first frame, which a long page may paint late), then a short rest */
    var intro = (!T.warm && panel.getAnimations) ? panel.getAnimations({ subtree: true }) : [];
    var introDone = Promise.all(intro.map(function (an) { return an.finished.then(noop, noop); })).then(function () { return intro.length ? wait(80) : null; });
    Promise.all([split, wait(T.t0 + HOLD - now()), introDone]).then(liftOnce);
    wait(T.t0 + 2100 - now()).then(liftOnce);   /* never hold past ~2.1s */
  } else {
    lifted = true; opened();
  }

  /* 3 · the write-in (interior heads only) */
  function writeIn(h) {
    var spans = h.querySelectorAll(".ac-line > span");
    if (!spans.length) return;
    var original = Array.prototype.map.call(h.childNodes, function (n) { return n.cloneNode(true); });
    var lines = h.querySelectorAll(".ac-line");   /* the words, line by line (lines may sit back to back) */
    var label = (lines.length ? Array.prototype.map.call(lines, function (l) { return l.textContent; }).join(" ") : h.textContent).replace(/\s+/g, " ").trim();

    /* a · where every character sits as set (kerned), the text nodes to split, and where each
       line of the set type starts (a soft wrap inside an .ac-line: a space, a hyphen, a dash…) */
    var pos = [], nodes = [], range = document.createRange(), spanStart = false;
    var half = (parseFloat(getComputedStyle(h).fontSize) || 40) * 0.5 * (h.getBoundingClientRect().width / (h.offsetWidth || 1) || 1);
    var lastTop = null;
    function texts(el) {
      Array.prototype.forEach.call(el.childNodes, function (n) {
        if (n.nodeType === 3) {
          var start = pos.length, off = 0;
          Array.from(n.data).forEach(function (c) {
            range.setStart(n, off); range.setEnd(n, off + c.length); off += c.length;
            var r = range.getBoundingClientRect(), p = { c: c, left: r.left, top: r.top, w: r.width, brk: false, line: false };
            if (!/\s/.test(c)) {
              if (lastTop !== null && r.top - lastTop > half) p.brk = true;
              if (p.brk || spanStart) { p.line = true; spanStart = false; }   /* a set line starts here */
              lastTop = r.top;
            }
            pos.push(p);
          });
          nodes.push({ node: n, start: start });
        } else if (n.nodeType === 1) texts(n);
      });
    }
    Array.prototype.forEach.call(spans, function (s, si) { lastTop = null; spanStart = si > 0; texts(s); });

    /* b · split: words stay whole (.ac-w), letters become .ac-ch with their order in --k. The set
       type's line breaks are locked: a <br class="ac-br"> where each measured line starts, and the
       lines are unbreakable while the h1 writes (kit §13), so the split can only break where the
       set type broke — never at a different hyphen, dash or space. */
    /* one pen (coherence pass): a new set line starts only when the last letter of the line before
       has landed — the order skips ceil(dur / step) − 1 places at each line start (--ac-write-line:
       1, the default; 0 writes the lines back to back, as round 9 first did) */
    var hs0 = getComputedStyle(h), STEP = ms2(hs0, "--ac-write-step", 21), DUR = ms2(hs0, "--ac-write-dur", 240);
    var GAP = ms2(hs0, "--ac-write-line", 1) > 0 ? Math.max(0, Math.ceil(DUR / STEP) - 1) : 0;
    var k = 0, letters = [];
    nodes.forEach(function (t) {
      var frag = document.createDocumentFragment(), i = t.start, word = null;
      Array.from(t.node.data).forEach(function (c) {
        if (/\s/.test(c)) { word = null; frag.appendChild(document.createTextNode(c)); }
        else {
          if (pos[i].brk) { word = null; var br = document.createElement("br"); br.className = "ac-br"; frag.appendChild(br); }
          if (pos[i].line && k > 0) k += GAP;
          if (!word) { word = document.createElement("span"); word.className = "ac-w"; frag.appendChild(word); }
          var s = document.createElement("span"); s.className = "ac-ch"; s.textContent = c;
          s.style.setProperty("--k", k++); word.appendChild(s); letters.push({ el: s, i: i });
        }
        i++;
      });
      t.node.parentNode.replaceChild(frag, t.node);
    });
    if (!letters.length) return;
    h.setAttribute("aria-label", label);
    Array.prototype.forEach.call(spans, function (s) { s.setAttribute("aria-hidden", "true"); });
    h.classList.add("ac-write", "is-writing");

    /* c · hold each letter at its kerned place: an inline-block letter loses its kerning pair,
       so give it back as a margin (read everything first, then write) */
    var zoom = h.getBoundingClientRect().width / (h.offsetWidth || 1) || 1;
    var fix = letters.map(function (L) {
      var a = pos[L.i], b = pos[L.i + 1];
      if (!b || Math.abs(b.top - a.top) > 1 || (b.w === 0 && b.left === 0)) return 0;
      return (b.left - a.left - L.el.getBoundingClientRect().width) / zoom;
    });
    letters.forEach(function (L, j) { if (Math.abs(fix[j]) > 0.01) L.el.style.marginRight = fix[j].toFixed(3) + "px"; });

    /* d · the rest of the head (and its plate) waits for the last letter */
    var hs = getComputedStyle(h);
    var end = ms2(hs, "--ac-write-d0", 120) + (k - 1) * ms2(hs, "--ac-write-step", 21) + ms2(hs, "--ac-write-dur", 240);
    var head = h.parentElement, sec = head && head.parentElement;
    if (head) head.classList.add("is-write");
    if (sec) { sec.classList.add("is-write"); sec.style.setProperty("--ac-write-end", Math.round(end) + "ms"); }

    /* e · when the last letter lands, put the set type back (exactly as authored). If the width
       changes mid-write (a phone turned), the locked lines no longer fit: put it back at once. */
    var last = letters[letters.length - 1].el, vw = window.innerWidth, done = false;
    function putBack() {
      if (done) return; done = true;
      h.removeEventListener("animationend", onEnd); window.removeEventListener("resize", onResize);
      while (h.firstChild) h.removeChild(h.firstChild);
      original.forEach(function (n) { h.appendChild(n); });
      h.classList.remove("is-writing");   /* the lines may wrap again; .ac-write stays (no second rise) */
    }
    function onEnd(e) { if (e.target === last) putBack(); }
    function onResize() { if (window.innerWidth !== vw) putBack(); }
    h.addEventListener("animationend", onEnd);
    window.addEventListener("resize", onResize);
  }
  function ms2(style, name, fallback) { var v = parseFloat(style.getPropertyValue(name)); return isNaN(v) ? fallback : v; }

  /* 4 · leaving: an internal link click turns the page (other sites, new tabs, downloads,
     modified clicks and same-page anchors do not) */
  var leaving = false, leaveSafety = 0;
  function unturn() {   /* the next page never arrived (a 204, a download, a stopped load): lift the shutters off this one */
    leaving = false;
    try { sessionStorage.removeItem("km-turn"); } catch (err) {}
    d.classList.remove("km-ta-leave"); d.classList.add("km-ta-arrive");
    lift(false);
  }
  document.addEventListener("click", function (e) {
    if (!T.motion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-no-turn")) return;
    var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem("km-turn", "1"); } catch (err) {}
    clearTimeout(T.safety); clear();
    d.classList.add("km-ta-leave");
    setTimeout(function () { location.href = url.href; }, LEAVE);
    clearTimeout(leaveSafety);
    leaveSafety = setTimeout(unturn, LEAVE + 2000);   /* cleared on pagehide, when the page really goes */
  });
  window.addEventListener("pagehide", function () { clearTimeout(leaveSafety); });
  /* back/forward from the bfcache: the page comes back covered — lift it as a warm arrival */
  window.addEventListener("pageshow", function (ev) {
    if (!ev.persisted || !d.classList.contains("km-ta-leave")) return;
    leaving = false; clearTimeout(leaveSafety);
    try { sessionStorage.removeItem("km-turn"); } catch (err) {}
    d.classList.remove("km-ta-leave"); d.classList.add("km-ta-arrive");
    requestAnimationFrame(function () { requestAnimationFrame(function () { lift(false); }); });
  });
})();
/* </km:turn-body> */
