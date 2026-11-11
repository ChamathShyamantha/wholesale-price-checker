"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Items", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/shops", label: "Shops", icon: "M3 9l1.5-5h15L21 9M3 9h18M3 9v11h18V9M9 20v-6h6v6" },
  { href: "/add", label: "Add price", icon: "M12 5v14M5 12h14", primary: true },
  { href: "/list", label: "Buy list", icon: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" },
  { href: "/help", label: "Help", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" },
];

export default function BottomNav() {
  const path = usePathname();
  if (path === "/login") return null;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-3xl grid-cols-5">
        {tabs.map((t) => {
          const active = t.href === "/" ? path === "/" || path.startsWith("/products") : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              data-tour={t.href === "/add" ? "nav-add" : t.href === "/help" ? "nav-help" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${active ? "text-accent" : "text-muted"}`}
            >
              <span
                className={`grid h-8 w-11 place-items-center rounded-full ${
                  t.primary ? "bg-accent text-white dark:text-[#0b1f18]" : active ? "bg-accent-soft" : ""
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t.icon} />
                </svg>
              </span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
