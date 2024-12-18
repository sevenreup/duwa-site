import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Logo } from "./logo";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";
import { ModeSwitcher } from "./mode-switcher";
import { Icons } from "./icons";
import Link from "next/link";
import {  Home } from "lucide-react";

export const SiteHeader = ({
  hasSideNav,
  showLogo = false,
}: {
  hasSideNav: boolean;
  showLogo?: boolean;
}) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky border-grid  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row w-full items-center">
        {hasSideNav && (
          <>
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </>
        )}
        <Link href="/">
          {!showLogo && (
            <>
              <Logo className="size-8 md:hidden" />
              <Home className="h-4 w-4 hidden md:block" />
            </>
          )}
          {showLogo && <Logo className="size-8" />}
        </Link>
        <div className="flex flex-1 items-center gap-2 justify-end">
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
    </header>
  );
};
