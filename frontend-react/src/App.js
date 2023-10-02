import React, { useState } from 'react';
import Stage from './components/Stage';
import './App.css';

function App() {
  const [subscriptionId, setSubscriptionId] = useState('');
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

  const runTest = async () => {
    const commands = stages.map(stage => stage.content);
    try {
      const response = await fetch('http://localhost:5002/run-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stages: commands, subscriptionId: subscriptionId })
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error running test. Please try again.');
    }
  };  

  return (
    <div className="App">
      <h1>Azure Policy Tester</h1>
      {stages.map((stage, index) => (
        <><input
          type="text"
          placeholder="AZ Subscription ID"
          value={subscriptionId}
          onChange={(e) => setSubscriptionId(e.target.value)} /><Stage
            key={index}
            stageName={stage.name}
            stageContent={stage.content}
            onSave={(name, content) => handleStageChange(index, name, content)}
            onRemove={() => removeStage(index)} /></>
      ))}
      <button onClick={addStage}>Add Stage</button>
      <button onClick={runTest}>Run Test</button>
    </div>
  );
}

export default App;

