import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [stages, setStages] = useState([{ name: '', command: '', isCollapsed: false }]);
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5002');
    // setSocket(newSocket);
    newSocket.on('log', (data) => {
      const stageIndex = stages.findIndex(stage => stage.name === data.stage);
      if (stageIndex !== -1) {
        const newStages = [...stages];
        newStages[stageIndex].logs.push(data.message);
        setStages(newStages);
      }
    });

    return () => newSocket.disconnect();
  }, [stages]);


  const handleRunTest = async () => {
    const commands = stages.map(s => s.command.replace("$RGTEST", "DynamicallyGeneratedRGName"));
    const response = await fetch('http://localhost:5002/run-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subscriptionId, stages: commands })
    });
    const data = await response.json();
    alert(data.message);
  };

  const handleAddStage = () => {
    setStages([...stages, { name: '', command: '', isCollapsed: false }]);
  };

  const handleDeleteStage = (index) => {
    const newStages = [...stages];
    newStages.splice(index, 1);
    setStages(newStages);
  };
  

  const handleNameChange = (index, name) => {
    const newStages = [...stages];
    newStages[index].name = name;
    setStages(newStages);
  };

  const handleCommandChange = (index, command) => {
    const newStages = [...stages];
    newStages[index].command = command;
    setStages(newStages);
  };

  const toggleCollapse = (index) => {
    const newStages = [...stages];
    newStages[index].isCollapsed = !newStages[index].isCollapsed;
    setStages(newStages);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Azure Policy Tester</h1>
        <div className="info-icon">
          💡 Use $RGTEST as a placeholder for the Resource Group name.
        </div>
      </div>
      <div className="subscription">
        <label>Subscription ID:</label>
        <input
          type="text"
          value={subscriptionId}
          onChange={e => setSubscriptionId(e.target.value)}
        />
      </div>
      {stages.map((stage, index) => (
        <div key={index} className="stage">
          {stage.isCollapsed ? (
            <div className="collapsed-stage" onClick={() => toggleCollapse(index)}>
              {stage.name}
            </div>
          ) : (
            <div className="expanded-stage">
              <input
                type="text"
                placeholder="Stage Name"
                value={stage.name}
                onChange={e => handleNameChange(index, e.target.value)}
              />
              <textarea
                placeholder="Enter AZ CLI command..."
                value={stage.command}
                onChange={e => handleCommandChange(index, e.target.value)}
              />
              <div className="logs">
                {stage.logs && stage.logs.map((log, logIndex) => (
                  <div key={logIndex} className="log">{log}</div>
                ))}
              </div>
              <div className="stage-buttons">
                <button onClick={() => toggleCollapse(index)}>Save Stage</button>
                <button onClick={() => handleDeleteStage(index)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAddStage}>Add Stage</button>
      <button onClick={handleRunTest}>Run Test</button>
    </div>
  );
}

export default App;
