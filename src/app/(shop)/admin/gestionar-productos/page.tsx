'use client';
import { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import {
	BarChartTopProducts,
	ProductModal,
	Search,
	SortButton,
	Table,
	isAdmin,
} from '@/components';
import { useGetAllProductsQuery } from '@/store';
import { Product } from '@/interfaces';


/**
 * Configuration for sorting.
 * @typedef {Object} SortConfig
 * @property {string} key - The key to sort by.
 * @property {'asc' | 'desc'} direction - The direction of the sort.
 */
interface SortConfig {
	key: string;
	direction: 'asc' | 'desc';
}

/**
 * Column configuration for the products table.
 */

const columns = [
	{ id: 'image', label: '', minWidth: 50, align: 'center' as const },
	{
		id: 'name',
		label: 'Nombre Producto',
		minWidth: 100,
		align: 'center' as const,
	},
	{
		id: 'type',
		label: 'Tipo',
		minWidth: 100,
		align: 'center' as const,
	},
	{
		id: 'category',
		label: 'Categoria',
		minWidth: 100,
		align: 'center' as const,
	},
	{ id: 'id', label: 'ID', minWidth: 170, align: 'center' as const },
	{
		id: 'price',
		label: 'Precio',
		minWidth: 100,
		align: 'center' as const,
		format: (value: number) => value.toLocaleString('en-US'),
	},
	{
		id: 'unities_sold',
		label: 'Unidades Vendidas',
		minWidth: 100,
		align: 'center' as const,
		format: (value: number) => value.toLocaleString('en-US'),
	},
	{
		id: 'stock',
		label: 'Stock',
		minWidth: 80,
		align: 'center' as const,
		format: (value: number) => value.toLocaleString('en-US'),
	},
	{ id: 'status', label: 'Estatus', minWidth: 100, align: 'center' as const },
	{
		id: 'creation_date',
		label: 'Fecha de Creación',
		minWidth: 80,
		align: 'center' as const,
	},
	{
		id: 'actions',
		label: 'Acciones',
		minWidth: 120,
		align: 'center' as const,
	},
];

/**
 * The ManageInventoryPage component allows admin users to manage products.
 *
 * @page
 * @returns {JSX.Element} The rendered ManageInventoryPage component.
 */
const ManageInventoryPage = () => {
	const { data, isLoading, refetch } = useGetAllProductsQuery({
		page: 1,
		limit: 100,
	});

	const products = (data?.[0] || []) as Product[];

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: '',
		direction: 'asc',
	});

	/**
	 * Formats a number to the local currency format.
	 *
	 * @param {number} value - The number to format.
	 * @returns {string} The formatted currency value.
	 */
	const formatCurrency = (value: number) => {
		const formattedValue = new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);

		return formattedValue.replace('COP', '').trim();
	};

	/**
	 * Formats a date string to the local date format.
	 *
	 * @param {string} dateString - The date string to format.
	 * @returns {string} The formatted date.
	 */
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-CO', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const productRows = products.map((product) => ({
		id: product.id,
		name: product.name,
		type: product.type,
		creation_date: formatDate(product.creation_date),
		price: formatCurrency(product.price),
		image: product.image_urls[0],
		category: product.category.name,
		status: product.status,
		stock: product.stock.stock,
		unities_sold: product.stock.unities_sold,
	}));

	const filteredProductRows = productRows.filter((row) =>
		row.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedProductRows = [...filteredProductRows].sort((a, b) => {
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
								Gestionar Productos
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
							alignItems: 'center',
							gap: 2,
							flexWrap: 'wrap',
						}}
					>
						<Search
							border
							onSearch={(value: string) => setSearchTerm(value)}
						/>
						<ProductModal refetch={refetch} />
						<SortButton onSort={handleSort} type="productos" />
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} mb={10}>
				<Table
					columns={columns}
					rows={sortedProductRows}
					isLoading={isLoading}
					type="productos"
					refetch={refetch}
				/>
			</Grid>

			<Grid item xs={12} mb={10}>
				<BarChartTopProducts products={products} />
			</Grid>
		</Grid>
	);
};

export default isAdmin(ManageInventoryPage);
