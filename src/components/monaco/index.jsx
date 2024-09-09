import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useMediaQuery } from 'react-responsive';

const MonacoAstroComponent = () => {
  const [code, setCode] = useState('dd');
  const [output, setOutput] = useState('');

  const isDesktop = useMediaQuery({ minWidth: 768 });

  const handleEditorChange = (value) => {
    setCode(value);
    setOutput(eval(value));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">

      <div className="lg:w-1/2 w-full h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200">
        <Editor
          width="100%"
          height="100%"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
        />
      </div>


      <div className="lg:w-1/2 w-full h-1/2 lg:h-full">
        <h2 className="text-lg font-bold mb-2">Output:</h2>
        <div className="p-4 bg-gray-800 text-white rounded-md h-full">
          {output}
        </div>
      </div>
    </div>

  );
};

export default MonacoAstroComponent;