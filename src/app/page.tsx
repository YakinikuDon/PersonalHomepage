"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      // 1. Check if the user has a saved language preference in localStorage
      const saved = localStorage.getItem("homepage_lang");
      if (saved && ["zh", "en", "ja"].includes(saved)) {
        router.replace(`/${saved}`);
        return;
      }

      // 2. Fallback to browser language detection
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("ja")) {
        router.replace("/ja");
      } else if (browserLang.startsWith("en")) {
        router.replace("/en");
      } else {
        // Default to Simplified Chinese
        router.replace("/zh");
      }
    } catch (e) {
      // If localStorage is blocked/sandboxed, default to /zh
      router.replace("/zh");
    }
  }, [router]);

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center text-gray-400">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-sm font-semibold tracking-wide text-gray-300">
          Loading portfolio...
        </p>
      </div>
    </div>
  );
}
