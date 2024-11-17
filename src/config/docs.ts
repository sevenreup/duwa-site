import { SidebarNavItem } from "@/types/nav";

export interface DocsConfig {
  currentVersion: string;
  sidebarNav: SidebarNavItem[];
}
export const docsConfig: DocsConfig = {
  currentVersion: "0.0.5",
  sidebarNav: [
    {
      title: "Getting Started",
      items: [{ title: "Introduction", href: "/docs", items: [] }],
    },
    {
      title: "Basics",
      items: [
        { title: "Basic syntax", href: "/docs/basics/basic-syntax", items: [] },
        { title: "Classes", href: "/docs/basics/classes", items: [] },
        { title: "Functions", href: "/docs/basics/functions", items: [] },
        { title: "Imports", href: "/docs/basics/imports", items: [] },
      ],
    },
    {
      title: "Standard Library",
      items: [
        { title: "Console", href: "/docs/standard-library/console", items: [] },
      ],
    },
    {
      title: "Language Reference",
      items: [
        {
          title: "Built-in functions",
          href: "/docs/language-reference/builtins",
          items: [],
        },
        {
          title: "Keywords",
          href: "/docs/language-reference/keywords",
          items: [],
        },
      ],
    },
  ],
};
