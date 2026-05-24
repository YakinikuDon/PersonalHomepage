"use client";

import { Language } from "@/locales/i18n";
import { getTranslation } from "@/locales/i18n";

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export default function Navbar({ currentLang, onLangChange }: NavbarProps) {
  const t = (key: string) => getTranslation(currentLang, key);

  const navItems = [
    { label: t("nav.about"), href: "#hero" },
    { label: t("nav.experience"), href: "#experience" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.evaluator"), href: "#evaluator" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto max-w-6xl glass-panel px-6 py-3 flex items-center justify-between">
        {/* Logo / Name */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-gradient-purple bg-gradient-to-r">
            yakinikudon.top
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20">
            {t("hero.years")}
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-250 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-250"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Side: Language Switcher */}
        <div className="flex items-center gap-1.5 p-0.5 bg-black/40 rounded-lg border border-white/5">
          {(["zh", "en", "ja"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLangChange(lang)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                currentLang === lang
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {lang === "zh" ? "简" : lang === "en" ? "EN" : "日"}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
