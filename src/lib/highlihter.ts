import { codeEditorThemes } from "@/config/site";
import { createHighlighter, LanguageRegistration } from "shiki";

export const codeHighlighter = async (duwa: LanguageRegistration) => {
  return await createHighlighter({
    langs: [duwa],
    themes: codeEditorThemes,
  });
};
