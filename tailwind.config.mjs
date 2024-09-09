import colors from "tailwindcss/colors";
import starlightPlugin from "@astrojs/starlight-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,jsx}"],
  theme: {
    extend: {
      colors: {
        // Your preferred accent color. Indigo is closest to Starlight’s defaults.
        accent: colors.rose,
        // Your preferred gray scale. Zinc is closest to Starlight’s defaults.
        gray: colors.zinc,
      },
    },
  },
  plugins: [starlightPlugin()],
};
