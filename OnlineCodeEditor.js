import React, { useState } from "react";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here\nconsole.log('Hello, World!');");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("Execution result will appear here");
  const [loading, setLoading] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        language,
        code,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error executing code");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">Online Code Editor</h1>
      <select
        className="p-2 border rounded mb-2"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
      <textarea
        className="w-full h-48 border p-2 rounded"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleRunCode}
        disabled={loading}
      >
        {loading ? "Running..." : "Run Code"}
      </button>
      <div className="w-full mt-4 p-2 border rounded bg-gray-100">
        <strong>Output:</strong>
        <pre className="mt-2">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
