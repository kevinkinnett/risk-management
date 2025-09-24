import React, { useState, useEffect } from 'react';
import { Typography, Chip, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, LinearProgress, List, ListItem, ListItemText, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockScenarios, mockRemediations, mockPlans, mockCategories } from '../mockData';
import { Severity, Probability, Velocity, Detectability, Scenario, Remediation, RemediationStatus, Category } from '../types';
import { getSeverityColor, getProbabilityColor } from '../utils/colors';


const Scenarios: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analyzingScenario, setAnalyzingScenario] = useState<Scenario | null>(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [highlightedScenario, setHighlightedScenario] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  useEffect(() => {
    const analyzeId = searchParams.get('analyze');
    if (analyzeId) {
      const scenario = scenarios.find(s => s.id === analyzeId);
      if (scenario) {
        setAnalyzingScenario(scenario);
        setAnalysisDialogOpen(true);
        setHighlightedScenario(analyzeId);
        // Clear the URL parameter
        navigate('/scenarios', { replace: true });
      }
    }
  }, [searchParams, scenarios, navigate]);

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingScenario) {
      const existingIndex = scenarios.findIndex(s => s.id === editingScenario.id);
      if (existingIndex >= 0) {
        setScenarios(scenarios.map(s => s.id === editingScenario.id ? editingScenario : s));
      } else {
        setScenarios([...scenarios, editingScenario]);
      }
      setDialogOpen(false);
      setEditingScenario(null);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingScenario(null);
  };

  const handleAdd = () => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: '',
      description: '',
      severity: Severity.Low,
      probability: Probability.Low,
      velocity: Velocity.Moderate,
      detectability: Detectability.Moderate,
      categories: [],
    };
    setEditingScenario(newScenario);
    setDialogOpen(true);
  };

  const handleAnalyze = (scenario: Scenario) => {
    setAnalyzingScenario(scenario);
    setAnalysisDialogOpen(true);
  };

  const getRelatedRemediations = (scenarioId: string): Remediation[] => {
    return mockRemediations.filter(remediation =>
      remediation.applicableScenarios.includes(scenarioId)
    );
  };

  const calculatePreparedness = (scenarioId: string): { percentage: number; level: string; color: 'success' | 'warning' | 'error' } => {
    const relatedRemediations = getRelatedRemediations(scenarioId);
    if (relatedRemediations.length === 0) return { percentage: 0, level: 'No Remediations', color: 'error' };

    const completedCount = relatedRemediations.filter(r => r.status === RemediationStatus.Completed).length;
    const percentage = Math.round((completedCount / relatedRemediations.length) * 100);

    let level: string;
    let color: 'success' | 'warning' | 'error';

    if (percentage === 100) {
      level = 'Fully Prepared';
      color = 'success';
    } else if (percentage >= 50) {
      level = 'Partially Prepared';
      color = 'warning';
    } else {
      level = 'Needs Attention';
      color = 'error';
    }

    return { percentage, level, color };
  };

  const getUrgentActions = (scenarioId: string): Remediation[] => {
    return getRelatedRemediations(scenarioId).filter(remediation =>
      remediation.status === RemediationStatus.NotStarted ||
      remediation.status === RemediationStatus.InProgress
    );
  };

  const getRelatedPlans = (scenarioId: string) => {
    return mockPlans.filter(plan => plan.scenarioId === scenarioId).sort((a, b) => a.order - b.order);
  };

  const getStatusColor = (status: RemediationStatus) => {
    switch (status) {
      case RemediationStatus.Completed: return 'success';
      case RemediationStatus.InProgress: return 'warning';
      case RemediationStatus.NotStarted: return 'error';
      default: return 'default';
    }
  };

  const handleViewRemediation = (remediationId: string) => {
    navigate('/remediations', { state: { highlightRemediation: remediationId } });
    setAnalysisDialogOpen(false);
  };

  const handleViewPlan = (planId: string) => {
    navigate('/plans', { state: { highlightPlan: planId } });
    setAnalysisDialogOpen(false);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const colors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#8BC34A', '#FFC107'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        color: randomColor,
      };

      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryDescription('');
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Risk Scenarios
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Scenario
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scenario</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Probability</TableCell>
              <TableCell>Preparedness</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scenarios.map((scenario) => {
              const preparedness = calculatePreparedness(scenario.id);
              return (
                <TableRow
                  key={scenario.id}
                  sx={{
                    backgroundColor: highlightedScenario === scenario.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: highlightedScenario === scenario.id ? 'rgba(25, 118, 210, 0.12)' : undefined,
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="subtitle1">{scenario.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {scenario.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={scenario.severity}
                      color={getSeverityColor(scenario.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={scenario.probability}
                      color={getProbabilityColor(scenario.probability)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {preparedness.level}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={preparedness.percentage}
                        color={preparedness.color}
                        sx={{ height: 6, borderRadius: 3, width: 80 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button size="small" variant="outlined" onClick={() => handleEdit(scenario)}>
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="secondary" onClick={() => handleAnalyze(scenario)}>
                        Analyze
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{editingScenario && scenarios.find(s => s.id === editingScenario.id) ? 'Edit Scenario' : 'Add Scenario'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editingScenario?.name || ''}
            onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, name: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editingScenario?.description || ''}
            onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, description: e.target.value } : null)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Severity</InputLabel>
            <Select
              value={editingScenario?.severity || ''}
              label="Severity"
              onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, severity: e.target.value as Severity } : null)}
            >
              <MenuItem value={Severity.Low}>Low</MenuItem>
              <MenuItem value={Severity.Medium}>Medium</MenuItem>
              <MenuItem value={Severity.High}>High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Probability</InputLabel>
            <Select
              value={editingScenario?.probability || ''}
              label="Probability"
              onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, probability: e.target.value as Probability } : null)}
            >
              <MenuItem value={Probability.Low}>Low</MenuItem>
              <MenuItem value={Probability.Medium}>Medium</MenuItem>
              <MenuItem value={Probability.High}>High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={editingScenario?.categories || []}
              label="Categories"
              onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, categories: e.target.value as string[] } : null)}
              renderValue={(selected) => (selected as string[]).map(id => categories.find(c => c.id === id)?.name).join(', ')}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={(editingScenario?.categories || []).indexOf(category.id) > -1} />
                  <ListItemText primary={category.name} secondary={category.description} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Create New Category (Optional)
          </Typography>
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              label="Category Name"
              variant="outlined"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              size="small"
              label="Description"
              variant="outlined"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Add
            </Button>
          </Box>
          <FormControl fullWidth margin="dense">
            <InputLabel>Velocity</InputLabel>
            <Select
              value={editingScenario?.velocity || ''}
              label="Velocity"
              onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, velocity: e.target.value as Velocity } : null)}
            >
              <MenuItem value={Velocity.Slow}>Slow</MenuItem>
              <MenuItem value={Velocity.Moderate}>Moderate</MenuItem>
              <MenuItem value={Velocity.Fast}>Fast</MenuItem>
              <MenuItem value={Velocity.Immediate}>Immediate</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Detectability</InputLabel>
            <Select
              value={editingScenario?.detectability || ''}
              label="Detectability"
              onChange={(e) => setEditingScenario(editingScenario ? { ...editingScenario, detectability: e.target.value as Detectability } : null)}
            >
              <MenuItem value={Detectability.Easy}>Easy</MenuItem>
              <MenuItem value={Detectability.Moderate}>Moderate</MenuItem>
              <MenuItem value={Detectability.Difficult}>Difficult</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={analysisDialogOpen} onClose={() => setAnalysisDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Scenario Analysis: {analyzingScenario?.name}
        </DialogTitle>
        <DialogContent>
          {analyzingScenario && (
            <>
              <Typography variant="body1" gutterBottom>
                {analyzingScenario.description}
              </Typography>

              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={`Severity: ${analyzingScenario.severity}`}
                  color={getSeverityColor(analyzingScenario.severity)}
                  size="small"
                />
                <Chip
                  label={`Probability: ${analyzingScenario.probability}`}
                  color={getProbabilityColor(analyzingScenario.probability)}
                  size="small"
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                Preparedness Level
              </Typography>
              {(() => {
                const preparedness = calculatePreparedness(analyzingScenario.id);
                return (
                  <Box mb={3}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{preparedness.level}</Typography>
                      <Typography variant="body2">{preparedness.percentage}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={preparedness.percentage}
                      color={preparedness.color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                );
              })()}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Response Plans ({getRelatedPlans(analyzingScenario.id).length})
              </Typography>
              {getRelatedPlans(analyzingScenario.id).length > 0 ? (
                <List>
                  {getRelatedPlans(analyzingScenario.id).map((plan) => (
                    <ListItem key={plan.id} divider>
                      <ListItemText
                        primary={`${plan.order}. ${plan.name}`}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {plan.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              <strong>Trigger:</strong> {plan.triggerCondition}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Steps:</strong> {plan.steps.length} step{plan.steps.length !== 1 ? 's' : ''}
                            </Typography>
                          </>
                        }
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewPlan(plan.id)}
                        sx={{ ml: 1 }}
                      >
                        View Details
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No response plans defined for this scenario.
                </Typography>
              )}

              <Typography variant="h6" gutterBottom>
                Related Remediations ({getRelatedRemediations(analyzingScenario.id).length})
              </Typography>
              <List>
                {getRelatedRemediations(analyzingScenario.id).map((remediation) => {
                  const isOverdue = remediation.dueDate && new Date(remediation.dueDate) < new Date();
                  const isDueSoon = remediation.dueDate && !isOverdue &&
                    (new Date(remediation.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;

                  return (
                    <ListItem key={remediation.id} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2">{remediation.name}</Typography>
                            {isOverdue && (
                              <Chip label="OVERDUE" color="error" size="small" />
                            )}
                            {isDueSoon && !isOverdue && (
                              <Chip label="Due Soon" color="warning" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {remediation.description}
                            </Typography>
                            {remediation.estimatedTime && (
                              <Typography variant="caption" color="text.secondary">
                                Estimated time: {remediation.estimatedTime}
                              </Typography>
                            )}
                            {remediation.dueDate && (
                              <Typography variant="caption" color={isOverdue ? "error" : isDueSoon ? "warning.main" : "text.secondary"}>
                                Due: {new Date(remediation.dueDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={remediation.status.replace('_', ' ')}
                          color={getStatusColor(remediation.status)}
                          size="small"
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewRemediation(remediation.id)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>

              {(() => {
                const urgentActions = getUrgentActions(analyzingScenario.id);
                return urgentActions.length > 0 ? (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Urgent Actions Required ({urgentActions.length})
                    </Typography>
                    <List dense>
                      {urgentActions.map((remediation) => (
                        <ListItem key={remediation.id}>
                          <ListItemText
                            primary={remediation.name}
                            secondary={`Status: ${remediation.status.replace('_', ' ')}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    All applicable remediations are completed for this scenario!
                  </Alert>
                );
              })()}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Scenarios;