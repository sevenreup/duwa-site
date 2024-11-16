import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ConsoleProps {
  output: string;
  onRun: () => void;
  onReset: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Console({ output, onRun, onReset, isCollapsed, onToggleCollapse }: ConsoleProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card flex flex-col",
      isCollapsed ? "h-auto" : "h-full"
    )}>
      <Tabs defaultValue="console" className={cn(
        "flex flex-col",
        !isCollapsed && "flex-1"
      )}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
              className={cn('h-8 px-2', 'hover:bg-accent hover:text-accent-foreground')}
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
          <TabsContent value="console" className="flex-1 p-4 overflow-auto">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {output || 'Console output will appear here...'}
            </pre>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}