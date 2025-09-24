import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Box, Chip, Button, FormControl, InputLabel, Select, MenuItem, LinearProgress, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Switch, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ExpandMore, ViewList, Category } from '@mui/icons-material';
import { mockScenarios, mockPlans, mockSteps, mockRemediations, mockCategories } from '../mockData';
import { Severity, Probability, RemediationStatus, Velocity, Detectability, Season } from '../types';
import { getStoredDashboardSortBy, setStoredDashboardSortBy, getStoredDashboardSortOrder, setStoredDashboardSortOrder } from '../utils/localStorage';
import { getSeverityColor, getProbabilityColor } from '../utils/colors';

const calculatePreparedness = (scenarioId: string) => {
  const plans = mockPlans.filter(plan => plan.scenarioId === scenarioId);
  if (plans.length === 0) return { percentage: 0, level: 'No Plans', color: 'error' as const };

  let totalSteps = 0;
  let completedSteps = 0;

  plans.forEach(plan => {
    const steps = mockSteps.filter(step => plan.steps.includes(step.id));
    totalSteps += steps.length;
    completedSteps += steps.filter(step => step.status === RemediationStatus.Completed).length;
  });

  if (totalSteps === 0) return { percentage: 0, level: 'No Steps', color: 'error' as const };

  const percentage = Math.round((completedSteps / totalSteps) * 100);
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

const getCurrentSeason = (): Season => {
  const month = new Date().getMonth(); // 0-11
  if (month >= 11 || month <= 1) return Season.Winter; // Dec-Feb
  if (month >= 2 && month <= 4) return Season.Spring; // Mar-May
  if (month >= 5 && month <= 7) return Season.Summer; // Jun-Aug
  return Season.Fall; // Sep-Nov
};

const getRiskScore = (scenario: any) => {
  const severityWeight = scenario.severity === Severity.High ? 3 : scenario.severity === Severity.Medium ? 2 : 1;
  const probabilityWeight = scenario.probability === Probability.High ? 3 : scenario.probability === Probability.Medium ? 2 : 1;
  const velocityWeight = scenario.velocity === Velocity.Immediate ? 4 : scenario.velocity === Velocity.Fast ? 3 : scenario.velocity === Velocity.Moderate ? 2 : 1;
  const detectabilityWeight = scenario.detectability === Detectability.Difficult ? 3 : scenario.detectability === Detectability.Moderate ? 2 : 1;
  const preparedness = calculatePreparedness(scenario.id);
  const preparednessWeight = preparedness.percentage / 100; // 0-1 scale

  // Time pressure factors
  const currentSeason = getCurrentSeason();
  const seasonalRelevance = scenario.seasonalRisk?.includes(currentSeason) ? 1.5 : 1.0; // 50% risk increase for seasonal threats

  // Overdue remediation factor: increase risk for scenarios with overdue remediations
  const relatedRemediations = mockRemediations.filter(r => r.applicableScenarios.includes(scenario.id));
  const overdueCount = relatedRemediations.filter(r =>
    r.dueDate && new Date(r.dueDate) < new Date() && r.status !== RemediationStatus.Completed
  ).length;
  const overdueFactor = 1 + (overdueCount * 0.3); // 30% risk increase per overdue item

  // Enhanced risk formula: (severity × probability × velocity × detectability × seasonal × overdue) × (1 - preparedness)
  return (severityWeight * probabilityWeight * velocityWeight * detectabilityWeight * seasonalRelevance * overdueFactor) * (1 - preparednessWeight);
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'probability' | 'preparedness' | 'severity' | 'name'>(() => getStoredDashboardSortBy());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => getStoredDashboardSortOrder());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('dashboardExpandedCategories');
    return stored ? new Set(JSON.parse(stored)) : new Set(mockCategories.map(c => c.id));
  });
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('dashboardSelectedCategories');
    return stored ? new Set(JSON.parse(stored)) : new Set(mockCategories.map(c => c.id));
  });
  const [viewMode, setViewMode] = useState<'categories' | 'all'>(() => {
    const stored = localStorage.getItem('dashboardViewMode');
    return (stored as 'categories' | 'all') || 'categories';
  });

  // Save sort preferences to localStorage
  useEffect(() => {
    setStoredDashboardSortBy(sortBy);
  }, [sortBy]);

  useEffect(() => {
    setStoredDashboardSortOrder(sortOrder);
  }, [sortOrder]);

  // Persist category states to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardExpandedCategories', JSON.stringify(Array.from(expandedCategories)));
  }, [expandedCategories]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedCategories', JSON.stringify(Array.from(selectedCategories)));
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem('dashboardViewMode', viewMode);
  }, [viewMode]);



  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategoryFilterToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getScenariosByCategory = (categoryId: string) => {
    return mockScenarios.filter(scenario => scenario.categories.includes(categoryId));
  };

  const sortedScenarios = useMemo(() => {
    const scenariosWithData = mockScenarios.map(scenario => ({
      ...scenario,
      preparedness: calculatePreparedness(scenario.id),
      riskScore: getRiskScore(scenario)
    }));

    return scenariosWithData.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'probability':
          aValue = a.probability === Probability.High ? 3 : a.probability === Probability.Medium ? 2 : 1;
          bValue = b.probability === Probability.High ? 3 : b.probability === Probability.Medium ? 2 : 1;
          break;
        case 'preparedness':
          aValue = a.preparedness.percentage;
          bValue = b.preparedness.percentage;
          break;
        case 'severity':
          aValue = a.severity === Severity.High ? 3 : a.severity === Severity.Medium ? 2 : 1;
          bValue = b.severity === Severity.High ? 3 : b.severity === Severity.Medium ? 2 : 1;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [sortBy, sortOrder]);

  const handleAnalyzeScenario = (scenarioId: string) => {
    navigate(`/scenarios?analyze=${scenarioId}`);
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Risk Management Dashboard
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150, visibility: viewMode === 'all' ? 'visible' : 'hidden' }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <MenuItem value="probability">Probability</MenuItem>
              <MenuItem value="preparedness">Preparedness</MenuItem>
              <MenuItem value="severity">Severity</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, visibility: viewMode === 'all' ? 'visible' : 'hidden' }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="desc">High to Low</MenuItem>
              <MenuItem value="asc">Low to High</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'categories'}
                onChange={(e) => setViewMode(e.target.checked ? 'categories' : 'all')}
                icon={<ViewList />}
                checkedIcon={<Category />}
              />
            }
            label={viewMode === 'categories' ? 'Categories' : 'All Scenarios'}
            labelPlacement="start"
          />
        </Box>
      </Box>

      {viewMode === 'categories' ? (
        <>
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Filter Categories:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {mockCategories.map(category => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  color={selectedCategories.has(category.id) ? 'primary' : 'default'}
                  onClick={() => handleCategoryFilterToggle(category.id)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedCategories.has(category.id) ? category.color : undefined,
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {mockCategories
            .filter(category => selectedCategories.has(category.id))
            .map(category => {
          const categoryScenarios = getScenariosByCategory(category.id);
          if (categoryScenarios.length === 0) return null;

          // Sort scenarios within category
          const sortedCategoryScenarios = categoryScenarios.map(scenario => ({
            ...scenario,
            preparedness: calculatePreparedness(scenario.id),
            riskScore: getRiskScore(scenario)
          })).sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
              case 'probability':
                aValue = a.probability === Probability.High ? 3 : a.probability === Probability.Medium ? 2 : 1;
                bValue = b.probability === Probability.High ? 3 : b.probability === Probability.Medium ? 2 : 1;
                break;
              case 'preparedness':
                aValue = a.preparedness.percentage;
                bValue = b.preparedness.percentage;
                break;
              case 'severity':
                aValue = a.severity === Severity.High ? 3 : a.severity === Severity.Medium ? 2 : 1;
                bValue = b.severity === Severity.High ? 3 : b.severity === Severity.Medium ? 2 : 1;
                break;
              case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
              default:
                return 0;
            }

            if (sortOrder === 'asc') {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
          });

          return (
            <Accordion
              key={category.id}
              expanded={expandedCategories.has(category.id)}
              onChange={() => handleCategoryToggle(category.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: category.color + '20', // 20% opacity
                  '&:hover': {
                    backgroundColor: category.color + '30',
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ color: category.color }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={`${categoryScenarios.length} scenarios`}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {sortedCategoryScenarios.map((scenario) => (
                    <Card key={scenario.id} sx={{ minWidth: 320, maxWidth: 400 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {scenario.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {scenario.description}
                        </Typography>

                        <Box display="flex" gap={1} mb={1}>
                          <Chip
                            label={`Severity: ${scenario.severity}`}
                            color={getSeverityColor(scenario.severity)}
                            size="small"
                          />
                          <Chip
                            label={`Probability: ${scenario.probability}`}
                            color={getProbabilityColor(scenario.probability)}
                            size="small"
                          />
                        </Box>

                        <Box display="flex" gap={1} mb={1}>
                          <Chip
                            label={`Velocity: ${scenario.velocity}`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`Detectability: ${scenario.detectability}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        {scenario.seasonalRisk && scenario.seasonalRisk.length > 0 && (
                          <Box mb={1}>
                            <Typography variant="caption" color="text.secondary">
                              Seasonal Risk:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                              {scenario.seasonalRisk.map(season => (
                                <Chip
                                  key={season}
                                  label={season}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        <Box mb={2}>
                          <Typography variant="body2" gutterBottom>
                            Preparedness
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress
                              variant="determinate"
                              value={scenario.preparedness.percentage}
                              sx={{ flexGrow: 1, height: 8 }}
                            />
                            <Typography variant="body2">{scenario.preparedness.percentage}%</Typography>
                          </Box>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Chip
                            label={`Risk: ${scenario.riskScore.toFixed(1)}`}
                            color={scenario.riskScore > 50 ? 'error' : scenario.riskScore > 25 ? 'warning' : 'success'}
                            size="small"
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleAnalyzeScenario(scenario.id)}
                          >
                            Analyze
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scenario</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Probability</TableCell>
                <TableCell>Velocity</TableCell>
                <TableCell>Detectability</TableCell>
                <TableCell>Seasonal Risk</TableCell>
                <TableCell>Preparedness</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedScenarios.map((scenario) => (
                <TableRow key={scenario.id}>
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
                    <Chip
                      label={scenario.velocity}
                      color="default"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={scenario.detectability}
                      color="default"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {scenario.seasonalRisk?.map(season => (
                        <Chip
                          key={season}
                          label={season}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )) || <Typography variant="body2" color="text.secondary">Year-round</Typography>}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {scenario.preparedness.level} ({scenario.preparedness.percentage}%)
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={scenario.preparedness.percentage}
                        color={scenario.preparedness.color}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={scenario.riskScore > 50 ? 'High Risk' : scenario.riskScore > 25 ? 'Medium Risk' : 'Low Risk'}
                      color={scenario.riskScore > 50 ? 'error' : scenario.riskScore > 25 ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleAnalyzeScenario(scenario.id)}
                    >
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Dashboard;