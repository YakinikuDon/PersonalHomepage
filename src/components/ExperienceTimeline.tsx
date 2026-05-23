"use client";

import { Language } from "@/locales/i18n";
import { getTranslation } from "@/locales/i18n";
import { PROFILE } from "@/config/profile";

interface ExperienceTimelineProps {
  currentLang: Language;
}

export default function ExperienceTimeline({ currentLang }: ExperienceTimelineProps) {
  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <section id="experience" className="w-full bg-section-alt border-t border-white/5" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-6 md:mb-10 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-gradient-purple">{t("experience.title")}</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
          {t("experience.subtitle")}
        </p>
      </div>

      <div className="timeline-container relative">
        {PROFILE.experiences.map((exp, idx) => {
          const description = exp.description[currentLang] || exp.description.en;
          const highlights = exp.highlights?.[currentLang] || exp.highlights?.en || [];

          return (
            <div
              key={idx}
              className="timeline-item animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Decorative timeline point */}
              <div className="timeline-dot" />

              {/* Work Card */}
              <div className="glass-panel p-6 md:p-8 hover:transform hover:translate-x-2 transition-all duration-300">
                {/* Meta details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400">
                      {exp.role}
                    </h3>
                    <p className="text-indigo-400 font-semibold text-sm">
                      {exp.company}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-400 max-w-max">
                    {exp.period}
                  </span>
                </div>

                {/* Primary Description */}
                <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                  {description}
                </p>

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                      {t("experience.highlights_title")}
                    </h4>
                    <ul className="space-y-2">
                      {highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-xs md:text-sm text-gray-400 leading-relaxed flex items-start gap-2.5"
                        >
                          <span className="text-indigo-400 font-bold select-none mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
