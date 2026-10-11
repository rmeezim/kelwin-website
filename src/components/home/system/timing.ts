// The opening pass runs on one beat (ms after the drawing starts to play). The markup's entrance
// delays (slab drops, inscriptions, callouts, the dimension) and the script's state changes are both
// written against these constants, so the red, its slab and its open row always move together.
export const T1 = 500; //                       slab 01 drops
export const STEP = 1250; //                    the red's dwell on each layer during the pass
export const dropAt = (n: number) => T1 + (n - 1) * STEP; // 500 / 1750 / 3000
export const CALLOUT_AFTER = 400; //            a slab's callout fades in 400ms after its drop
export const DIM_AT = dropAt(3) + 400; //       3400: the dimension draws as 03 lands ("3 layers")
export const DIM_LABEL_AT = DIM_AT + 300; //    3700: its value fades in
export const CLOSE = T1 + 3 * STEP; //          4250: one beat after 03, the stack closes up (700ms)
export const LOOP = CLOSE + 650; //             4900: the return draws (1000ms); the ring closes 800–1300ms in
export const HOME = LOOP + 850; //              5750: the arrow lands; the red and its row return to 01
export const REST = HOME + 700; //              6450: settled, nothing left to run
