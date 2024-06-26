'use client';
import { useEffect, useState } from 'react';
import { Box, Pagination } from '@mui/material';

import { Category, Product } from '@/interfaces';
import {
	Banner,
	Breadcrumb,
	CategorySwiper,
	LogoLoader,
	ProductGrid,
	Filters,
} from '@/components';
import {
	useGetGroupByNameQuery,
	useGetProductsByGroupFilterQuery,
} from '@/store';
import NotFoundPage from '../not-found';

/**
 * Props for the GroupPage component.
 * 
 * @typedef {Object} Props
 * @property {Object} params - The route parameters.
 * @property {string} params.grupo - The group name.
 */
interface Props {
	params: {
		grupo: string;
	};
}

/**
 * GroupPage component displays a list of products for a specific group.
 * It includes a banner, breadcrumb navigation, category swiper, filters, and a paginated product grid.
 * 
 * @page
 * @example
 * return (
 *   <GroupPage params={{ grupo: 'electronics' }} />
 * )
 */
const GroupPage = ({ params }: Props) => {
	// Format the group name to be capitalized and replace dashes with spaces
	let group = params.grupo[0].toUpperCase() + params.grupo.slice(1);
	group = group.replace(/-/g, ' ');

	const [objects, setObjects] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [count, setCount] = useState(0);
	const [image, setImage] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [groupId, setGroupId] = useState<string>('');
	const [selectedFilter, setSelectedFilter] = useState('Más vendidos');
	const [filterParams, setFilterParams] = useState({
		filter: 'rating',
		order: 'DESC' as 'ASC' | 'DESC',
		page: 1,
		limit: 12,
	});

	const {
		data: groupsData,
		error: groupsError,
		isLoading: groupLoading,
	} = useGetGroupByNameQuery(group);
	const {
		data: productsData,
		error: productsError,
		isLoading: productsLoading,
	} = useGetProductsByGroupFilterQuery({ groupId: groupId, ...filterParams });

	useEffect(() => {
		if (productsData) {
			const [products, totalCount] = productsData;
			if (Array.isArray(products)) {
				setObjects(products);
				setCount(totalCount);
			}
		} else if (productsError) {
			console.error('Error fetching products:', productsError);
		}
	}, [productsData, productsError]);

	useEffect(() => {
		if (groupsData) {
			setCategories(groupsData.categories);
			setName(groupsData.name);
			setImage(groupsData.image_url);
			setGroupId(groupsData.id);
		} else if (groupsError) {
			console.error('Error fetching group:', groupsError);
		}
	}, [groupsData, groupsError]);

	if (productsLoading || groupLoading) {
		return <LogoLoader />;
	}

	if (!groupsData || groupsError) {
		return <NotFoundPage />;
	}

	/**
	 * Handles the filter selection to update the product list.
	 * 
	 * @param {string} filter - The selected filter.
	 */
	const handleSelectFilter = (filter: string) => {
		switch (filter) {
			case 'Menos costosos':
				setFilterParams({
					filter: 'price',
					order: 'ASC',
					page: 1,
					limit: 12,
				});
				break;
			case 'Más costosos':
				setFilterParams({
					filter: 'price',
					order: 'DESC',
					page: 1,
					limit: 12,
				});
				break;
			case 'Mejor votados':
				setFilterParams({
					filter: 'rating',
					order: 'DESC',
					page: 1,
					limit: 12,
				});
				break;
			case 'Peor votados':
				setFilterParams({
					filter: 'rating',
					order: 'ASC',
					page: 1,
					limit: 12,
				});
				break;
			case 'Más vendidos':
				setFilterParams({
					filter: 'sold_units',
					order: 'DESC',
					page: 1,
					limit: 12,
				});
				break;
			case 'Menos vendidos':
				setFilterParams({
					filter: 'sold_units',
					order: 'ASC',
					page: 1,
					limit: 12,
				});
				break;
			default:
				setFilterParams({
					filter: 'sold_units',
					order: 'DESC',
					page: 1,
					limit: 12,
				});
				break;
		}
		setSelectedFilter(filter);
	};

	/**
	 * Handles the page change for pagination.
	 * 
	 * @param {React.ChangeEvent<unknown>} event - The change event.
	 * @param {number} value - The new page number.
	 */
	const handlePageChange = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setFilterParams((prevParams) => ({ ...prevParams, page: value }));
	};

	return (
		<>
			<Banner image={image} title={name} />
			<Box sx={{ flex: 1, px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
				<Breadcrumb />
				<CategorySwiper categories={categories} />
				<Filters onSelectFilter={handleSelectFilter} />
				<ProductGrid products={objects} />
				<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
					<Pagination
						count={Math.ceil(count / filterParams.limit)}
						page={filterParams.page}
						onChange={handlePageChange}
						color="primary"
					/>
				</Box>
			</Box>
		</>
	);
};

export default GroupPage;
