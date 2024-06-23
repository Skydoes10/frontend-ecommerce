import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Product } from '@/interfaces';

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
			query: (product) => ({
				url: `product`,
				method: 'POST',
				body: product,
			}),
		}),

		updateProduct: builder.mutation({
			query: (product) => ({
				url: ``, //TODO definir la url
				method: 'PUT',
				body: product,
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
				url: ``, //TODO definir la url
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
				url: `/product/category/${category}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
		}),

		getProductsByGroup: builder.query<
			[Product[], number],
			{ page: number; limit: number; group: string }
		>({
			query: ({ page, limit, group }) => ({
				url: `/product/group/${group}?page=${page}&limit=${limit}`,
				method: 'GET',
			}),
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
} = productApi;