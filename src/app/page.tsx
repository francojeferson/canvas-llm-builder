"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ReactFlowProvider } from "reactflow";

// Import dynamically to avoid SSR issues with ReactFlow
const Canvas = dynamic(() => import("@/components/Canvas/Canvas"), {
  ssr: false,
});

export default function Home() {
  const [agentName, setAgentName] = useState("My Agent");
  const [globalPrompt, setGlobalPrompt] = useState("");

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-slate-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Canvas LLM Builder</h1>
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save Agent
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Test Agent
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        <div className="w-full md:w-80 bg-slate-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Agent Configuration</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Global Prompt
            </label>
            <textarea
              value={globalPrompt}
              onChange={(e) => setGlobalPrompt(e.target.value)}
              className="w-full p-2 border rounded h-40"
              placeholder="Enter global instructions for your agent..."
            ></textarea>
          </div>
        </div>

        <div className="flex-1 relative">
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </div>
      </div>
    </main>
  );
}
