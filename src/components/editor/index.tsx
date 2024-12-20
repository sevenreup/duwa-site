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
import {
  DuweWasmEvent,
  DuwaWasmEventDetail,
  DuwaConsoleCommandEventDetail,
} from "@/types/go";
import { DuwaFile } from "@/types";
import { GitReleaseInfo } from "contentlayer/generated";

const duwaTml = import(
  "@/lang/duwa.tmLanguage.json"
) as Promise<LanguageRegistration>;

export default function DuwaEditor({
  sourceFiles,
  release,
}: {
  sourceFiles: DuwaFile[];
  release: GitReleaseInfo;
}) {
  const [selectedFile, setSelectedFile] = useState<DuwaFile | null>(
    sourceFiles.find((file) => file.id === "moni_dziko.duwa") ||
      sourceFiles[0] ||
      null
  );

  const [, loading] = useWasm("/duwa.wasm");
  const [code, setCode] = useState(selectedFile?.content || INITIAL_CODE);
  const [output, setOutput] = useState<DuwaWasmEventDetail[] | null>(null);
  const { resolvedTheme } = useTheme();
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  const appendOutput = (message: DuwaWasmEventDetail) => {
    console.log("Jewff",message);
    setOutput((prev) => [...(prev ?? []), message]);
  };

  const resetConsole = () => {
    console.log("resetting console");
    setOutput([]);
  };

  useEffect(() => {
    window.addEventListener("goConsoleEvent", (e) => {
      const { detail: event } = e as DuweWasmEvent;
      console.log(event);
      if (event.type === "duwaConsoleCommandEvent") {
        const { command } = event.detail as DuwaConsoleCommandEventDetail;
        if (command == "clear") {
          resetConsole();
        }
        return;
      } else if (
        event.type === "duwaLogEvent" ||
        event.type === "duwaRuntimeEvent"
      ) {
        console.log("appending output");
        appendOutput(event.detail as DuwaWasmEventDetail);
      }
    });
  }, []);

  const handleRunCode = () => {
    try {
      resetConsole();
      window.duwaRun(code);
      setIsConsoleCollapsed(false);
    } catch (error) {
      setOutput([
        {
          level: "error",
          message: `Error: ${(error as Error).message}`,
          type: "runtime",
        },
      ]);
      setIsConsoleCollapsed(false);
    }
  };

  const handleReset = () => {
    setCode(selectedFile?.content || INITIAL_CODE);
    resetConsole();
  };

  const onInputEnter = (input: string) => {
    window.duwaConsoleProcessInput(input);
  };

  const onFileSelectionChange = (id: string) => {
    const file = sourceFiles.find((f) => f.id === id);
    if (file) {
      setSelectedFile(file);
      setCode(file.content);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <Header
        loading={loading}
        file={selectedFile?.id}
        files={sourceFiles}
        onFileChange={onFileSelectionChange}
        release={release}
      />
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
              isConsoleCollapsed &&
                "!h-auto absolute bottom-0 left-0 right-0 z-10"
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
              onInputEnter={onInputEnter}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
