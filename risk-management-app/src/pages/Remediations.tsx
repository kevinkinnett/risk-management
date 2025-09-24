import React, { useState, useEffect } from 'react';
import { Typography, Chip, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, ListItemText, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockRemediations, mockScenarios, mockInventory } from '../mockData';
import { RemediationStatus, Remediation } from '../types';

const getStatusColor = (status: RemediationStatus) => {
  switch (status) {
    case RemediationStatus.NotStarted: return 'default';
    case RemediationStatus.InProgress: return 'warning';
    case RemediationStatus.Completed: return 'success';
    default: return 'default';
  }
};

const getScenarioNames = (scenarioIds: string[]) => {
  return scenarioIds.map(id => mockScenarios.find(s => s.id === id)?.name || 'Unknown').join(', ');
};

const Remediations: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [remediations, setRemediations] = useState<Remediation[]>(mockRemediations);
  const [editingRemediation, setEditingRemediation] = useState<Remediation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingRemediation, setUpdatingRemediation] = useState<Remediation | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [highlightedRemediation, setHighlightedRemediation] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.highlightRemediation) {
      setHighlightedRemediation(location.state.highlightRemediation);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);


  const handleEdit = (remediation: Remediation) => {
    setEditingRemediation(remediation);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingRemediation) {
      const existingIndex = remediations.findIndex(r => r.id === editingRemediation.id);
      if (existingIndex >= 0) {
        setRemediations(remediations.map(r => r.id === editingRemediation.id ? editingRemediation : r));
      } else {
        setRemediations([...remediations, editingRemediation]);
      }
      setDialogOpen(false);
      setEditingRemediation(null);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingRemediation(null);
  };

  const handleAdd = () => {
    const newRemediation: Remediation = {
      id: Date.now().toString(),
      name: '',
      description: '',
      applicableScenarios: [],
      status: RemediationStatus.NotStarted,
      requiredInventory: [],
    };
    setEditingRemediation(newRemediation);
    setDialogOpen(true);
  };

  const handleUpdateStatus = (remediation: Remediation) => {
    setUpdatingRemediation(remediation);
    setUpdateDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (updatingRemediation) {
      setRemediations(remediations.map(r =>
        r.id === updatingRemediation.id ? updatingRemediation : r
      ));
      setUpdateDialogOpen(false);
      setUpdatingRemediation(null);
    }
  };

  const handleStatusCancel = () => {
    setUpdateDialogOpen(false);
    setUpdatingRemediation(null);
  };

  const handleViewInventoryItem = (inventoryId: string) => {
    navigate('/inventory', { state: { highlightInventory: inventoryId } });
    setUpdateDialogOpen(false);
  };

  const getInventoryStatus = (inventoryId: string) => {
    const item = mockInventory.find(i => i.id === inventoryId);
    if (!item) return { status: 'Not Found', color: 'error' as const };

    if (item.quantity <= item.minimumStock) return { status: 'Low Stock', color: 'error' as const };
    if (item.quantity <= item.minimumStock * 1.5) return { status: 'Medium Stock', color: 'warning' as const };
    return { status: 'Good Stock', color: 'success' as const };
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Remediations
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Remediation
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Remediation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applicable Scenarios</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {remediations.map((remediation) => (
              <TableRow
                key={remediation.id}
                sx={{
                  backgroundColor: highlightedRemediation === remediation.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                  '&:hover': {
                    backgroundColor: highlightedRemediation === remediation.id ? 'rgba(25, 118, 210, 0.12)' : undefined,
                  }
                }}
              >
                <TableCell>
                  <Typography variant="subtitle1">{remediation.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {remediation.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={remediation.status.replace('_', ' ')}
                    color={getStatusColor(remediation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getScenarioNames(remediation.applicableScenarios)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button size="small" variant="outlined" onClick={() => handleEdit(remediation)}>
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => handleUpdateStatus(remediation)}>
                      Update Status
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRemediation && remediations.find(r => r.id === editingRemediation.id) ? 'Edit Remediation' : 'Add Remediation'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editingRemediation?.name || ''}
            onChange={(e) => setEditingRemediation(editingRemediation ? { ...editingRemediation, name: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={editingRemediation?.description || ''}
            onChange={(e) => setEditingRemediation(editingRemediation ? { ...editingRemediation, description: e.target.value } : null)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Required Inventory</InputLabel>
            <Select
              multiple
              value={editingRemediation?.requiredInventory || []}
              label="Required Inventory"
              onChange={(e) => setEditingRemediation(editingRemediation ? { ...editingRemediation, requiredInventory: e.target.value as string[] } : null)}
              renderValue={(selected) => (selected as string[]).map(id => mockInventory.find(i => i.id === id)?.name).join(', ')}
            >
              {mockInventory.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Checkbox checked={(editingRemediation?.requiredInventory || []).indexOf(item.id) > -1} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Applicable Scenarios</InputLabel>
            <Select
              multiple
              value={editingRemediation?.applicableScenarios || []}
              label="Applicable Scenarios"
              onChange={(e) => setEditingRemediation(editingRemediation ? { ...editingRemediation, applicableScenarios: e.target.value as string[] } : null)}
              renderValue={(selected) => (selected as string[]).map(id => mockScenarios.find(s => s.id === id)?.name).join(', ')}
            >
              {mockScenarios.map((scenario) => (
                <MenuItem key={scenario.id} value={scenario.id}>
                  <Checkbox checked={(editingRemediation?.applicableScenarios || []).indexOf(scenario.id) > -1} />
                  <ListItemText primary={scenario.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={editingRemediation?.status || ''}
              label="Status"
              onChange={(e) => setEditingRemediation(editingRemediation ? { ...editingRemediation, status: e.target.value as RemediationStatus } : null)}
            >
              <MenuItem value={RemediationStatus.NotStarted}>Not Started</MenuItem>
              <MenuItem value={RemediationStatus.InProgress}>In Progress</MenuItem>
              <MenuItem value={RemediationStatus.Completed}>Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={handleStatusCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Update Remediation Status</DialogTitle>
        <DialogContent>
          {updatingRemediation && (
            <>
              <Typography variant="h6" gutterBottom>
                {updatingRemediation.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {updatingRemediation.description}
              </Typography>

              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={updatingRemediation.status}
                  label="Status"
                  onChange={(e) => setUpdatingRemediation({
                    ...updatingRemediation,
                    status: e.target.value as RemediationStatus
                  })}
                >
                  <MenuItem value={RemediationStatus.NotStarted}>Not Started</MenuItem>
                  <MenuItem value={RemediationStatus.InProgress}>In Progress</MenuItem>
                  <MenuItem value={RemediationStatus.Completed}>Completed</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                Current Status: <strong>{updatingRemediation.status.replace('_', ' ')}</strong>
              </Alert>

              {updatingRemediation.requiredInventory && updatingRemediation.requiredInventory.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Required Inventory
                  </Typography>
                  {updatingRemediation.requiredInventory.map(inventoryId => {
                    const item = mockInventory.find(i => i.id === inventoryId);
                    const status = getInventoryStatus(inventoryId);
                    return (
                      <Box key={inventoryId} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleViewInventoryItem(inventoryId)}
                          sx={{ textTransform: 'none', padding: 0, minWidth: 'auto' }}
                        >
                          <Typography variant="body2">
                            {item?.name || 'Unknown Item'}
                          </Typography>
                        </Button>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            {item?.quantity || 0} units
                          </Typography>
                          <Chip
                            label={status.status}
                            color={status.color}
                            size="small"
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusCancel}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Remediations;