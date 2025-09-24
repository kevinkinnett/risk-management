import React, { useState } from 'react';

const AddRemediation = ({ setRemediations }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newRemediation = {
      id: Date.now(),
      name,
      supplies: [],
      plans: [],
    };
    setRemediations((prevRemediations) => [...prevRemediations, newRemediation]);
    setName('');
  };

  return (
    <div>
      <h4>Add New Remediation</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Remediation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Remediation</button>
      </form>
    </div>
  );
};

export default AddRemediation;
