'use client';
import { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FiltersProps {
	onSelectFilter: (filter: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onSelectFilter }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedFilter, setSelectedFilter] = useState('Mejor votados');

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (option: string) => {
		setSelectedFilter(option);
		onSelectFilter(option);
		handleClose();
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				mb: 2,
				pt: 6,
			}}
		>
			<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
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
				<MenuItem onClick={() => handleMenuItemClick('Menos costosos')}>
					Menos costosos
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick('Más costosos')}>
					Más costosos
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick('Mejor votados')}>
					Mejor votados
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick('Peor votados')}>
					Peor votados
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick('Más vendidos')}>
					Más vendidos
				</MenuItem>
				<MenuItem onClick={() => handleMenuItemClick('Menos vendidos')}>
					Menos vendidos
				</MenuItem>
			</Menu>
		</Box>
	);
};
