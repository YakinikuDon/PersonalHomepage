"use client";

import { useState, useEffect } from "react";
import { Language } from "@/locales/i18n";
import { getTranslation } from "@/locales/i18n";

interface EvaluatorDashboardProps {
  currentLang: Language;
}

interface ScoreDetail {
  score: number;
  comment: string;
}

interface EvaluationResult {
  isDemo?: boolean;
  dimensions: {
    salaryMatch: ScoreDetail;
    locationMatch: ScoreDetail;
    skillMatch: ScoreDetail;
    experienceMatch: ScoreDetail;
    industryMatch: ScoreDetail;
    languageMatch: ScoreDetail;
    overallScore: ScoreDetail;
  };
  recommendationLetter: string;
}

export default function EvaluatorDashboard({ currentLang }: EvaluatorDashboardProps) {
  const t = (key: string) => getTranslation(currentLang, key);

  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasEvaluated, setHasEvaluated] = useState(false);

  useEffect(() => {
    if (!hasEvaluated) {
      setResult(getInitialMockData(currentLang));
    }
  }, [currentLang, hasEvaluated]);

  const statusMessages = {
    zh: [
      "正在解析职位描述...",
      "分析技术栈重合度...",
      "核对期望薪资与预算契合度...",
      "计算地理位置与远程协作比例...",
      "深度合成最终诊断报告书..."
    ],
    en: [
      "Parsing job description details...",
      "Analyzing technical stack alignment...",
      "Verifying salary expectations and budget...",
      "Computing location preferences...",
      "Synthesizing customized recruiter report..."
    ],
    ja: [
      "求人票の詳細を解析中...",
      "技術スタックの一致度を分析中...",
      "期待年収と予算の適合性を確認中...",
      "勤務地とリモート希望を計算中...",
      "採用診断レポートを合成中..."
    ]
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) {
      setErrorMsg(t("evaluator.error_empty"));
      return;
    }

    setHasEvaluated(true);
    setErrorMsg("");
    setIsLoading(true);
    setResult(null);

    // Dynamic status text rotation during LLM call
    const messages = statusMessages[currentLang] || statusMessages.en;
    let msgIdx = 0;
    setStatusText(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setStatusText(messages[msgIdx]);
    }, 2000);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdText, lang: currentLang })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to evaluate.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t("evaluator.btn_error"));
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  // Light local markdown renderer to render bold, headers, list elements without loading dependencies
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // H4 Headers
      if (trimmed.startsWith("####")) {
        return (
          <h4 key={idx} className="text-base font-bold text-white mt-4 mb-2">
            {trimmed.replace(/####\s*/, "")}
          </h4>
        );
      }
      // H3 Headers
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={idx} className="text-lg font-bold text-indigo-400 mt-6 mb-3 border-b border-white/5 pb-2">
            {trimmed.replace(/###\s*/, "")}
          </h3>
        );
      }
      // Alert/Quote block
      if (trimmed.startsWith(">")) {
        return (
          <blockquote key={idx} className="my-4 p-4 bg-indigo-500/5 border-l-4 border-indigo-500 rounded-r-lg text-sm text-gray-300 italic leading-relaxed">
            {trimmed.replace(/>\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
          </blockquote>
        );
      }
      // Unordered lists
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        const itemText = trimmed.replace(/^[\*\-]\s*/, "");
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-gray-400 mb-2 leading-relaxed">
            {parseInlineStyles(itemText)}
          </li>
        );
      }
      // Ordered lists
      if (/^\d+\./.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s*/, "");
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-gray-400 mb-2 leading-relaxed">
            {parseInlineStyles(itemText)}
          </li>
        );
      }
      // Plain lines
      return trimmed === "" ? (
        <div key={idx} className="h-2" />
      ) : (
        <p key={idx} className="text-sm md:text-base text-gray-300 leading-relaxed mb-3">
          {parseInlineStyles(trimmed)}
        </p>
      );
    });
  };

  const parseInlineStyles = (text: string) => {
    // Basic regex parser for bold text (**text**)
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-white font-bold">{part}</strong>;
      }
      return part;
    });
  };

  // SVG Radial Circle calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <section id="evaluator" className="w-full bg-section-alt border-t border-white/5" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-6 md:mb-10 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-gradient-purple">{t("evaluator.title")}</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          {t("evaluator.subtitle")}
        </p>
      </div>

      {/* Recruiter Input Form */}
      <div className="glass-panel p-6 md:p-8 mb-12 relative overflow-hidden">
        <form onSubmit={handleEvaluate} className="flex flex-col gap-6">
          <div className="relative">
            <textarea
              className="w-full glass-input p-4 text-sm md:text-base min-h-[160px] block"
              placeholder={t("evaluator.placeholder")}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              maxLength={4000}
              disabled={isLoading}
            />
            {/* Visual counter */}
            <span className="absolute bottom-3 right-4 text-xs font-semibold text-gray-500">
              {jdText.length} / 4000
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {errorMsg && (
              <span className="text-sm font-semibold text-pink-500 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-lg">
                {errorMsg}
              </span>
            )}
            <div className="flex-grow" />
            <button
              type="submit"
              disabled={isLoading}
              className="premium-btn w-full md:w-auto px-8 py-3.5 flex items-center justify-center gap-3 select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t("evaluator.btn_loading")}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                  <span>{t("evaluator.btn_idle")}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Fancy micro status loader */}
        {isLoading && (
          <div className="mt-6 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3.5 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
            <span className="text-xs md:text-sm font-medium text-indigo-300">
              {statusText}
            </span>
          </div>
        )}
      </div>

      {/* Matching Evaluation Dashboard */}
      {result && (
        <div className="space-y-12 animate-fade-in-up">
          {/* Demo Warning Banner */}
          {result.isDemo && (
            <div className="glass-panel p-4 border-yellow-500/20 bg-yellow-500/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold text-yellow-500">
                  {t("evaluator.warning_demo")}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Configure your private key inside `.env.local` to trigger live endpoints.
                </p>
              </div>
            </div>
          )}

          {/* Main Visual: Score Dial, Hexagon Radar, and Diagnostic Report */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Large Radial Score Dial Card */}
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
                {t("evaluator.overall_score")}
              </h3>
              
              <div className="score-ring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  {/* Background Track */}
                  <circle cx="60" cy="60" r={radius} className="ring-bg" />
                  {/* Progress Indicator */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="ring-fg"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (result.dimensions.overallScore.score / 100) * circumference
                    }
                  />
                </svg>
                {/* Center score readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {result.dimensions.overallScore.score}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">/ 100</span>
                </div>
              </div>

              <p className="text-xs text-indigo-300 font-medium max-w-[200px] mt-6 leading-relaxed">
                {result.dimensions.overallScore.comment}
              </p>
            </div>

            {/* 2. Stunning Centered SVG Hexagon Radar Chart Card */}
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                {t("evaluator.breakdown")}
              </h3>

              {(() => {
                const cx = 150;
                const cy = 155;
                const R = 90;
                const DIMENSION_KEYS = [
                  "salaryMatch",
                  "locationMatch",
                  "skillMatch",
                  "experienceMatch",
                  "industryMatch",
                  "languageMatch"
                ] as const;

                const radarPoints = DIMENSION_KEYS.map((key, i) => {
                  const score = result.dimensions[key]?.score || 0;
                  const angle = -Math.PI / 2 + i * Math.PI / 3;
                  const r = R * (score / 100);
                  const x = cx + r * Math.cos(angle);
                  const y = cy + r * Math.sin(angle);
                  const label = t(`evaluator.labels.${key}`);
                  return { x, y, score, label, angle };
                });

                const radarPointsString = radarPoints.map(p => `${p.x},${p.y}`).join(" ");
                const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

                return (
                  <svg viewBox="0 0 300 290" className="w-full max-w-[260px] h-auto mx-auto select-none">
                    <defs>
                      <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" />
                      </linearGradient>
                      <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Concentric grid rings (hexagons) */}
                    {levels.map((level, levelIdx) => {
                      const pts = DIMENSION_KEYS.map((_, i) => {
                        const angle = -Math.PI / 2 + i * Math.PI / 3;
                        const r = R * level;
                        const x = cx + r * Math.cos(angle);
                        const y = cy + r * Math.sin(angle);
                        return `${x},${y}`;
                      }).join(" ");
                      return (
                        <polygon
                          key={levelIdx}
                          points={pts}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Radial axis lines */}
                    {DIMENSION_KEYS.map((_, i) => {
                      const angle = -Math.PI / 2 + i * Math.PI / 3;
                      const x = cx + R * Math.cos(angle);
                      const y = cy + R * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={cx}
                          y1={cy}
                          x2={x}
                          y2={y}
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="1"
                          strokeDasharray="2,3"
                        />
                      );
                    })}

                    {/* Filled radar score polygon */}
                    <polygon
                      points={radarPointsString}
                      fill="url(#radarGradient)"
                      stroke="var(--accent-cyan)"
                      strokeWidth="2"
                      filter="url(#radarGlow)"
                    />

                    {/* Glowing dots at vertex points */}
                    {radarPoints.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="var(--text-primary)"
                        stroke="var(--accent-cyan)"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Grid labels */}
                    {radarPoints.map((p, i) => {
                      const offsetR = R + 18;
                      const tx = cx + offsetR * Math.cos(p.angle);
                      let ty = cy + offsetR * Math.sin(p.angle);
                      
                      // Fine-tune alignments
                      if (i === 0) ty -= 4;
                      if (i === 3) ty += 8;

                      let textAnchor: "middle" | "start" | "end" = "middle";
                      const cos = Math.cos(p.angle);
                      if (cos > 0.1) textAnchor = "start";
                      else if (cos < -0.1) textAnchor = "end";

                      return (
                        <text
                          key={i}
                          x={tx}
                          y={ty}
                          fill="var(--text-secondary)"
                          fontSize="9"
                          fontWeight="600"
                          textAnchor={textAnchor}
                          className="fill-gray-400 font-semibold"
                        >
                          {p.label}
                        </text>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* 3. AI Diagnostics Report Letter Container */}
            <div className="glass-panel p-6 md:p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {t("evaluator.report_title")}
              </h3>
              <div className="prose max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {renderMarkdown(result.recommendationLetter)}
              </div>
            </div>
          </div>

          {/* 4. Detailed 6-Dimensional Breakdown Comments Grid - Below the hexagon chart */}
          <div className="glass-panel p-6 md:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-8 border-b border-white/5 pb-4">
              {t("evaluator.breakdown")}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(result.dimensions).map(([key, data]) => {
                if (key === "overallScore") return null; // Display overall score on top
                const scoreData = data as ScoreDetail;
                const label = t(`evaluator.labels.${key}`);

                return (
                  <div
                    key={key}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between hover:border-indigo-500/25 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      {/* Name & score */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-200">{label}</span>
                        <span className="font-extrabold text-sm text-cyan-400">{scoreData.score}%</span>
                      </div>
                      
                      {/* Sub progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                          style={{ width: `${scoreData.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Detailed Scoring comment / rationale below */}
                    <p className="text-xs text-gray-400 leading-relaxed mt-4">
                      {scoreData.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}

function getInitialMockData(lang: Language): EvaluationResult {
  const isZh = lang === "zh";
  const isJa = lang === "ja";

  return {
    isDemo: true,
    dimensions: {
      salaryMatch: {
        score: 90,
        comment: isZh
          ? "职位对应的行业基准薪资预算与候选人的期待年薪（1200万 - 1500万 JPY）高度契合。"
          : isJa
          ? "求人票に準拠する業界標準給与予算と候補者の希望年収（1200万-1500万円）は高度に合致しています。"
          : "The estimated industry standard budget for this role highly matches the candidate's expected range (12M - 15M JPY)."
      },
      locationMatch: {
        score: 98,
        comment: isZh
          ? "该职位支持日本地区混合模式或海外工程现场驻场，完美适配候选人的期望地点。"
          : isJa
          ? "日本国内のハイブリッド勤務または海外プラント現場駐在に対応しており、候補者の希望地域に完全に適合しています。"
          : "Matches the candidate's preferred location parameters flawlessly (Japan Hybrid / Global Site Dispatch)."
      },
      skillMatch: {
        score: 96,
        comment: isZh
          ? "专业技术极度契合：持有 PMP®、焊接管理技术者 1 级、非破坏性探伤 (PT/MT/RT L2) 等资质，且兼备卓越的 Python/RPA 自动化开发与 DX 落地力。"
          : isJa
          ? "保有資格・技術が極めて親和：PMP®、溶接管理技術者1級、非破壊試験技術者(PT/MT/RT L2)の資格に加え、Python/RPAによる実務自動化とDX推進力を完備。"
          : "Excellent match: Holds PMP®, Welding Grade 1, NDT Level 2 certifications, backed by strong Python/RPA automation and industrial DX execution skills."
      },
      experienceMatch: {
        score: 95,
        comment: isZh
          ? "候选人拥有 13 年以上的全球大型工程 (EPC) 与制造业品质与项目管理阅历，完美满足资深项目工程师/品质管理岗位的资历。"
          : isJa
          ? "候補者は13年以上のグローバル超大型プラント建設（EPC）および製造業における品質・プロジェクト管理の豊富な経験を有し、シニアとしての資力を十分に満たしています。"
          : "Offers 13+ years of global EPC project engineering and quality management experience, highly suited for senior/lead engineering roles."
      },
      industryMatch: {
        score: 92,
        comment: isZh
          ? "在大型流体机械、全球油气化工 EPC 建设工程及数字化转型（DX）等重工业赛道积累深厚，行业匹配度极佳。"
          : isJa
          ? "大型回転機械、グローバル石油ガス超大型EPCプラント、および現場DX推進の分野で深い実積があり、業界適合性が極めて高いです。"
          : "Robust domain knowledge in Heavy Machinery, Petrochemical, large-scale EPC Plant Engineering, and industrial digital transformation."
      },
      languageMatch: {
        score: 98,
        comment: isZh
          ? "中文为母语，英语具备无障碍商务沟通及书写能力 (TOEIC 945)，日语商务流利 (JLPT N1 永住)，非常适合多国籍全球协作团队。"
          : isJa
          ? "中国語（ネイティブ）、英語（ビジネスレベル・TOEIC 945）、日本語（ビジネス流暢・JLPT N1）、多国籍なグローバルチームに最適です。"
          : "Native Chinese, fluent business English (TOEIC 945), and business fluent Japanese (JLPT N1 / Permanent Resident). Ready for global multi-national teamwork."
      },
      overallScore: {
        score: 95,
        comment: isZh
          ? "综合匹配度达 95%。候选人在工程项目管理、国际标准品质控制（QC/QA）以及 IT/DX 落地方面的综合实力极具推荐价值！"
          : isJa
          ? "総合適合率は95%です。プロジェクトエンジニアリング、品質管理（QC/QA）、および現場IT/DX推進における実力は強く推奨されます！"
          : "Overall match rate at 95%. Strongly recommended for senior Project Engineering, Quality Control (QC/QA), and Industrial IT/DX roles."
      }
    },
    recommendationLetter: isZh
      ? `### 🌟 董一舟 的综合推荐诊断书

> **💡 提示**：请在下方输入框中粘贴您感兴趣的职位描述 (JD)，AI 将实时评估您的匹配度并给出专业诊断报告。

#### ✅ 核心匹配优势
1. **多重硬核专业资格**：持有 **PMP® 项目管理认证**、**焊接管理技术者 1 级**及 **JSNDI 非破坏性检测 (PT, MT, RT) 二级认证**，符合严苛的特种设备与重工业合规标准。
2. **卓越的 IT / DX 转型落地力**：在 JGC 质量控制部门主导 DX 路线图与生成式 AI PoC，利用 Python 与 Power Automate RPA 累计消减 4,000 工时，是一位懂技术、懂业务的稀缺复合型人才。
3. **13年全球化项目实战**：历经荏原エリオット、日挥グローバル等国际巨头项目，有印尼（Tangguh UCC）、沙特等海外驻场实操及约 30 亿日元索赔挽回经历，抗压与跨文化沟通能力顶级。

#### ⚠️ 推荐跟进
* **工作地点与海外派遣**：候选人目前居住于日本神奈川，支持川崎/横滨/东京办公、海外工程现场长期驻场，以及灵活的国际混合出差机制。`      : isJa
      ? `### 🌟 董一舟 の総合推薦診断書

> **💡 ヒント**：下の入力ボックスに興味のある職務記述書 (JD) を貼り付けてください。AI がリアルタイムで適合度を評価し、専門的な診断レポートを提供します。

#### ✅ 主なマッチング強み
1. **日米欧国際規格の強力な資格群**：**PMP®**、**溶接管理技術者1級**、**JSNDI 非破壊試験技術者 Level 2 (PT, MT, RT)**をすべて保有。高度なプラント設計・製造・検査基準に完全合致。
2. **圧倒的な IT・DX 実装スキル**：日揮QC部門にてDXロードマップの策定、生成AI(RAG)やRPA(Power Automate)導入を主導。自らプロトタイプを開発し約4,000工数を削減した実績。
3. **13年以上の海外EPCプロジェクト実績**：荏原エリオット、日揮グローバルにて恒力石化エチレン、Tangguh UCC（インドネシア駐在）、Zulufなど巨大プロジェクトに従事。約30億円規模の索賠クレーム回復実績。

#### ⚠️ 追加の確認事項
* **勤務地・海外駐在**：現在は神奈川県（永住者）在住であり、川崎/横浜/東京、またはグローバル海外プラント（中東・東南アジアなど）の駐在やハイブリッド契約に対応可能です。`
      : `### 🌟 Dong Yizhou's Comprehensive Evaluation Report

> **💡 Tip**: Please paste a Job Description (JD) you are interested in below. The AI will evaluate your match rate in real-time and provide a professional diagnosis report.

#### ✅ Core Strengths
1. **Rigorous Professional Credentials**: Holds **PMP®**, **Welding Engineer Grade 1**, and **JSNDI Non-Destructive Testing (PT, MT, RT) Level 2** certifications, matching strict industrial compliance parameters.
2. **IT & Industrial DX Execution**: Formulated DX roadmaps, executed Generative AI (RAG) PoCs, and deployed Power Automate RPA to save 4,000 man-hours.
3. **13+ Years Global EPC Footprint**: Proven track record at Ebara/Elliott and JGC Global, including Indonesia site assignments (Tangguh UCC) and major claim recoveries (reclaiming ~30 Billion JPY from Aramco).

#### ⚠️ Next Steps for Recruiters
* **Deployment/Location**: Verify site/office assignment parameters. The candidate is based in Kanagawa, Japan (Permanent Resident) and is open to local Kanagawa/Tokyo assignments or global site dispatching (e.g. Middle East, Southeast Asia).`
  };
}
