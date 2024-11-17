"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { INITIAL_CODE } from "./constants";
import { Header } from "./Header";
import { Console } from "./Console";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { cn } from "@/lib/utils";
import { useWasm } from "@/hooks/use-wasm";
import { useTheme } from "next-themes";
import { codeHighlighter } from "@/lib/highlihter";
import { shikiToMonaco, textmateThemeToMonacoTheme } from "@shikijs/monaco";
import { LanguageRegistration } from "shiki";
import { codeEditorThemes, currentEditorTheme } from "@/config/site";

const duwaTml = import(
  "@/lang/duwa.tmLanguage.json"
) as Promise<LanguageRegistration>;

export default function DuwaEditor() {
  const [, loading] = useWasm("/duwa.wasm");
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState("");
  const { resolvedTheme } = useTheme();
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState<number | null>(null);

  const appendOutput = (message: string) => {
    setOutput((prev) => prev + message);
    setScrollToBottom(Date.now());
  };

  const resetConsole = () => {
    setOutput("");
  };

  useEffect(() => {
    window.addEventListener("goConsoleEvent", (e) => {
      const event = e as CustomEvent;
      console.log(event);
      appendOutput(event.detail.message);
    });
  }, []);

  const handleRunCode = () => {
    try {
      resetConsole();
      window.runDuwa(code);
      setIsConsoleCollapsed(false);
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
      setIsConsoleCollapsed(false);
    }
  };

  const handleReset = () => {
    setCode(INITIAL_CODE);
    resetConsole();
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <Header loading={loading} />
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-0 h-full relative"
        >
          <ResizablePanel
            defaultSize={70}
            minSize={30}
            className={cn(isConsoleCollapsed && "flex-1")}
          >
            <div className="h-full rounded-lg border bg-card overflow-hidden">
              <Editor
                height="100%"
                theme={currentEditorTheme(resolvedTheme)}
                value={code}
                onChange={(value) => setCode(value || "")}
                language="duwa"
                beforeMount={(monaco) => {
                  monaco.languages.register({ id: "duwa" });
                  (async () => {
                    const lighter = await codeHighlighter(await duwaTml);
                    codeEditorThemes.forEach((theme) => {
                      textmateThemeToMonacoTheme(lighter.getTheme(theme));
                    });
                    shikiToMonaco(lighter, monaco);
                    monaco.editor.setTheme(currentEditorTheme(resolvedTheme));
                  })();
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  wordWrap: "on",
                  scrollbar: {
                    vertical: "visible",
                    horizontal: "visible",
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                }}
                loading={<div className="p-4">Loading editor...</div>}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className={cn(!isConsoleCollapsed && "visible", "invisible")}
          />
          <ResizablePanel 
            defaultSize={30} 
            minSize={5}
            className={cn(
              "transition-all duration-300",
              isConsoleCollapsed && "!h-auto absolute bottom-0 left-0 right-0 z-10"
            )}
          >
            <Console
              output={output}
              onRun={handleRunCode}
              onReset={handleReset}
              isCollapsed={isConsoleCollapsed}
              onToggleCollapse={() =>
                setIsConsoleCollapsed(!isConsoleCollapsed)
              }
              scrollTrigger={scrollToBottom}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
