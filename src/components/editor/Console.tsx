import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, ChevronDown, ChevronUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { DuwaWasmEventDetail } from "@/types/go";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConsoleProps {
  output: DuwaWasmEventDetail[] | null;
  onRun: () => void;
  onReset: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onInputEnter: (input: string) => void;
}

export function Console({
  output,
  onRun,
  onReset,
  isCollapsed,
  onToggleCollapse,
  onInputEnter,
}: ConsoleProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    scrollArea?.scrollTo(0, scrollArea.scrollHeight);
  }, [output]);

  const handleSend = () => {
    if (!input.trim()) return;

    setHistory((prev) => [...prev, input]);
    onInputEnter(input);
    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

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
          <TabsContent value="console" className="flex-1 min-h-0 flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1">
              {(output ?? []).map((item, index) => {
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
              {output == null && (
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  Console output will appear here...
                </pre>
              )}
            </ScrollArea>
            <div className="border-t p-2 sm:p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your code here..."
                  className="flex-1 bg-background px-3 py-1 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <Button size="sm" onClick={handleSend} className="h-8 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter to execute. Use ↑↓ to navigate history
              </p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
