import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  
  return [
    {
      url: "https://www.yakinikudon.top",
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://www.yakinikudon.top/zh",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.yakinikudon.top/en",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.yakinikudon.top/ja",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
