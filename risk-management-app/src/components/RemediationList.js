import React from 'react';

const RemediationList = ({ remediations }) => {
  return (
    <div>
      <h3>Remediations</h3>
      <ul>
        {remediations.map((remediation) => (
          <li key={remediation.id}>
            {remediation.name}
            <h4>Supplies:</h4>
            <ul>
              {remediation.supplies.map((supply, index) => (
                <li key={index}>
                  {supply.name} ({supply.quantity})
                </li>
              ))}
            </ul>
            <h4>Plans:</h4>
            <ul>
              {remediation.plans.map((plan, index) => (
                <li key={index}>{plan}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemediationList;
