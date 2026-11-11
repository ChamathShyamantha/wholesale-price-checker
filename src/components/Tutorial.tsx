"use client";

import Link from "next/link";
import { useState } from "react";
import { TUTORIAL, type Section } from "@/lib/tutorial";
import { setLang as saveLang, useLang, type Lang } from "@/lib/lang";
import { startTour } from "@/lib/tourStore";

function Steps({ section }: { section: Section }) {
  return (
    <ol className="space-y-2.5">
      {section.steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {i + 1}
          </span>
          <span className="leading-relaxed">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Tutorial() {
  const lang = useLang();
  const t = TUTORIAL[lang];
  const [step, setStep] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const total = t.sections.length;

  const langSwitch = (
    <div className="card flex p-1 text-sm font-semibold" role="group" aria-label="Language">
      {(["en", "si"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => saveLang(l)}
          aria-pressed={lang === l}
          className={`rounded-lg px-3 py-1.5 ${lang === l ? "bg-accent text-white dark:text-[#0b1f18]" : "text-muted"}`}
        >
          {l === "en" ? "English" : "සිංහල"}
        </button>
      ))}
    </div>
  );

  // Step-by-step mode: one section per screen.
  if (step !== null) {
    const s = t.sections[step];
    return (
      <div lang={lang}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <button type="button" className="text-sm text-accent" onClick={() => setStep(null)}>
            ← {t.allSections}
          </button>
          {langSwitch}
        </div>
        <p className="text-sm text-muted">{t.stepOf(step + 1, total)}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <section className="card mt-4 p-5">
          <div className="text-4xl" aria-hidden>
            {s.icon}
          </div>
          <h1 className="mt-2 mb-4 text-xl font-bold leading-snug">{s.title}</h1>
          <Steps section={s} />
          {s.link && (
            <Link href={s.link.href} className="btn btn-ghost mt-5 w-full text-sm">
              {s.link.label} →
            </Link>
          )}
        </section>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
            ← {t.back}
          </button>
          {step < total - 1 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
              {t.next} →
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setStep(null)}>
              {t.finish} ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div lang={lang}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
          <p className="mt-1 text-sm text-muted">{t.intro}</p>
        </div>
        <div className="shrink-0">{langSwitch}</div>
      </header>

      <button type="button" className="btn btn-primary w-full text-base" onClick={startTour}>
        ▶ {t.tour}
      </button>
      <p className="mt-1.5 text-center text-xs text-muted">{t.tourHint}</p>
      <button type="button" className="btn btn-ghost mt-3 w-full text-sm" onClick={() => setStep(0)}>
        📖 {t.start}
      </button>
      <p className="mt-2 text-xs text-muted">{t.note}</p>

      <ul className="mt-4 space-y-2">
        {t.sections.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <li key={s.id} className="card overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center gap-3 p-3 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <span className="text-2xl" aria-hidden>
                  {s.icon}
                </span>
                <span className="flex-1 font-semibold">
                  <span className="mr-1 text-muted">{i + 1}.</span>
                  {s.title}
                </span>
                <span className={`text-muted transition-transform ${isOpen ? "rotate-90" : ""}`} aria-hidden>
                  ›
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-line p-4">
                  <Steps section={s} />
                  {s.link && (
                    <Link href={s.link.href} className="btn btn-ghost mt-4 w-full text-sm">
                      {s.link.label} →
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
