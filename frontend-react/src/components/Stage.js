import React, { useState } from 'react';
import './Stage.css';

function Stage({ stageContent, stageName, onSave, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(stageContent);
  const [name, setName] = useState(stageName);

  const handleSave = () => {
    onSave(name, content);
    setIsEditing(false);
  };

  return (
    <div className="stage">
      {isEditing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Stage Name"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter az CLI command..."
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={onRemove}>Remove</button>
        </>
      ) : (
        <>
          <h2 onClick={() => setIsEditing(true)}>{name}</h2>
          <pre>{content}</pre>
        </>
      )}
    </div>
  );
}

export default Stage;
