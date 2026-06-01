import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Language } from "@/locales/i18n";
import { PROFILE } from "@/config/profile";
import HomeClient from "@/components/HomeClient";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }, { lang: "ja" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Language;

  if (!["zh", "en", "ja"].includes(lang)) {
    return {};
  }

  const titleMap = {
    zh: "董一舟 | 项目管理与数字化转型（DX）专家 (JGC Global / 日挥全球)",
    en: "Dong Yizhou | Project Management & Digital Transformation (DX) Expert (JGC Global)",
    ja: "董一舟 | プロジェクトマネジメント ＆ デジタルトランスフォーメーション (DX) エキスパート (JGC Global)",
  };

  const descMap = {
    zh: "董一舟 (Dong Yizhou) 的个人网站与简历。深耕重工业项目管理 (PMP) 与数字化转型 (DX/AI)，目前任职于日挥全球 (JGC Global)。包含个人履历、精选开源项目及在线 AI 职位匹配评估器。",
    en: "Dong Yizhou's personal website & professional portfolio. Expert in heavy industrial Project Management (PMP) and Digital Transformation (DX/AI) at JGC Global. Features timeline, open-source projects, and an AI job match evaluator.",
    ja: "日揮グローバル (JGC Global) で活躍するプロマネ ＆ DX/AI実装エキスパート「董一舟」のポートフォリオサイト。PMP・溶接技術者・生成AI活用認定、オープンソース作品集、AI求人マッチング診断を搭載。",
  };

  const keywordsMap = {
    zh: ["董一舟", "Dong Yizhou", "YakinikuDon", "项目管理", "数字化转型", "日挥全球", "JGC Global", "PMP", "RAG AI 落地", "Power Automate RPA", "个人网站", "简历"],
    en: ["Dong Yizhou", "YakinikuDon", "Project Management", "Digital Transformation", "JGC Global", "PMP", "Generative AI", "RAG", "RPA Automation", "Portfolio", "Resume"],
    ja: ["董一舟", "Dong Yizhou", "YakinikuDon", "プロジェクトマネジメント", "デジタルトランスフォーメーション", "日揮グローバル", "JGC Global", "PMP", "生成AI", "RAG", "業務自動化", "ポートフォリオ", "履歴書"],
  };

  return {
    title: titleMap[lang],
    description: descMap[lang],
    keywords: keywordsMap[lang],
    alternates: {
      canonical: `https://www.yakinikudon.top/${lang}`,
      languages: {
        "zh-CN": "https://www.yakinikudon.top/zh",
        "en-US": "https://www.yakinikudon.top/en",
        "ja-JP": "https://www.yakinikudon.top/ja",
        "x-default": "https://www.yakinikudon.top/zh",
      },
    },
    openGraph: {
      title: titleMap[lang],
      description: descMap[lang],
      url: `https://www.yakinikudon.top/${lang}`,
      siteName: "Dongyizhou Portfolio",
      locale: lang === "zh" ? "zh_CN" : lang === "ja" ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: "/avatar_luffy.jpg",
          width: 800,
          height: 800,
          alt: lang === "zh" ? "董一舟 头像" : "Dong Yizhou Profile Picture",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleMap[lang],
      description: descMap[lang],
      images: ["/avatar_luffy.jpg"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Language;

  if (!["zh", "en", "ja"].includes(lang)) {
    notFound();
  }

  // Construct Google Rich Snippet (Schema.org JSON-LD Person)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": PROFILE.name[lang],
    "alternateName": "YakinikuDon",
    "image": "https://www.yakinikudon.top/avatar_luffy.jpg",
    "jobTitle": PROFILE.title[lang],
    "worksFor": {
      "@type": "Organization",
      "name": "JGC Global / 日揮グローバル",
      "url": "https://www.jgc.com/"
    },
    "url": "https://www.yakinikudon.top",
    "email": PROFILE.contact.email,
    "sameAs": [
      PROFILE.contact.github,
      PROFILE.contact.bilibili
    ],
    "description": lang === "zh"
      ? "日挥全球 (JGC Global) 项目管理与数字化转型（DX）专家，PMP® 项目管理认证、溶接管理技術者 1级、G检定生成式 AI 应用认证。"
      : lang === "ja"
      ? "日揮グローバル (JGC Global) プロジェクトマネジメント ＆ DX エキスパート。PMP®、溶接管理技術者1級、G検定資格保有者。"
      : "Project Management & DX Expert at JGC Global. Certified PMP®, Welding Engineering Specialist Grade 1, and Generative AI G-Certificate holder.",
    "knowsAbout": [
      "Project Management (PMP)",
      "Digital Transformation (DX)",
      "Generative AI & RAG Applications",
      "RPA Automation (Power Automate)",
      "Quality Control & Quality Assurance (QC/QA)",
      "Rotating Machinery System Integration",
      "Heavy Equipment Engineering",
      "EPC Contracts & Claim Negotiation"
    ]
  };

  return (
    <>
      {/* Inject JSON-LD Schema.org Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      
      {/* Render Client Components */}
      <HomeClient lang={lang} />
    </>
  );
}
