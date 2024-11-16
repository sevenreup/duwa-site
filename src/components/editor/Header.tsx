import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, THEMES } from "./constants";

interface HeaderProps {
  loading: boolean;
  language: string;
  theme: string;
  onLanguageChange: (value: string) => void;
  onThemeChange: (value: string) => void;
}

export function Header({
  language,
  loading,
  theme,
  onLanguageChange,
  onThemeChange,
}: HeaderProps) {
  return (
    <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <h1 className="text-2xl font-bold">Duwa🌸 Playground</h1>
        <div className="flex flex-wrap items-center gap-2">
          {loading ? (
            <div>Loading WebAssembly...</div> // Display loading message
          ) : (
            <p>WASM loaded successfully!</p>
          )}
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
