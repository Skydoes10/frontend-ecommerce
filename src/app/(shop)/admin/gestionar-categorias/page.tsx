'use client';
import { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import {
	AddCategoryModal,
	FilterButton,
	Search,
	SortButton,
	Table,
	isAdmin,
} from '@/components';
import { useGetAllCategoriesQuery } from '@/store';

interface SortConfig {
	key: string;
	direction: 'asc' | 'desc';
}

interface FilterConfig {
	key: string;
	value: string;
}

const columns = [
	{ id: 'image', label: '', minWidth: 50, align: 'center' as const },
	{
		id: 'name',
		label: 'Nombre Categoría',
		minWidth: 100,
		align: 'center' as const,
	},
	{
		id: 'description',
		label: 'Descripción',
		minWidth: 100,
		align: 'center' as const,
	},
	{ id: 'id', label: 'ID', minWidth: 170, align: 'center' as const },
	{
		id: 'actions',
		label: 'Acciones',
		minWidth: 120,
		align: 'center' as const,
	},
];

export const ManageCategoriesPage = () => {
	const {
		data: dataCategories,
		isLoading,
		refetch,
	} = useGetAllCategoriesQuery({
		page: 1,
		limit: 100,
	});

	const categories = dataCategories?.[0] || [];

	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: '',
		direction: 'asc',
	});
	const [filter, setFilter] = useState<FilterConfig>({ key: '', value: '' });

	const categoryRows = categories.map((category) => ({
		name: category.name,
		image: category.image_url,
		description: category.description,
		id: category.id,
	}));

	const filteredCategoryRows = categoryRows.filter((row) =>
		row.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSort = (key: string) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const handleFilter = (key: string, value: string) => {
		setFilter({ key, value });
	};

	return (
		<Grid
			container
			spacing={4}
			sx={{
				px: { xs: 2, md: 10 },
				my: 2,
			}}
		>
			<Grid item xs={12}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={6}>
						<Box sx={{ display: 'flex', gap: 5 }}>
							<Typography
								sx={{
									color: 'text.primary',
									fontWeight: 'bold',
									fontSize: '1.8rem',
								}}
							>
								Gestionar Categorías
							</Typography>
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							display: 'flex',
							justifyContent: { xs: 'center', md: 'flex-end' },
							gap: 2,
							flexWrap: 'wrap',
						}}
					>
						<Search
							border
							onSearch={(value) => setSearchTerm(value)}
						/>
						<AddCategoryModal refetch={refetch} />
						<SortButton onSort={handleSort} />
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} mb={10}>
				<Table
					columns={columns}
					rows={filteredCategoryRows}
					isLoading={isLoading}
					type="categorías"
					refetch={refetch}
				/>
			</Grid>
		</Grid>
	);
};

export default isAdmin(ManageCategoriesPage);
