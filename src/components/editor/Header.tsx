import Link from "next/link";
import { Logo } from "../logo";
import { ModeSwitcher } from "../mode-switcher";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import { Icons } from "../icons";
import { Loader2, EllipsisVertical, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DuwaFile } from "@/types";
import { GitReleaseInfo } from "contentlayer/generated";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Mdx } from "../mdx-components";

interface HeaderProps {
  loading: boolean;
  file?: string;
  files: DuwaFile[];
  onFileChange: (file: string) => void;
  release: GitReleaseInfo;
}

export function Header({
  loading,
  files,
  file,
  onFileChange,
  release,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-row items-center justify-between gap-2 md:gap-4 p-4">
          <Link href="/">
            <h1 className="text-2xl font-bold flex flex-row gap-2">
              <Logo className="size-8" />
              <span className="hidden md:block">Playground</span>
            </h1>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={file} onValueChange={onFileChange}>
              <SelectTrigger className="w-[120px] sm:w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {files.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex gap-2">
                ✅ <span className="md:block hidden">{release.tag_name}</span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Icons.gitHub className="h-4 w-4" /> GitHub
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ModeSwitcher hasTitle />
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Info />
                  Info
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>{release.tag_name}</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Version Information</DialogTitle>
            <DialogDescription>
              <Mdx code={release.changelog.code} />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4"></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
