import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  const [scenarios, setScenarios] = useState(() => {
    const savedScenarios = localStorage.getItem('scenarios');
    return savedScenarios ? JSON.parse(savedScenarios) : [
      { id: 1, name: 'Power Outage', remediationIds: [1] },
      { id: 2, name: 'Natural Disaster', remediationIds: [1, 2] },
    ];
  });

  const [remediations, setRemediations] = useState(() => {
    const savedRemediations = localStorage.getItem('remediations');
    return savedRemediations ? JSON.parse(savedRemediations) : [
      {
        id: 1,
        name: 'Emergency Kit',
        supplies: [
          { name: 'Canned Food', quantity: 24 },
          { name: 'Water Bottles', quantity: 48 },
        ],
        plans: ['Check on neighbors'],
      },
      {
        id: 2,
        name: 'Go Bag',
        supplies: [
          { name: 'Iodine tablets', quantity: 100 },
          { name: 'Cash', quantity: 500 },
        ],
        plans: ['Evacuate immediately'],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  useEffect(() => {
    localStorage.setItem('remediations', JSON.stringify(remediations));
  }, [remediations]);

  return (
    <div className="App">
      <Dashboard
        scenarios={scenarios}
        remediations={remediations}
        setScenarios={setScenarios}
        setRemediations={setRemediations}
      />
    </div>
  );
}

export default App;
