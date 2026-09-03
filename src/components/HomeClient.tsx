"use client";

import { useState, useEffect } from "react";
import { Language, getTranslation } from "@/locales/i18n";
import { PROFILE } from "@/config/profile";
import Navbar from "@/components/Navbar";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectShowcase from "@/components/ProjectShowcase";
import EvaluatorDashboard from "@/components/EvaluatorDashboard";

interface HomeClientProps {
  lang: Language;
}

export default function HomeClient({ lang }: HomeClientProps) {
  const [experienceVisible, setExperienceVisible] = useState(false);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [evaluatorVisible, setEvaluatorVisible] = useState(false);

  // Sync preference with localStorage and HTML lang tag
  useEffect(() => {
    try {
      localStorage.setItem("homepage_lang", lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn("Unable to access localStorage or document:", e);
    }
  }, [lang]);

  const t = (key: string) => getTranslation(lang, key);

  // Deterministic Scroll Reveal Animation using React State & Viewport Checking
  useEffect(() => {
    const handleScroll = () => {
      const expEl = document.getElementById("experience-section");
      const projEl = document.getElementById("projects-section");
      const evalEl = document.getElementById("evaluator-section");
      
      const triggerPoint = window.innerHeight * 0.88; // Trigger when top is 12% above viewport bottom
      
      if (expEl) {
        const rect = expEl.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          setExperienceVisible(true);
        }
      }
      
      if (projEl) {
        const rect = projEl.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          setProjectsVisible(true);
        }
      }
      
      if (evalEl) {
        const rect = evalEl.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          setEvaluatorVisible(true);
        }
      }
    };

    // Bind scroll listener
    window.addEventListener("scroll", handleScroll);
    
    // Tiny delay to allow full DOM mount and layout settling before initial viewport check
    const timer = setTimeout(() => {
      handleScroll();
    }, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex-1 w-full bg-primary text-primary relative overflow-x-hidden min-h-screen">
      {/* Sticky Header Navbar */}
      <Navbar currentLang={lang} />

      {/* Hero Presentation Section - Alternating Background Dark Zone */}
      <section
        id="hero"
        className="w-full bg-section-dark pt-32 pb-24 border-b border-white/5 md:pt-44"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center animate-fade-in-up">
          {/* Left Column: Greeting details & Career descriptions */}
          <div className="md:col-span-7 text-left flex flex-col items-start">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6">
              ✨ {t("hero.years")}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              {t("hero.hello")}{" "}
              <span className="text-gradient-purple">{PROFILE.name[lang]}</span>
            </h1>

            <p className="text-lg md:text-xl font-bold text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {PROFILE.title[lang]}
            </p>

            {/* Quick Link Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Email Button */}
              <a
                href={`mailto:${PROFILE.contact.email}`}
                className="premium-btn px-6 py-3 flex items-center gap-2.5 text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{t("hero.cta_email")}</span>
              </a>

              {/* GitHub Button */}
              <a
                href={PROFILE.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 glass-panel hover:bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white font-semibold flex items-center gap-2.5 text-sm md:text-base shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>{t("hero.cta_github")}</span>
              </a>

              {/* Bilibili Button */}
              <a
                href={PROFILE.contact.bilibili}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 glass-panel hover:bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white font-semibold flex items-center gap-2.5 text-sm md:text-base shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
                  <path d="m17 2-3 5" />
                  <path d="m7 2 3 5" />
                  <line x1="8" y1="12" x2="8" y2="12.01" />
                  <line x1="16" y1="12" x2="16" y2="12.01" />
                </svg>
                <span>{t("hero.cta_bilibili")}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Premium photo/avatar frame */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="w-[240px] h-[240px] md:w-[280px] md:h-[280px] flex-shrink-0 relative group">
              {/* Ambient visual glow background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 filter blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Round Avatar Container */}
              <div className="w-full h-full rounded-full overflow-hidden border border-white/10 group-hover:border-indigo-500/35 transition-colors duration-300 relative shadow-2xl bg-slate-900/60">
                <img
                  src="/avatar_luffy.jpg"
                  alt={PROFILE.name[lang]}
                  className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Block below the columns */}
        <div className="max-w-5xl mx-auto px-6 mt-20 animate-fade-in-up">
          <div className="w-full glass-panel p-6 md:p-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent -z-10 rounded-tr-xl" />
            
            <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-gray-100 mb-8 border-b border-white/5 pb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              {t("hero.tech_stack")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Frontend Skills column (Professional Certifications) */}
              <div className="space-y-4">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-indigo-400">
                  {t("hero.skill_certs")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PROFILE.skills.frontend.map((skill) => (
                    <span
                      key={skill.en}
                      className="px-3.5 py-1.5 text-sm font-medium rounded-lg bg-indigo-500/5 text-indigo-300 border border-indigo-500/15"
                    >
                      {skill[lang] || skill.en}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend Skills column (IT Capabilities) */}
              <div className="space-y-4">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-cyan-400">
                  {t("hero.skill_it")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PROFILE.skills.backend.map((skill) => (
                    <span
                      key={skill.en}
                      className="px-3.5 py-1.5 text-sm font-medium rounded-lg bg-cyan-500/5 text-cyan-300 border border-cyan-500/15"
                    >
                      {skill[lang] || skill.en}
                    </span>
                  ))}
                </div>
              </div>

              {/* Language / Tools skills column (Core Domain Expertise) */}
              <div className="space-y-4">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-purple-400">
                  {t("hero.skill_domains")}
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {PROFILE.skills.tools.map((skill) => (
                    <span
                      key={skill.en}
                      className="px-3.5 py-1.5 text-sm font-medium rounded-lg bg-purple-500/5 text-purple-300 border border-purple-500/15"
                    >
                      {skill[lang] || skill.en}
                    </span>
                  ))}
                </div>
                
                {/* Language Proficiency indicator */}
                <div className="pt-2.5 border-t border-white/5">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    {lang === "ja" ? "語学力 (Language Proficiency)" : lang === "zh" ? "语言能力 (Language Proficiency)" : "Language Proficiency"}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {lang === "ja"
                      ? "中国語: ネイティブ (Native) • 英語: ビジネス流暢 (TOEIC 945) • 日本語: ビジネス流暢 (JLPT N1 永住)"
                      : lang === "zh"
                      ? "中文: 母语 (Native) • 英语: 流利 (Fluent, TOEIC 945) • 日语: 流利 (Fluent, JLPT N1 永住)"
                      : "ZH: Native • EN: Business Fluent (TOEIC 945) • JA: Business Fluent (JLPT N1 / Permanent Resident)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Pushed in from Left */}
      <div
        id="experience-section"
        style={{
          opacity: experienceVisible ? 1 : 0,
          transform: experienceVisible ? "translateX(0px)" : "translateX(-120px)",
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity"
        }}
      >
        <ExperienceTimeline currentLang={lang} />
      </div>

      {/* Projects Section - Pushed in from Right */}
      <div
        id="projects-section"
        style={{
          opacity: projectsVisible ? 1 : 0,
          transform: projectsVisible ? "translateX(0px)" : "translateX(120px)",
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity"
        }}
      >
        <ProjectShowcase currentLang={lang} />
      </div>

      {/* LLM Evaluation Section - Pushed in from Left */}
      <div
        id="evaluator-section"
        style={{
          opacity: evaluatorVisible ? 1 : 0,
          transform: evaluatorVisible ? "translateX(0px)" : "translateX(-120px)",
          transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity"
        }}
      >
        <EvaluatorDashboard currentLang={lang} />
      </div>

      {/* Visual Sleek Footer */}
      <footer className="w-full bg-section-dark py-12 border-t border-white/5 px-6 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {PROFILE.name[lang]}. All rights reserved.
          </p>
          <p>
            Powered by Next.js & DeepSeek/GLM. Designed for recruiters and tech leaders.
          </p>
        </div>
      </footer>
    </div>
  );
}
