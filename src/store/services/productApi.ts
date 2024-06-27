import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Product, Review } from '@/interfaces';

type ProductWithNumber = [Product[], number];

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.BACKEND_URL || 'http://localhost:3000',
	prepareHeaders: (headers, { getState }) => {
		return headers;
	},
});

export const productApi = createApi({
	reducerPath: 'productApi',
	baseQuery: baseQuery,
	endpoints: (builder) => ({
		createProduct: builder.mutation({
			query: (formData) => ({
				url: 'product',
				method: 'POST',
				body: formData,
			}),
		}),

		updateProduct: builder.mutation({
			query: ({ formData, id }) => ({
				url: `product/${id}`,
				method: 'PATCH',
				body: formData,
			}),
		}),

		deleteProduct: builder.mutation({
			query: (id) => ({
				url: `product/${id}`,
				method: 'DELETE',
			}),
		}),

		getAllProducts: builder.query<
			ProductWithNumber,
			{ page: number; limit: number }
		>({
			query: ({ page, limit }) => ({
				url: `product?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductByName: builder.query<Product, string>({
			query: (name) => ({
				url: `product/name/${name}`,
				method: 'GET',
			}),
		}),

		getProductById: builder.query<Product, string>({
			query: (id) => ({
				url: `product/${id}`,
				method: 'GET',
			}),
		}),

		getProductsByCategory: builder.query<
			[Product[], number],
			{ page: number; limit: number; category: string }
		>({
			query: ({ page, limit, category }) => ({
				url: `/product/filter/category/${category}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsByGroup: builder.query<
			[Product[], number],
			{ page: number; limit: number; group: string }
		>({
			query: ({ page, limit, group }) => ({
				url: `/product/filter/group/${group}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductReviews: builder.query<
			[Review[], number],
			{ page: number; limit: number; productId: string }
		>({
			query: ({ page, limit, productId }) => ({
				url: `/review/product/${productId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedByPrice: builder.query<
			[Product[], number],
			{ order: 'ASC' | 'DESC'; page: number; limit: number }
		>({
			query: ({ order, page, limit }) => ({
				url: `/product/filter/price/${order}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedByRating: builder.query<
			[Product[], number],
			{ order: 'ASC' | 'DESC'; page: number; limit: number }
		>({
			query: ({ order, page, limit }) => ({
				url: `/product/filter/rating/${order}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedBySoldUnits: builder.query<
			[Product[], number],
			{ order: 'ASC' | 'DESC'; page: number; limit: number }
		>({
			query: ({ order, page, limit }) => ({
				url: `/product/filter/sold_units/${order}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedByPriceForCategory: builder.query<
			[Product[], number],
			{
				categoryId: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ categoryId, order, page, limit }) => ({
				url: `/product/filter/price/${order}/${categoryId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedByRatingForCategory: builder.query<
			[Product[], number],
			{
				categoryId: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ categoryId, order, page, limit }) => ({
				url: `/product/filter/rating/${order}/${categoryId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedBySoldUnitsForCategory: builder.query<
			[Product[], number],
			{
				categoryId: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ categoryId, order, page, limit }) => ({
				url: `/product/filter/sold_units/${order}/${categoryId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedByPriceForGroup: builder.query<
			[Product[], number],
			{
				groupId: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ groupId, order, page, limit }) => ({
				url: `/product/filter/price/${order}/${groupId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedByRatingForGroup: builder.query<
			[Product[], number],
			{
				groupId: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ groupId, order, page, limit }) => ({
				url: `/product/filter/rating/${order}/${groupId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsSortedBySoldUnitsForGroup: builder.query<
			[Product[], number],
			{
				groupId: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ groupId, order, page, limit }) => ({
				url: `/product/filter/sold_units/${order}/${groupId}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),
		getProducts: builder.query<
			ProductWithNumber,
			{
				filter?: string;
				order?: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ filter, order, page, limit }) => {
				let url = `product?page=${page}&limit=${limit}`;
				if (filter) {
					switch (filter) {
						case 'price':
							url = `product/filter/price/${order}?page=${page}&limit=${limit}`;
							break;
						case 'rating':
							url = `product/filter/rating/${order}?page=${page}&limit=${limit}`;
							break;
						case 'sold_units':
							url = `product/filter/sold_units/${order}?page=${page}&limit=${limit}`;
							break;
						default:
							break;
					}
				}
				return {
					url,
					method: 'GET',
				};
			},
		}),

		GetProductsByGroupFilter: builder.query<
			ProductWithNumber,
			{
				groupId: string;
				filter: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ groupId, filter, order, page, limit }) => {
				let url = `product?page=${page}&limit=${limit}`;
				if (filter) {
					switch (filter) {
						case 'price':
							url = `product/filter/price/${order}/group/${groupId}?page=${page}&limit=${limit}`;
							break;
						case 'rating':
							url = `product/filter/rating/${order}/group/${groupId}?page=${page}&limit=${limit}`;
							break;
						case 'sold_units':
							url = `product/filter/sold_units/${order}/group/${groupId}?page=${page}&limit=${limit}`;
							break;
						default:
							break;
					}
				}
				return {
					url,
					method: 'GET',
				};
			},
		}),

		GetProductsByCategoryFilter: builder.query<
			ProductWithNumber,
			{
				categoryId: string;
				filter: string;
				order: 'ASC' | 'DESC';
				page: number;
				limit: number;
			}
		>({
			query: ({ categoryId, filter, order, page, limit }) => {
				let url = `product?page=${page}&limit=${limit}`;
				if (filter) {
					switch (filter) {
						case 'price':
							url = `product/filter/price/${order}/category/${categoryId}?page=${page}&limit=${limit}`;
							break;
						case 'rating':
							url = `product/filter/rating/${order}/category/${categoryId}?page=${page}&limit=${limit}`;
							break;
						case 'sold_units':
							url = `product/filter/sold_units/${order}/category/${categoryId}?page=${page}&limit=${limit}`;
							break;
						default:
							break;
					}
				}
				return {
					url,
					method: 'GET',
				};
			},
		}),
	}),
});

export const {
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useGetAllProductsQuery,
	useGetProductByNameQuery,
	useGetProductByIdQuery,
	useGetProductsByCategoryQuery,
	useGetProductsByGroupQuery,
	useGetProductReviewsQuery,
	useGetProductsSortedByPriceQuery,
	useGetProductsSortedByRatingQuery,
	useGetProductsSortedBySoldUnitsQuery,
	useGetProductsSortedByPriceForCategoryQuery,
	useGetProductsSortedByRatingForCategoryQuery,
	useGetProductsSortedBySoldUnitsForCategoryQuery,
	useGetProductsSortedByPriceForGroupQuery,
	useGetProductsSortedByRatingForGroupQuery,
	useGetProductsSortedBySoldUnitsForGroupQuery,
	useGetProductsQuery,
	useGetProductsByGroupFilterQuery,
	useGetProductsByCategoryFilterQuery,
} = productApi;
