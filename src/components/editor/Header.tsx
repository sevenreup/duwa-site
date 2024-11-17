import Link from "next/link";
import { Logo } from "../logo";
import { ModeSwitcher } from "../mode-switcher";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import { Icons } from "../icons";
import { Loader2 } from "lucide-react";

interface HeaderProps {
  loading: boolean;
}

export function Header({ loading }: HeaderProps) {
  return (
    <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold flex flex-row gap-2">
            <Logo className="size-8" />
            <span className="hidden md:block">Playground</span>
          </h1>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <span>✅</span>}
          <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.gitHub className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <ModeSwitcher />
        </div>
      </div>
    </div>
  );
}
