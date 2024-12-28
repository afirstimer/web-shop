import React, { useState } from "react";
import TreeNode from "./TreeNode";

const TreeSelect = ({ treeData, onCategorySelect }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNodeSelect = (node) => {
    // Chỉ xử lý khi node là con cuối cùng
    if (!node.children || node.children.length === 0) {
      setSelectedValue(node.label);
      setIsDropdownOpen(false);

      // Gọi callback với categoryId
      if (onCategorySelect) {
        onCategorySelect(node.tiktokId);
      }
    }
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
