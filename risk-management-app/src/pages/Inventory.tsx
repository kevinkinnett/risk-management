import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { mockInventory } from '../mockData';
import { InventoryItem } from '../types';
import { getStockStatus, isExpiringSoon } from '../utils/statusUtils';

const Inventory: React.FC = () => {
  const location = useLocation();
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [highlightedInventory, setHighlightedInventory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (location.state?.highlightInventory) {
      setHighlightedInventory(location.state.highlightInventory);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      const existingIndex = inventory.findIndex(i => i.id === editingItem.id);
      if (existingIndex >= 0) {
        setInventory(inventory.map(i => i.id === editingItem.id ? { ...editingItem, lastUpdated: new Date().toISOString() } : i));
      } else {
        setInventory([...inventory, { ...editingItem, lastUpdated: new Date().toISOString() }]);
      }
      setDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleAdd = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 0,
      category: '',
      location: '',
      supplier: '',
      unitCost: 0,
      minimumStock: 0,
      lastUpdated: new Date().toISOString(),
    };
    setEditingItem(newItem);
    setDialogOpen(true);
  };


  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Item
        </Button>
      </Box>
      <Box mb={2}>
        <TextField
          label="Search inventory"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, category, or location..."
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  backgroundColor: highlightedInventory === item.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                  '&:hover': {
                    backgroundColor: highlightedInventory === item.id ? 'rgba(25, 118, 210, 0.12)' : undefined,
                  }
                }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                <TableCell>
                  {item.expirationDate ? (
                    <Box>
                      {new Date(item.expirationDate).toLocaleDateString()}
                      {isExpiringSoon(item.expirationDate) && (
                        <Chip label="Expiring Soon" color="warning" size="small" sx={{ ml: 1 }} />
                      )}
                    </Box>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <Chip {...getStockStatus(item)} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem && inventory.find(i => i.id === editingItem.id) ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editingItem?.name || ''}
            onChange={(e) => setEditingItem(editingItem ? { ...editingItem, name: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={editingItem?.description || ''}
            onChange={(e) => setEditingItem(editingItem ? { ...editingItem, description: e.target.value } : null)}
          />
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              variant="outlined"
              value={editingItem?.quantity || 0}
              onChange={(e) => setEditingItem(editingItem ? { ...editingItem, quantity: parseInt(e.target.value) || 0 } : null)}
            />
            <TextField
              margin="dense"
              label="Category"
              fullWidth
              variant="outlined"
              value={editingItem?.category || ''}
              onChange={(e) => setEditingItem(editingItem ? { ...editingItem, category: e.target.value } : null)}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Location"
              fullWidth
              variant="outlined"
              value={editingItem?.location || ''}
              onChange={(e) => setEditingItem(editingItem ? { ...editingItem, location: e.target.value } : null)}
            />
            <TextField
              margin="dense"
              label="Supplier"
              fullWidth
              variant="outlined"
              value={editingItem?.supplier || ''}
              onChange={(e) => setEditingItem(editingItem ? { ...editingItem, supplier: e.target.value } : null)}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Unit Cost"
              type="number"
              variant="outlined"
              value={editingItem?.unitCost || 0}
              onChange={(e) => setEditingItem(editingItem ? { ...editingItem, unitCost: parseFloat(e.target.value) || 0 } : null)}
            />
            <TextField
              margin="dense"
              label="Minimum Stock"
              type="number"
              variant="outlined"
              value={editingItem?.minimumStock || 0}
              onChange={(e) => setEditingItem(editingItem ? { ...editingItem, minimumStock: parseInt(e.target.value) || 0 } : null)}
            />
          </Box>
          <TextField
            margin="dense"
            label="Expiration Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={editingItem?.expirationDate ? editingItem.expirationDate.split('T')[0] : ''}
            onChange={(e) => setEditingItem(editingItem ? { ...editingItem, expirationDate: e.target.value ? new Date(e.target.value).toISOString() : undefined } : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory;