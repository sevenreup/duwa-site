import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useRef } from "react";
import { DuweWasmEventDetail } from "@/types/go";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConsoleProps {
  output: DuweWasmEventDetail[];
  onRun: () => void;
  onReset: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Console({
  output,
  onRun,
  onReset,
  isCollapsed,
  onToggleCollapse,
}: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollArea = consoleRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    scrollArea?.scrollTo(0, scrollArea.scrollHeight);
  }, [output]);

  return (
    <div
      className={cn(
        "rounded-lg border bg-card flex flex-col max-h-[50vh]",
        isCollapsed ? "h-auto shadow-lg" : "h-full"
      )}
    >
      <Tabs
        defaultValue="console"
        className={cn("flex flex-col", !isCollapsed && "h-full")}
      >
        <div
          className={cn(
            "flex items-center justify-between px-2 sm:px-4 py-2 border-b",
            isCollapsed && "border-t border-b-0"
          )}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <TabsList>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className={cn(
                "h-8 px-2",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button size="sm" onClick={onRun} className="h-8 px-2">
              <Play className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Run</span>
            </Button>
          </div>
        </div>
        {!isCollapsed && (
          <TabsContent value="console" className="flex-1 min-h-0">
            <ScrollArea className="h-full p-2" ref={consoleRef}>
              {output.map((item, index) => {
                if (item.type === "parser" || item.type === "compiler") {
                  return (
                    <Alert variant="destructive" key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Compile Error</AlertTitle>
                      <AlertDescription>{item.message}</AlertDescription>
                    </Alert>
                  );
                }
                return (
                  <pre
                    key={index}
                    className={cn(
                      "font-mono text-sm whitespace-pre-wrap",
                      item.level === "error" && "text-red-500"
                    )}
                  >
                    {item.message}
                  </pre>
                );
              })}
              {output.length <= 0 && (
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  Console output will appear here...
                </pre>
              )}
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
