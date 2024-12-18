import React from "react";
import { allGitReleaseInfos } from "contentlayer/generated";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
export const ReleaseDownloader = ({ platform }: { platform: string }) => {
  const info = allGitReleaseInfos[0];

  if (platform.includes("|")) {
    return (
      <div className="flex flex-row justify-between gap-2 flex-wrap">
        {platform.split("|").map((p) => {
          return (
            <DowloadCard key={p} data={(info as never)[p]} className="flex-1" />
          );
        })}
      </div>
    );
  }
  return <DowloadCard data={(info as never)[platform]} />;
};

const DowloadCard = ({
  data: { browser_download_url, platform, desc, name },
  className,
}: {
  data: {
    browser_download_url: string;
    name: string;
    platform: string;
    desc: string;
  };
  className?: string;
}) => {
  return (
    <a href={browser_download_url} className={cn(className)}>
      <Card>
        <CardHeader className="p-2">
          <CardTitle>{platform}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardFooter className="p-2">
          <a href={browser_download_url} className="underline text-primary flex flex-row gap-2 justify-center items-center">
            <DownloadIcon size={16} /> {name}
          </a>
        </CardFooter>
      </Card>
    </a>
  );
};
