import React, { useState } from "react";
import TreeNode from "./TreeNode";

const TreeSelect = ({ treeData }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNodeSelect = (node) => {
    setSelectedValue(node.label);
    setIsDropdownOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "5px",
          cursor: "pointer",
        }}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {selectedValue || "Select an option"}
      </div>
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {treeData.map((node) => (
            <TreeNode key={node.id} node={node} onNodeSelect={handleNodeSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeSelect;
