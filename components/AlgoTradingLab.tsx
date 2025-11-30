import React, { useState } from 'react';

const exampleCode = `
import React from 'react';

const DynamicComponent = () => {
  return (
    <div className="p-4 border rounded-lg bg-blue-100 text-blue-800">
      <h3 className="font-bold">Hello from the VM!</h3>
      <p>This component was dynamically compiled and rendered in a sandboxed environment.</p>
      <button 
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert('Interaction from VM!')}
      >
        Interact
      </button>
    </div>
  );
};

export default DynamicComponent;
`.trim();

const AIWorkspaceView: React.FC = () => {
  const [code, setCode] = useState<string>(exampleCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleCompileAndRun = () => {
    setIsRunning(true);
    setLogs([]);
    setShowPreview(false);

    const steps = [
      { message: 'Initializing WASM compiler...', delay: 500 },
      { message: 'Compiling React component...', delay: 1000 },
      { message: 'Executing in sandboxed VM...', delay: 1000 },
      { message: 'Applying changes...', delay: 800 },
      { message: '✅ Done.', delay: 500 },
    ];

    let cumulativeDelay = 0;
    steps.forEach((step, index) => {
      cumulativeDelay += step.delay;
      setTimeout(() => {
        setLogs(prevLogs => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${step.message}`]);
        
        if (step.message === 'Applying changes...') {
          setShowPreview(true);
        }
        
        if (index === steps.length - 1) { // Last step
          setIsRunning(false);
        }
      }, cumulativeDelay);
    });
  };

  return (
    <div className="p-4 h-full flex flex-col bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">AI Development Workspace (WASM VM)</h1>
      
      <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
        {/* Left Panel: Code Editor */}
        <div className="w-full md:w-1/2 flex flex-col">
          <label htmlFor="code-editor" className="text-sm font-medium text-gray-600 mb-1">Component Editor</label>
          <textarea
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow p-3 border rounded-md font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck="false"
          />
        </div>

        {/* Right Panel: Preview */}
        <div className="w-full md:w-1/2 flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Live Preview</label>
          <div className="flex-grow p-4 border rounded-md bg-white flex items-center justify-center">
            {showPreview ? (
              <div className="p-4 border rounded-lg bg-blue-100 text-blue-800">
                <h3 className="font-bold">Hello from the VM!</h3>
                <p>This component was dynamically compiled and rendered in a sandboxed environment.</p>
                <button 
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => alert('Interaction from VM!')}
                >
                  Interact
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Preview will appear here.</p>
                <p className="text-sm">Click "Compile & Run" to see the output.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls and Logs */}
      <div className="mt-4 flex-shrink-0">
        <button
          onClick={handleCompileAndRun}
          disabled={isRunning}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? 'Running...' : 'Compile & Run in VM'}
        </button>

        <div className="mt-3 p-3 bg-gray-800 text-white rounded-md h-36 overflow-y-auto font-mono text-xs">
          <div className="flex items-center mb-2">
            <span className="text-gray-400">{'>'} Compilation Logs</span>
            {isRunning && <div className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>}
          </div>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIWorkspaceView;