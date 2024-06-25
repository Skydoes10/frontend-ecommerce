import React, { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FiltersProps {
  onSelectFilter: (filter: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ onSelectFilter }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState('MÁS VENDIDOS');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option: string) => {
    const upperCaseOption = option.toUpperCase();
    setSelectedFilter(upperCaseOption);
    onSelectFilter(upperCaseOption);
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pl:4,pr:4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {selectedFilter}
      </Typography>
      <IconButton onClick={handleClick}>
        <FilterListIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('Menor a mayor precio')}>Menor a mayor precio</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Más vendidos')}>Más vendidos</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Mejor votados')}>Mejor votados</MenuItem>
      </Menu>
    </Box>
  );
};

export default Filters;