import zh from "./zh.json";
import en from "./en.json";
import ja from "./ja.json";

export type Language = "zh" | "en" | "ja";

export const translations = {
  zh,
  en,
  ja
};

export type TranslationKeys = typeof zh;

// Safe nested key lookup (e.g., t("nav.about"))
export function getTranslation(lang: Language, path: string): string {
  const dict = translations[lang] as any;
  const parts = path.split(".");
  let current = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return path; // Fallback to path name if key not found
    }
  }

  return typeof current === "string" ? current : path;
}
