import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";

function StateNode({ data, isConnectable }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [stateName, setStateName] = useState(data.label || "New State");
  const [statePrompt, setStatePrompt] = useState(data.prompt || "");

  const handleSave = () => {
    data.label = stateName;
    data.prompt = statePrompt;
    setIsEditing(false);
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md w-64 ${
        data.isInitial ? "bg-green-100" : "bg-white"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="border p-1 rounded text-gray-100 dark:text-gray-900"
          />
          <textarea
            value={statePrompt}
            onChange={(e) => setStatePrompt(e.target.value)}
            className="border p-1 rounded h-24 text-gray-100 dark:text-gray-900"
            placeholder="Enter prompt for this state..."
          />
          <div className="flex justify-between mt-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-2 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          <div className="font-bold mb-2 text-gray-100 dark:text-gray-900">{data.label}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {data.prompt || "No prompt set"}
          </div>
          {data.isInitial && (
            <div className="mt-2 text-xs bg-blue-600 dark:bg-blue-800 text-white dark:text-white rounded inline-block px-2 py-1">
              Initial State
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default memo(StateNode);
