import React from 'react';

const ScenarioList = ({ scenarios, remediations }) => {
  const getRemediationNameById = (id) => {
    const remediation = remediations.find((r) => r.id === id);
    return remediation ? remediation.name : 'Unknown Remediation';
  };

  return (
    <div>
      <h3>Scenarios</h3>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            {scenario.name}
            <ul>
              {scenario.remediationIds.map((remediationId) => (
                <li key={remediationId}>{getRemediationNameById(remediationId)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScenarioList;
