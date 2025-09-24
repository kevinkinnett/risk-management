import React from 'react';
import ScenarioList from './ScenarioList';
import RemediationList from './RemediationList';
import AddScenario from './AddScenario';
import AddRemediation from './AddRemediation';

const Dashboard = ({ scenarios, remediations, setScenarios, setRemediations }) => {
  return (
    <div>
      <h1>Risk Management Dashboard</h1>
      <AddScenario setScenarios={setScenarios} />
      <AddRemediation setRemediations={setRemediations} />
      <ScenarioList scenarios={scenarios} remediations={remediations} />
      <RemediationList remediations={remediations} />
    </div>
  );
};

export default Dashboard;
