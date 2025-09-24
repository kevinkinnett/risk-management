import React, { useState } from 'react';

const AddScenario = ({ setScenarios }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newScenario = {
      id: Date.now(),
      name,
      remediationIds: [],
    };
    setScenarios((prevScenarios) => [...prevScenarios, newScenario]);
    setName('');
  };

  return (
    <div>
      <h4>Add New Scenario</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Scenario Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Scenario</button>
      </form>
    </div>
  );
};

export default AddScenario;
