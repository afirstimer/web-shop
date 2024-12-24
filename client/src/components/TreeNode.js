import React, { useState } from "react";

const TreeNode = ({ node, onNodeSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleSelect = () => {
    onNodeSelect(node);
  };

  return (
    <div style={{ marginLeft: node.level * 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleSelect}
      >
        {node.children && (
          <span onClick={handleExpand} style={{ marginRight: 5 }}>
            {expanded ? "▼" : "▶"}
          </span>
        )}
        <span>{node.label}</span>
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onNodeSelect={onNodeSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
