import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  color,
  size = 'small',
  variant = 'filled'
}) => {
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={variant}
    />
  );
};