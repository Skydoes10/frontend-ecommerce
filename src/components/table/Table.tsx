'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
	Table as MuiTable,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Box,
	Skeleton,
} from '@mui/material';

import { DeleteButton, ProductModal } from '@/components';
import {
	useDeleteCategoryMutation,
	useDeleteGroupMutation,
	useDeleteProductMutation,
} from '@/store';

interface Column {
	id: string;
	label: string;
	minWidth?: number;
	align?: 'right' | 'left' | 'center';
	format?: (value: any) => string;
}

interface Props {
	columns: Column[];
	rows: any[];
	isLoading: boolean;
	type: string;
	refetch: () => void;
}

export const Table = ({ columns, rows, isLoading, type, refetch }: Props) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	const [deleteProduct] = useDeleteProductMutation();
	const [deleteCategory] = useDeleteCategoryMutation();
	const [deleteGroup] = useDeleteGroupMutation();

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const getDeleteMutation = () => {
		if (type === 'productos') return deleteProduct;
		if (type === 'categorías') return deleteCategory;
		return deleteGroup;
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
				<MuiTable stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
									sx={{
										whiteSpace: 'nowrap',
										color: 'text.secondary',
										fontWeight: 'bold',
										fontSize: '1rem',
										backgroundColor: 'primary.main',
									}}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							[...Array(10)].map((_, index) => (
								<TableRow key={index}>
									{columns.map((column) => (
										<TableCell key={column.id}>
											<Skeleton
												variant="rectangular"
												width="100%"
												height={20}
											/>
										</TableCell>
									))}
								</TableRow>
							))
						) : rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									align="center"
								>
									No hay {type}
								</TableCell>
							</TableRow>
						) : (
							rows
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, rowIndex) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={rowIndex}
										>
											{columns.map((column) => {
												const value = row[column.id];
												if (column.id === 'actions') {
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															<ProductModal
																refetch={
																	refetch
																}
																productId={
																	row.id
																}
															/>

															<DeleteButton
																id={row.id}
																item={row.name}
																deleteMutation={getDeleteMutation()}
																refetch={
																	refetch
																}
															/>
														</TableCell>
													);
												} else if (
													column.id === 'image'
												) {
													return (
														<TableCell
															key={column.id}
															align={
																column.align
																	? column.align
																	: 'center'
															}
														>
															<Box
																style={{
																	width: '50px',
																	height: '50px',
																	position:
																		'relative',
																}}
															>
																<Image
																	src={`${value}`}
																	alt="product"
																	sizes="50px"
																	style={{
																		objectFit:
																			'cover',
																	}}
																	fill
																/>
															</Box>
														</TableCell>
													);
												}
												return (
													<TableCell
														key={column.id}
														align={column.align}
														sx={{
															color: 'text.primary',
															fontSize: '1rem',
														}}
													>
														{column.format &&
														typeof value ===
															'number'
															? column.format(
																	value
															  )
															: value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})
						)}
					</TableBody>
				</MuiTable>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[20, 50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Filas por página:"
				labelDisplayedRows={({ from, to, count }) =>
					`${from}-${to} de ${count}`
				}
				sx={{}}
			/>
		</Paper>
	);
};
