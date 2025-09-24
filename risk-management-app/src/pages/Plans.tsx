import React, { useState, useEffect } from 'react';
import { Typography, Chip, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExpandMore, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { mockPlans, mockScenarios, mockRemediations, mockSteps } from '../mockData';
import { Plan, Step, RemediationStatus } from '../types';

const Plans: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [steps, setSteps] = useState<Step[]>(mockSteps);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.highlightPlan) {
      setHighlightedPlan(location.state.highlightPlan);
      setExpandedPlan(location.state.highlightPlan);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getScenarioName = (scenarioId: string) => {
    return mockScenarios.find(s => s.id === scenarioId)?.name || 'Unknown';
  };

  const getRemediationNames = (remediationIds: string[]) => {
    return remediationIds.map(id => mockRemediations.find(r => r.id === id)?.name || 'Unknown').join(', ');
  };

  const getStepsForPlan = (planId: string) => {
    return steps.filter(step => step.planId === planId).sort((a, b) => a.order - b.order);
  };

  const getStatusColor = (status: RemediationStatus) => {
    switch (status) {
      case RemediationStatus.Completed: return 'success';
      case RemediationStatus.InProgress: return 'warning';
      case RemediationStatus.NotStarted: return 'error';
      default: return 'default';
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      const existingIndex = plans.findIndex(p => p.id === editingPlan.id);
      if (existingIndex >= 0) {
        setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
      } else {
        setPlans([...plans, editingPlan]);
      }
      setPlanDialogOpen(false);
      setEditingPlan(null);
    }
  };

  const handleCancelPlan = () => {
    setPlanDialogOpen(false);
    setEditingPlan(null);
  };

  const handleAddPlan = () => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: '',
      description: '',
      scenarioId: '',
      order: 1,
      triggerCondition: '',
      steps: [],
    };
    setEditingPlan(newPlan);
    setPlanDialogOpen(true);
  };

  const handleAddStep = (planId: string) => {
    const planSteps = getStepsForPlan(planId);
    const maxOrder = planSteps.length > 0 ? Math.max(...planSteps.map(s => s.order)) : 0;

    const newStep: Step = {
      id: Date.now().toString(),
      planId,
      name: '',
      description: '',
      order: maxOrder + 1,
      status: RemediationStatus.NotStarted,
      remediations: [],
    };
    setEditingStep(newStep);
    setStepDialogOpen(true);
  };

  const handleEditStep = (step: Step) => {
    setEditingStep(step);
    setStepDialogOpen(true);
  };

  const handleSaveStep = () => {
    if (editingStep) {
      const existingIndex = steps.findIndex(s => s.id === editingStep.id);
      if (existingIndex >= 0) {
        setSteps(steps.map(s => s.id === editingStep.id ? editingStep : s));
      } else {
        setSteps([...steps, editingStep]);
        // Add step to plan if it's new
        const plan = plans.find(p => p.id === editingStep.planId);
        if (plan && !plan.steps.includes(editingStep.id)) {
          setPlans(plans.map(p => p.id === plan.id ? { ...p, steps: [...p.steps, editingStep.id] } : p));
        }
      }
      setStepDialogOpen(false);
      setEditingStep(null);
    }
  };

  const handleCancelStep = () => {
    setStepDialogOpen(false);
    setEditingStep(null);
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const planSteps = getStepsForPlan(step.planId);
    const currentIndex = planSteps.findIndex(s => s.id === stepId);

    if (direction === 'up' && currentIndex > 0) {
      // Swap with previous step
      const prevStep = planSteps[currentIndex - 1];
      setSteps(steps.map(s => {
        if (s.id === stepId) return { ...s, order: prevStep.order };
        if (s.id === prevStep.id) return { ...s, order: step.order };
        return s;
      }));
    } else if (direction === 'down' && currentIndex < planSteps.length - 1) {
      // Swap with next step
      const nextStep = planSteps[currentIndex + 1];
      setSteps(steps.map(s => {
        if (s.id === stepId) return { ...s, order: nextStep.order };
        if (s.id === nextStep.id) return { ...s, order: step.order };
        return s;
      }));
    }
  };

  const handleUpdateStepStatus = (stepId: string, status: RemediationStatus) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, status } : s));
  };

  const handleViewRemediation = (remediationId: string) => {
    navigate('/remediations', { state: { highlightRemediation: remediationId } });
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Response Plans
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddPlan}>
          Add Plan
        </Button>
      </Box>

      {plans
        .sort((a, b) => a.order - b.order)
        .map((plan) => (
          <Accordion
            key={plan.id}
            expanded={expandedPlan === plan.id}
            onChange={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
            sx={{
              backgroundColor: highlightedPlan === plan.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
              mb: 1,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Typography variant="h6">{plan.name}</Typography>
                <Chip label={getScenarioName(plan.scenarioId)} size="small" />
                <Chip label={`Order: ${plan.order}`} size="small" variant="outlined" />
                <Box flexGrow={1} />
                <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); handleEditPlan(plan); }}>
                  Edit Plan
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" gutterBottom>
                {plan.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Trigger:</strong> {plan.triggerCondition}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={1}>
                <Typography variant="h6">Steps ({getStepsForPlan(plan.id).length})</Typography>
                <Button size="small" variant="contained" onClick={() => handleAddStep(plan.id)}>
                  Add Step
                </Button>
              </Box>

              <List>
                {getStepsForPlan(plan.id).map((step, index) => (
                  <ListItem key={step.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1">{step.order}. {step.name}</Typography>
                          <Chip
                            label={step.status.replace('_', ' ')}
                            color={getStatusColor(step.status)}
                            size="small"
                          />
                          {step.estimatedTime && (
                            <Chip label={step.estimatedTime} size="small" variant="outlined" />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {step.description}
                          </Typography>
                          {step.remediations.length > 0 && (
                            <Box mt={1}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Remediations:</strong>
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {step.remediations.map(remediationId => {
                                  const remediation = mockRemediations.find(r => r.id === remediationId);
                                  return remediation ? (
                                    <Chip
                                      key={remediationId}
                                      label={remediation.name}
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleViewRemediation(remediationId)}
                                      sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                          backgroundColor: 'primary.main',
                                          color: 'primary.contrastText',
                                        }
                                      }}
                                    />
                                  ) : null;
                                })}
                              </Box>
                            </Box>
                          )}
                        </>
                      }
                    />
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUpward />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveStep(step.id, 'down')}
                          disabled={index === getStepsForPlan(plan.id).length - 1}
                        >
                          <ArrowDownward />
                        </IconButton>
                        <Button size="small" variant="outlined" onClick={() => handleEditStep(step)}>
                          Edit
                        </Button>
                      </Box>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={step.status}
                          onChange={(e) => handleUpdateStepStatus(step.id, e.target.value as RemediationStatus)}
                          size="small"
                        >
                          <MenuItem value={RemediationStatus.NotStarted}>Not Started</MenuItem>
                          <MenuItem value={RemediationStatus.InProgress}>In Progress</MenuItem>
                          <MenuItem value={RemediationStatus.Completed}>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

      {/* Plan Edit Dialog */}
      <Dialog open={planDialogOpen} onClose={handleCancelPlan} maxWidth="md" fullWidth>
        <DialogTitle>{editingPlan && plans.find(p => p.id === editingPlan.id) ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editingPlan?.name || ''}
            onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, name: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={editingPlan?.description || ''}
            onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, description: e.target.value } : null)}
          />
          <Box display="flex" gap={2}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Scenario</InputLabel>
              <Select
                value={editingPlan?.scenarioId || ''}
                label="Scenario"
                onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, scenarioId: e.target.value } : null)}
              >
                {mockScenarios.map((scenario) => (
                  <MenuItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Order"
              type="number"
              variant="outlined"
              value={editingPlan?.order || 1}
              onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, order: parseInt(e.target.value) || 1 } : null)}
            />
          </Box>
          <TextField
            margin="dense"
            label="Trigger Condition"
            fullWidth
            variant="outlined"
            value={editingPlan?.triggerCondition || ''}
            onChange={(e) => setEditingPlan(editingPlan ? { ...editingPlan, triggerCondition: e.target.value } : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPlan}>Cancel</Button>
          <Button onClick={handleSavePlan} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Step Edit Dialog */}
      <Dialog open={stepDialogOpen} onClose={handleCancelStep} maxWidth="md" fullWidth>
        <DialogTitle>{editingStep && steps.find(s => s.id === editingStep.id) ? 'Edit Step' : 'Add Step'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editingStep?.name || ''}
            onChange={(e) => setEditingStep(editingStep ? { ...editingStep, name: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={editingStep?.description || ''}
            onChange={(e) => setEditingStep(editingStep ? { ...editingStep, description: e.target.value } : null)}
          />
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Order"
              type="number"
              variant="outlined"
              value={editingStep?.order || 1}
              onChange={(e) => setEditingStep(editingStep ? { ...editingStep, order: parseInt(e.target.value) || 1 } : null)}
            />
            <TextField
              margin="dense"
              label="Estimated Time"
              fullWidth
              variant="outlined"
              value={editingStep?.estimatedTime || ''}
              onChange={(e) => setEditingStep(editingStep ? { ...editingStep, estimatedTime: e.target.value } : null)}
            />
          </Box>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={editingStep?.status || RemediationStatus.NotStarted}
              label="Status"
              onChange={(e) => setEditingStep(editingStep ? { ...editingStep, status: e.target.value as RemediationStatus } : null)}
            >
              <MenuItem value={RemediationStatus.NotStarted}>Not Started</MenuItem>
              <MenuItem value={RemediationStatus.InProgress}>In Progress</MenuItem>
              <MenuItem value={RemediationStatus.Completed}>Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Remediations</InputLabel>
            <Select
              multiple
              value={editingStep?.remediations || []}
              label="Remediations"
              onChange={(e) => setEditingStep(editingStep ? { ...editingStep, remediations: e.target.value as string[] } : null)}
              renderValue={(selected) => getRemediationNames(selected as string[])}
            >
              {mockRemediations.map((remediation) => (
                <MenuItem key={remediation.id} value={remediation.id}>
                  <Typography>{remediation.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {remediation.description}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelStep}>Cancel</Button>
          <Button onClick={handleSaveStep} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Plans;