import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './TestEditor.css'

function TestEditor() {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [stages, setStages] = useState([{ name: '', command: '', isCollapsed: false, logs: [] }]);

  useEffect(() => {
    const newSocket = io('http://localhost:5002');
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
    // Clear the logs for each stage
    const clearedStages = stages.map(stage => ({
      ...stage,
      logs: []
    }));
    setStages(clearedStages);
  
    const commands = stages.map(s => ({ name: s.name, command: s.command }));
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
    setStages([...stages, { name: '', command: '', isCollapsed: false, logs: [] }]);
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
    <div className="TestEditor">
      <div className="header">
        <h1>Edit Your Test</h1>
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
                {stage.logs.map((log, logIndex) => (
                  <SyntaxHighlighter 
                    language="bash" 
                    style={docco} 
                    key={logIndex}
                  >
                    {log}
                  </SyntaxHighlighter>
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

export default TestEditor;
