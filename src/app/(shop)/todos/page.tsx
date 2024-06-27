'use client';
import { Box, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { Product } from '@/interfaces';
import { Filters, LogoLoader, ProductGrid, Banner} from '@/components';
import { useGetProductsQuery } from '@/store';

export const AllProducts = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(16);
	const [products, setProducts] = useState<Product[]>([]);
	const [countProducts, setCountProducts] = useState(0);
	const [selectedFilter, setSelectedFilter] = useState('Mejor votados');
	const [filterParams, setFilterParams] = useState({ filter: 'rating', order: 'DESC' as 'ASC' | 'DESC' , page: 1, limit: 16});

	const { data: productsData, error: productsError, isLoading: productsLoading } = useGetProductsQuery({ ...filterParams });

	useEffect(() => {
		if (
			productsData &&
			Array.isArray(productsData) &&
			productsData.length === 2
		) {
			const [objectsList, totalCount] = productsData;
			if (Array.isArray(objectsList)) {
				setProducts(objectsList);
				setCountProducts(totalCount);
			}
		} else if (productsError) {
			console.error('Error fetching products:', productsError);
		}
	}, [productsData, productsError]);

	const handleSelectFilter = (filter: string) => {
		switch (filter) {
			case 'Menos costosos':
				setFilterParams({ filter: 'price', order: 'ASC', page: 1, limit: 16});
				break;
			case 'Más costosos':
				setFilterParams({ filter: 'price', order: 'DESC', page: 1, limit: 16 });
				break;
			case 'Mejor votados':
				setFilterParams({ filter: 'rating', order: 'DESC', page: 1, limit: 16 });
				break;
			case 'Peor votados':
				setFilterParams({ filter: 'rating', order: 'ASC', page: 1, limit: 16 });
				break;
			case 'Más vendidos':
				setFilterParams({ filter: 'sold_units', order: 'DESC', page: 1, limit: 16 });
				break;
			case 'Menos vendidos':
				setFilterParams({ filter: 'sold_units', order: 'ASC', page: 1, limit: 16 });
				break;
			default:
				setFilterParams({ filter: '', order: 'DESC' , page: 1, limit: 16});
				break;
		}
		setSelectedFilter(filter);
	};
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	if (productsLoading) {
		return <LogoLoader />;
	}

	return (
		<Box>
			{/* <Box sx={{ display: 'flex', justuifyContent: 'center', textAlign: 'center', my: 6 }}>
				<Typography variant="h3" sx={{ fontWeight: 'bold' }}>
					{'Todos Nuestros Productos'}
				</Typography>
			</Box> */}
			<Banner image={"https://fitnest-bucket.s3.amazonaws.com/pexels-leonardho-1552242.jpg"} title={"Todos Nuestros Productos"} />
			<Box
				sx={{
					mx:4
				}}
			>
				<Filters onSelectFilter={handleSelectFilter} />
				<ProductGrid products={products} />
				<Box sx={{ display: 'flex', justifyContent: 'center', my: 4, mx: 3 }}>
					<Pagination
						count={Math.ceil(countProducts / limit)}
						page={page}
						onChange={handlePageChange}
						color="primary"
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default AllProducts;
