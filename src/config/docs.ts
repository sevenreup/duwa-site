import { SidebarNavItem } from "@/types/nav";
import { allGitReleaseInfos } from "contentlayer/generated";

export interface DocsConfig {
  currentVersion: string;
  sidebarNav: SidebarNavItem[];
}
export const docsConfig: () => DocsConfig = () => {
  const release = allGitReleaseInfos[0];
  return {
    currentVersion: release.tag_name,
    sidebarNav: [
      {
        title: "Getting Started",
        items: [
          { title: "Introduction", href: "/docs", items: [] },
          {
            title: "Tutorials",
            items: [
              {
                title: "Hello, World!",
                href: "/docs/tutorials/hello-world",
                items: [],
              },
            ],
          },
        ],
      },
      {
        title: "Basics",
        items: [
          {
            title: "Basic syntax",
            href: "/docs/basics/basic-syntax",
            items: [],
          },
          { title: "Types", href: "/docs/basics/types", items: [] },
          { title: "Variables", href: "/docs/basics/variables", items: [] },
          {
            title: "Ndondomeko (Functions)",
            href: "/docs/basics/functions",
            items: [],
          },
          { title: "Imports", href: "/docs/basics/imports", items: [] },
        ],
      },
      {
        title: "Types",
        items: [
          { title: "Nambala (Numbers)", href: "/docs/types/number", items: [] },
          { title: "Mawu (Strings)", href: "/docs/types/strings", items: [] },
          {
            title: "Tsimikizi (Boolean)",
            href: "/docs/types/boolean",
            items: [],
          },
          { title: "Arrays", href: "/docs/types/arrays", items: [] },
          { title: "Classes", href: "/docs/types/classes", items: [] },
          { title: "Mgwirizano (Maps)", href: "/docs/types/maps", items: [] },
        ],
      },
      {
        title: "Standard Library",
        items: [
          {
            title: "Console",
            href: "/docs/standard-library/console",
            items: [],
          },
          { title: "Math", href: "/docs/standard-library/math", items: [] },
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
      {
        title: "▶️ Playground",
        href: "/playground",
        items: [],
      },
    ],
  };
};
