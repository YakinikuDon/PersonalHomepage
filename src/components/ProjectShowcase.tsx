"use client";

import { Language } from "@/locales/i18n";
import { getTranslation } from "@/locales/i18n";
import { PROFILE } from "@/config/profile";

interface ProjectShowcaseProps {
  currentLang: Language;
}

export default function ProjectShowcase({ currentLang }: ProjectShowcaseProps) {
  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <section id="projects" className="w-full bg-section-dark border-t border-white/5" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-6 md:mb-10 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-gradient-purple">{t("projects.title")}</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
          {t("projects.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROFILE.projects.map((proj, idx) => {
          const name = typeof proj.name === "string" ? proj.name : (proj.name[currentLang] || proj.name.en);
          const description = proj.description[currentLang] || proj.description.en;

          return (
            <div
              key={idx}
              className="glass-panel p-6 md:p-8 flex flex-col justify-between group h-full relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Radial background highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* SVG Repo Icon */}
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                      {name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                  {description}
                </p>
              </div>

              <div>
                {/* Tech Tags */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
                    {t("projects.tech_used")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded-md text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 group/link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      {t("projects.github_link")}
                      <span className="inline-block transform group-hover/link:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 group/link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {t("projects.demo_link")}
                      <span className="inline-block transform group-hover/link:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
