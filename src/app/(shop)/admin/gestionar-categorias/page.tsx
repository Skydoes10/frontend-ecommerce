'use client';
import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import {
	CategoryModal,
	PieChartUsage,
	Search,
	SortButton,
	Table,
	isAdmin,
} from '@/components';
import { useGetAllCategoriesQuery } from '@/store';

/**
 * @typedef {Object} SortConfig
 * @property {string} key - The key to sort by.
 * @property {'asc' | 'desc'} direction - The direction of the sort.
 */
interface SortConfig {
	key: string;
	direction: 'asc' | 'desc';
}

/**
 * Column configuration for the categories table.
 */
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

/**
 * The ManageCategoriesPage component allows admin users to manage categories.
 * @page
 * @returns {JSX.Element} The rendered ManageCategoriesPage component.
 */
const ManageCategoriesPage = () => {
	const {
		data: dataCategories,
		isLoading,
		refetch,
	} = useGetAllCategoriesQuery({
		page: 1,
		limit: 100,
	});

	const categories = useMemo(
		() => dataCategories?.[0] || [],
		[dataCategories]
	);

	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: '',
		direction: 'asc',
	});

	const [labels, setLabels] = useState<string[]>([]);
	const [soldByCategory, setSoldByCategory] = useState<number[]>([]);

	useEffect(() => {
		const labels = categories.map((category) => category.name);
		const soldByCategory = categories.map((category) =>
			category.products.reduce(
				(acc, product) => acc + (product.stock?.unities_sold ?? 0),
				0
			)
		);
		setLabels(labels);
		setSoldByCategory(soldByCategory);
	}, [categories]);

	const title = 'Ventas por Categoría';

	const categoryRows = categories.map((category) => ({
		name: category.name,
		image: category.image_url,
		description: category.description,
		id: category.id,
	}));

	const filteredCategoryRows = categoryRows.filter((row) =>
		row.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedCategoryRows = [...filteredCategoryRows].sort((a, b) => {
		if (sortConfig.key) {
			const aValue: any = a[sortConfig.key as keyof typeof a];
			const bValue: any = b[sortConfig.key as keyof typeof b];
			if (aValue < bValue) {
				return sortConfig.direction === 'asc' ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortConfig.direction === 'asc' ? 1 : -1;
			}
		}
		return 0;
	});

	/**
	 * Handles sorting of the table.
	 *
	 * @param {string} key - The key to sort by.
	 */
	const handleSort = (key: string) => {
		let direction: 'asc' | 'desc' = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
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
						<Box
							sx={{
								display: 'flex',
								gap: 5,
								justifyContent: {
									xs: 'center',
									md: 'flex-start',
								},
							}}
						>
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
						<CategoryModal refetch={refetch} />
						<SortButton onSort={handleSort} type="categorías" />
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} mb={10}>
				<Table
					columns={columns}
					rows={sortedCategoryRows}
					isLoading={isLoading}
					type="categorías"
					refetch={refetch}
				/>
			</Grid>

			<Grid item xs={12} mb={10}>
				<PieChartUsage
					labels={labels}
					values={soldByCategory}
					title={title}
				/>
			</Grid>
		</Grid>
	);
};

export default isAdmin(ManageCategoriesPage);
