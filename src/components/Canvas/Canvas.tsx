import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import StateNode from "./StateNode";

const nodeTypes = {
  state: StateNode,
};

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Open a modal to set the intent for this connection
      const intent = prompt("Enter intent for this transition:");
      if (!intent) return;

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "default",
            animated: true,
            label: intent,
            data: { intent },
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNewState = () => {
    const newNode: Node = {
      id: `state-${Date.now()}`,
      type: "state",
      position: { x: 100, y: 100 },
      data: {
        label: "New State",
        prompt: "Enter prompt for this state...",
        isInitial: nodes.length === 0, // First node is initial by default
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-screen w-full">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={addNewState}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add State
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
