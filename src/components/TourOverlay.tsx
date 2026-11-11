"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { setLang, useLang } from "@/lib/lang";
import { setTourStep, useTourStep } from "@/lib/tourStore";
import { TOUR_STEPS, TOUR_UI } from "@/lib/tourSteps";

type Box = { top: number; left: number; width: number; height: number };
const PAD = 6;
const CARD_H = 230; // rough card height, for deciding above/below

/** Guided tour: opens each screen and spotlights the element the step is about. */
export default function TourOverlay() {
  const stepIndex = useTourStep();
  const lang = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [box, setBox] = useState<{ step: number; rect: Box | null } | null>(null);
  const navigatedFor = useRef<number | null>(null);

  const step = stepIndex != null ? TOUR_STEPS[stepIndex] : null;
  const onPage = !!step && step.match.test(pathname);

  // Go to the step's screen when we're not on it.
  useEffect(() => {
    if (!step || onPage || stepIndex == null) return;
    if (navigatedFor.current === stepIndex) return;
    navigatedFor.current = stepIndex;
    // /tour/* are server redirects (to an example item or shop), so load them as a full page.
    if (step.path.startsWith("/tour/")) window.location.assign(step.path);
    else router.push(step.path);
  }, [step, onPage, stepIndex, router]);

  // Find the element, scroll it into view, then follow its position.
  useEffect(() => {
    if (!step || !onPage || stepIndex == null) return;
    let el: Element | null = null;
    let tries = 0;
    let follow = 0;
    let last = "";
    // Measure with timers and scroll/resize events (not animation frames, which pause in background tabs).
    const measure = () => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const key = `${Math.round(r.top)}|${Math.round(r.left)}|${Math.round(r.width)}|${Math.round(r.height)}`;
      if (key !== last) {
        last = key;
        setBox({ step: stepIndex, rect: { top: r.top, left: r.left, width: r.width, height: r.height } });
      }
    };
    const find = window.setInterval(() => {
      el = document.querySelector(`[data-tour="${step.target}"]`);
      tries++;
      if (el) {
        window.clearInterval(find);
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        measure();
        follow = window.setInterval(measure, 120);
      } else if (tries > 30) {
        // Element not on this page (e.g. empty list): show the card in the middle.
        window.clearInterval(find);
        setBox({ step: stepIndex, rect: null });
      }
    }, 100);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(find);
      window.clearInterval(follow);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [step, onPage, stepIndex]);

  if (stepIndex == null || !step) return null;

  const t = TOUR_UI[lang];
  const text = step[lang];
  const total = TOUR_STEPS.length;
  const ready = onPage && box?.step === stepIndex;
  const rect = ready ? box!.rect : null;

  const go = (i: number | null) => {
    navigatedFor.current = null;
    setTourStep(i);
  };

  // Place the card below the spotlight if there's room, otherwise above; centred when there's no target.
  let cardStyle: React.CSSProperties;
  if (rect) {
    const vh = window.innerHeight;
    const below = vh - (rect.top + rect.height + PAD);
    const above = rect.top - PAD;
    if (below >= CARD_H || below >= above) {
      cardStyle = { top: Math.min(rect.top + rect.height + PAD + 10, vh - CARD_H - 8) };
    } else {
      cardStyle = { bottom: Math.min(vh - rect.top + PAD + 10, vh - CARD_H - 8) };
    }
  } else {
    cardStyle = { top: "50%", transform: "translateY(-50%)" };
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={text.title} lang={lang}>
      {/* Blocks taps on the page while the tour is open. */}
      <div className="absolute inset-0" />
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-xl transition-all duration-300"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.62)",
            outline: "3px solid var(--accent)",
          }}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
      )}

      <div className="absolute inset-x-4 mx-auto max-w-md" style={cardStyle}>
        <div className="card p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted">
              {stepIndex + 1} / {total}
            </span>
            <div className="flex rounded-lg border border-line p-0.5 text-xs font-semibold">
              {(["en", "si"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`rounded-md px-2 py-1 ${lang === l ? "bg-accent text-white dark:text-[#0b1f18]" : "text-muted"}`}
                >
                  {l === "en" ? "EN" : "සිං"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-accent transition-all" style={{ width: `${((stepIndex + 1) / total) * 100}%` }} />
          </div>
          <h2 className="mt-3 text-lg font-bold leading-snug">{text.title}</h2>
          <p className="mt-1 leading-relaxed">{ready ? text.body : t.loading}</p>
          <div className="mt-4 flex items-center gap-2">
            <button type="button" className="mr-auto text-sm text-muted underline" onClick={() => go(null)}>
              {t.skip}
            </button>
            {stepIndex > 0 && (
              <button type="button" className="btn btn-ghost px-3 text-sm" onClick={() => go(stepIndex - 1)}>
                ← {t.back}
              </button>
            )}
            {stepIndex < total - 1 ? (
              <button type="button" className="btn btn-primary px-4 text-sm" onClick={() => go(stepIndex + 1)}>
                {t.next} →
              </button>
            ) : (
              <button type="button" className="btn btn-primary px-4 text-sm" onClick={() => go(null)}>
                {t.finish} ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
