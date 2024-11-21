import { useState, useEffect } from "react";

export function useWasm(path: string) {
  const [state, setState] = useState<[unknown, boolean, Error | null]>([
    null,
    true,
    null,
  ]);

  async function getWasm(path: string) {
    try {
      const wasm_exec = window?.Go;
      if (wasm_exec) {
        // @ts-expect-error wasm_exec
        const go = new Go(); // Defined in wasm_exec.js
        const WASM_URL = path;

        let wasm;

        if ("instantiateStreaming" in WebAssembly) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          go.importObject.gojs["syscall/js.finalizeRef"] = (_: unknown) => 0;
          const obj = await WebAssembly.instantiateStreaming(
            fetch(WASM_URL),
            go.importObject
          );

          wasm = obj.instance;
          go.run(wasm);

          return wasm.exports;
        } else {
          const resp = await fetch(WASM_URL);
          const bytes = await resp.arrayBuffer();
          const obj = await WebAssembly.instantiate(bytes, go.importObject);

          wasm = obj.instance;
          go.run(wasm);

          return wasm.exports;
        }
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  function initConsole() {
    window.duwaConsoleReady();
  }

  useEffect(() => {
    getWasm(path)
      .then((exp) => {
        setState([exp, false, null]);
        initConsole();
        console.log("wasm initialized");
      })
      .catch((err) => {
        console.error("Failed to load wasm", err);
        setState([null, false, err]);
      });
  }, [path]);

  return state;
}
