import { allDocs } from "contentlayer/generated";
import { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = allDocs.map((doc) => ({
    url: absoluteUrl(doc.slug),
    lastModified: new Date(),
  }));
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/playground"),
      lastModified: new Date(),
    },
    ...docs,
  ];
}
