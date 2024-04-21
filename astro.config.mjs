import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/static";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Chewa",
      social: {
        github: "https://github.com/sevenreup/chewa",
      },
      sidebar: [
        {
          label: "Introduction",
          autogenerate: {
            directory: "introduction",
          },
        },
        {
          label: "Basics",
          autogenerate: {
            directory: "basics",
          },
        },
        {
          label: "Standard library",
          autogenerate: {
            directory: "standard-library",
          },
        },
        {
          label: "Language Reference",
          autogenerate: {
            directory: "language-reference",
          },
        },
      ],
      customCss: ["./src/tailwind.css"],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "static",
  adapter: vercel(),
});
