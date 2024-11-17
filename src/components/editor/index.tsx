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

  const appendOutput = (message: string) => {
    setOutput((prev) => prev + message);
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
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  };

  const handleReset = () => {
    setCode(INITIAL_CODE);
    resetConsole();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header loading={loading} />
      <main className="flex-1 container mx-auto p-4">
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[calc(100vh-8rem)]"
        >
          <ResizablePanel defaultSize={70} minSize={30}>
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
                }}
                loading={<div className="p-4">Loading editor...</div>}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={30}
            minSize={isConsoleCollapsed ? 6 : 20}
            className={cn(isConsoleCollapsed && "h-auto")}
          >
            <Console
              output={output}
              onRun={handleRunCode}
              onReset={handleReset}
              isCollapsed={isConsoleCollapsed}
              onToggleCollapse={() =>
                setIsConsoleCollapsed(!isConsoleCollapsed)
              }
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
