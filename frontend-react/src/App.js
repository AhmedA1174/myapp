import React, { useState } from 'react';
import Stage from './components/Stage';
import './App.css';

function App() {
  const [stages, setStages] = useState([{ name: 'Stage 1', content: '' }]);

  const handleStageChange = (index, name, content) => {
    const newStages = [...stages];
    newStages[index] = { name, content };
    setStages(newStages);
  };

  const addStage = () => {
    setStages([...stages, { name: `Stage ${stages.length + 1}`, content: '' }]);
  };

  const removeStage = (index) => {
    const newStages = [...stages];
    newStages.splice(index, 1);
    setStages(newStages);
  };

  const runTest = () => {
    // Logic to send stages to the backend
  };

  return (
    <div className="App">
      <h1>Azure Policy Tester</h1>
      {stages.map((stage, index) => (
        <Stage
          key={index}
          stageName={stage.name}
          stageContent={stage.content}
          onSave={(name, content) => handleStageChange(index, name, content)}
          onRemove={() => removeStage(index)}
        />
      ))}
      <button onClick={addStage}>Add Stage</button>
      <button onClick={runTest}>Run Test</button>
    </div>
  );
}

export default App;

