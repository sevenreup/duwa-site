export const siteConfig = {
  name: "Duwa",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.duwa.cphiri.dev",
  description: "A programming language for Malawians.",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/sevenreup/duwa",
    twitterAt: "@cphiri_dev",
  },
  author: {
    name: "Christopher Phiri",
    url: "https://www.cphiri.dev",
  },
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const codeEditorThemes = ["one-light", "one-dark-pro"];

export const currentEditorTheme = (mode: string | undefined) => {
  return mode === "light" ? "one-light" : "one-dark-pro";
};
