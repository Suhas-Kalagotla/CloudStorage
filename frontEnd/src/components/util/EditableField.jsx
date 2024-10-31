import { useState, useEffect, useRef } from "react";

export const EditableField = ({
  initialValue,
  type,
  onEditingComplete,
  validate,
  isEditing: editingValue = false,
}) => {
  const [isEditing, setIsEditing] = useState(editingValue);
  const [value, setValue] = useState(initialValue);
  const timeOutRef = useRef(null);

  const handleEditingComplete = () => {
    if (validate(value)) onEditingComplete(value);
    else {
      setValue(initialValue);
      onEditingComplete(initialValue);
    }
  };

  const handleBlur = () => {
    if (value.length === 0) {
      setValue(initialValue);
    }
    handleEditingComplete();
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  useEffect(() => {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  return (
    <div>
      {isEditing ? (
        <input
          className="editable-input"
          type={type}
          value={value}
          onChange={(e) => handleChange(e)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ width: `${value.length}ch` }}
        />
      ) : (
        <span
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={() => {
            setIsEditing(true);
          }}
          className="editable-text"
        >
          {value}
        </span>
      )}
    </div>
  );
};
