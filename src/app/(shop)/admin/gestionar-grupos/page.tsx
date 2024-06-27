'use client';
import { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

import {
	AddGroupModal,
	FilterButton,
	Search,
	SortButton,
	Table,
	isAdmin,
} from '@/components';
import { useGetAllGroupsQuery } from '@/store';

interface SortConfig {
	key: string;
	direction: 'asc' | 'desc';
}

interface FilterConfig {
	key: string;
	value: string;
}

const columns = [
	{
		id: 'image',
		label: '',
		minWidth: 50,
		align: 'center' as const,
	},
	{
		id: 'name',
		label: 'Nombre',
		minWidth: 100,
		align: 'center' as const,
	},
	{
		id: 'description',
		label: 'Descripción',
		minWidth: 100,
		align: 'center' as const,
	},
	{
		id: 'categories',
		label: 'Categorias',
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

export const ManageGroupsPage = () => {
	const {
		data: dataGroups,
		isLoading: isLoadingGroups,
		refetch,
	} = useGetAllGroupsQuery({
		page: 1,
		limit: 100,
	});

	const groups = dataGroups?.[0] || [];

	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: '',
		direction: 'asc',
	});
	const [filter, setFilter] = useState<FilterConfig>({ key: '', value: '' });

	const groupRows = groups.map((group) => ({
		name: group.name,
		image: group.image_url,
		description: group.description,
		id: group.id,
		categories: group.categories
			.map((category) => category.name)
			.join(', '),
	}));

	const filteredGroupRows = groupRows.filter((row) =>
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
								Gestionar Grupos
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
						<AddGroupModal refetch={refetch} />
						<SortButton onSort={handleSort} />
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} mb={10}>
				<Table
					columns={columns}
					rows={filteredGroupRows}
					isLoading={isLoadingGroups}
					type="grupos"
					refetch={refetch}
				/>
			</Grid>
		</Grid>
	);
};

export default isAdmin(ManageGroupsPage);
