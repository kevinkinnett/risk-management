import React, { useState } from 'react';
import { Typography, Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, IconButton } from '@mui/material';
import { ExpandMore, Phone, Email, LocationOn, Edit, Delete, Add } from '@mui/icons-material';
import { mockEmergencyContacts } from '../mockData';
import { EmergencyContact, ContactCategory, ContactPriority } from '../types';
import { getContactPriorityColor, getCategoryHexColor } from '../utils/colors';

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.values(ContactCategory)));


  const getCategoryDisplayName = (category: ContactCategory) => {
    switch (category) {
      case ContactCategory.EmergencyServices: return 'Emergency Services';
      case ContactCategory.Medical: return 'Medical';
      case ContactCategory.Family: return 'Family';
      case ContactCategory.Financial: return 'Financial';
      case ContactCategory.Insurance: return 'Insurance';
      case ContactCategory.Utilities: return 'Utilities';
      case ContactCategory.Legal: return 'Legal';
      default: return 'Other';
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingContact) {
      const existingIndex = contacts.findIndex(c => c.id === editingContact.id);
      if (existingIndex >= 0) {
        setContacts(contacts.map(c => c.id === editingContact.id ? { ...editingContact, lastUpdated: new Date().toISOString() } : c));
      } else {
        setContacts([...contacts, { ...editingContact, lastUpdated: new Date().toISOString() }]);
      }
      setDialogOpen(false);
      setEditingContact(null);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingContact(null);
  };

  const handleAdd = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      category: ContactCategory.Other,
      priority: ContactPriority.Secondary,
      phonePrimary: '',
      isActive: true,
      lastUpdated: new Date().toISOString(),
    };
    setEditingContact(newContact);
    setDialogOpen(true);
  };

  const handleDelete = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const handleCategoryToggle = (category: ContactCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getContactsByCategory = (category: ContactCategory) => {
    return contacts.filter(contact => contact.category === category && contact.isActive);
  };

  const categoryOrder = [
    ContactCategory.EmergencyServices,
    ContactCategory.Medical,
    ContactCategory.Family,
    ContactCategory.Financial,
    ContactCategory.Insurance,
    ContactCategory.Utilities,
    ContactCategory.Legal,
    ContactCategory.Other,
  ];

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Emergency Contacts
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
          Add Contact
        </Button>
      </Box>

      {categoryOrder.map(category => {
        const categoryContacts = getContactsByCategory(category);
        if (categoryContacts.length === 0) return null;

        return (
          <Accordion
            key={category}
            expanded={expandedCategories.has(category)}
            onChange={() => handleCategoryToggle(category)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: `${getCategoryHexColor(category)}20`,
                '&:hover': {
                  backgroundColor: `${getCategoryHexColor(category)}30`,
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6">
                  {getCategoryDisplayName(category)}
                </Typography>
                <Chip
                  label={`${categoryContacts.length} contact${categoryContacts.length !== 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {categoryContacts.map((contact) => (
                  <Card key={contact.id} sx={{ minWidth: 320, maxWidth: 400 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {contact.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {contact.relationship}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={contact.priority}
                            color={getContactPriorityColor(contact.priority)}
                            size="small"
                          />
                          <IconButton size="small" onClick={() => handleEdit(contact)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(contact.id)} color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{contact.phonePrimary}</Typography>
                          {contact.phoneSecondary && (
                            <Typography variant="body2" color="text.secondary">
                              (alt: {contact.phoneSecondary})
                            </Typography>
                          )}
                        </Box>

                        {contact.email && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2">{contact.email}</Typography>
                          </Box>
                        )}

                        {contact.address && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">{contact.address}</Typography>
                          </Box>
                        )}

                        {contact.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {contact.notes}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>{editingContact && contacts.find(c => c.id === editingContact.id) ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editingContact?.name || ''}
            onChange={(e) => setEditingContact(editingContact ? { ...editingContact, name: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Relationship"
            fullWidth
            variant="outlined"
            value={editingContact?.relationship || ''}
            onChange={(e) => setEditingContact(editingContact ? { ...editingContact, relationship: e.target.value } : null)}
          />
          <Box display="flex" gap={2}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={editingContact?.category || ''}
                label="Category"
                onChange={(e) => setEditingContact(editingContact ? { ...editingContact, category: e.target.value as ContactCategory } : null)}
              >
                <MenuItem value={ContactCategory.EmergencyServices}>Emergency Services</MenuItem>
                <MenuItem value={ContactCategory.Medical}>Medical</MenuItem>
                <MenuItem value={ContactCategory.Family}>Family</MenuItem>
                <MenuItem value={ContactCategory.Financial}>Financial</MenuItem>
                <MenuItem value={ContactCategory.Insurance}>Insurance</MenuItem>
                <MenuItem value={ContactCategory.Utilities}>Utilities</MenuItem>
                <MenuItem value={ContactCategory.Legal}>Legal</MenuItem>
                <MenuItem value={ContactCategory.Other}>Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Priority</InputLabel>
              <Select
                value={editingContact?.priority || ''}
                label="Priority"
                onChange={(e) => setEditingContact(editingContact ? { ...editingContact, priority: e.target.value as ContactPriority } : null)}
              >
                <MenuItem value={ContactPriority.Primary}>Primary</MenuItem>
                <MenuItem value={ContactPriority.Secondary}>Secondary</MenuItem>
                <MenuItem value={ContactPriority.Tertiary}>Tertiary</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              margin="dense"
              label="Primary Phone"
              fullWidth
              variant="outlined"
              value={editingContact?.phonePrimary || ''}
              onChange={(e) => setEditingContact(editingContact ? { ...editingContact, phonePrimary: e.target.value } : null)}
            />
            <TextField
              margin="dense"
              label="Secondary Phone (Optional)"
              fullWidth
              variant="outlined"
              value={editingContact?.phoneSecondary || ''}
              onChange={(e) => setEditingContact(editingContact ? { ...editingContact, phoneSecondary: e.target.value } : null)}
            />
          </Box>
          <TextField
            margin="dense"
            label="Email (Optional)"
            fullWidth
            variant="outlined"
            type="email"
            value={editingContact?.email || ''}
            onChange={(e) => setEditingContact(editingContact ? { ...editingContact, email: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Address (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={editingContact?.address || ''}
            onChange={(e) => setEditingContact(editingContact ? { ...editingContact, address: e.target.value } : null)}
          />
          <TextField
            margin="dense"
            label="Notes (Optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editingContact?.notes || ''}
            onChange={(e) => setEditingContact(editingContact ? { ...editingContact, notes: e.target.value } : null)}
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

export default EmergencyContacts;