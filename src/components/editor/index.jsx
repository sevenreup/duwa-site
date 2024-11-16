import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '../ui/button';

import "./wasm_exec";

const WASM_PATH = '/duwa.wasm';

let wasmModule = null;
const go = new window.Go();
let wasmInstance = null;

const MonacoAstroComponent = () => {
  const [code, setCode] = useState('lemba("Hello world");');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);

  const loadWasm = async () => {
    try {
      setLoading(true); // Set loading to true while the Wasm is loading

      if ('instantiateStreaming' in WebAssembly) {
        go.importObject.gojs["syscall/js.finalizeRef"] = _ => 0
        wasmInstance = await WebAssembly.instantiateStreaming(fetch(WASM_PATH), go.importObject)
      } else {
        wasmModule = await fetch(WASM_PATH).then((res) => res.arrayBuffer());
        wasmInstance = await WebAssembly.instantiate(wasmModule, go.importObject);
      }

      window.addEventListener("goConsoleEvent", (event) => {
        console.log(event.detail);
        console[event.detail.level](event.detail.message);
        setOutput(event.detail.message);
      });

      // Initialize the WebAssembly instance
      go.run(wasmInstance.instance);
    } catch (error) {
      console.error('Error loading WebAssembly:', error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const runWasm = () => {
    const result = window.runDuwa(code);
    console.log(result);
    // setOutput(JSON.stringify(result));
  }

  useEffect(() => {
    loadWasm();
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">

      <div className="lg:w-1/2 w-full h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200">
        <Editor
          width="100%"
          height="100%"
          theme="vs-dark"
          className=''
          defaultLanguage="duwa"
          value={code}
          onChange={handleEditorChange}
        />
      </div>


      <div className="lg:w-1/2 w-full h-1/2 lg:h-full">
        <div className='p-4 flex flex-row w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
          <div className='flex flex-row gap-4 items-center justify-start'>
            <Button className='' onClick={runWasm}>Run</Button>
            <h2 className="text-lg font-bold mb-2">Output:</h2>
          </div>
          <div className='flex-1 flex flex-row items-center justify-end'>
            {loading ? (
              <div>Loading WebAssembly...</div> // Display loading message
            ) : (
              <p>WASM loaded successfully!</p>
            )}
          </div>
        </div>
        <div className="p-4 bg-muted text-muted-foreground rounded-md h-full">
          {output}
        </div>
      </div>
    </div>

  );
};

export default MonacoAstroComponent;