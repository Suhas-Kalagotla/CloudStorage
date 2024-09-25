import { useState, useEffect } from "react";

export const EditableField = ({ text, editing = false, onEditingComplete }) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setIsEditing(editing);
    setValue(text);
  }, [editing, text]);

  const handleBlur = () => {
    setIsEditing(false);
    onEditingComplete(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: `${value.length}ch` }}
        />
      ) : (
        <span >{value}</span>
      )}
    </div>
  );
};
