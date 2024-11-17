import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Duwa",
      social: {
        github: "https://github.com/sevenreup/duwa",
      },
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://www.googletagmanager.com/gtag/js?id=G-0XTTL1VNER",
          },
        },
        {
          tag: "script",
          attrs: {
            defer: true,
          },
          content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0XTTL1VNER');
          `,
        },
      ],
      sidebar: [
        {
          label: "Introduction",
          autogenerate: {
            directory: "introduction",
          },
        },
        {
          label: "Playground",
          link: "/playground",
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
    react(),
  ],
  output: "static",
  adapter: vercel(),
});
