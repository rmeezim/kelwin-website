// The behaviour registry: Slot looks a section's behaviour up here by name, so server-rendered
// sections can name their behaviour without passing a function across the client boundary.
import type { Behavior } from "./types";
import { init as hero } from "./hero/behavior";
import { init as reframe } from "./reframe/behavior";
import { init as evidence } from "./evidence/behavior";
import { init as letter } from "./letter/behavior";
import { init as system } from "./system/behavior";
import { init as principle } from "./principle/behavior";
import { init as handover } from "./handover/behavior";
import { init as method } from "./method/behavior";
import { init as fit } from "./fit/behavior";
import { init as cta } from "./cta/behavior";
import { init as footer } from "@/components/layout/footer-behavior";
import { init as faq } from "@/components/audit/faq/behavior";

export const behaviors = { hero, reframe, evidence, letter, system, principle, handover, method, fit, cta, footer, faq } satisfies Record<string, Behavior>;

export type BehaviorName = keyof typeof behaviors;
