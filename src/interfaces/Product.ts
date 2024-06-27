import { Category } from './Category';
import { Review } from './Review';

export interface Stock {
	id: string;
	stock: number;
	unities_sold: number | null;
}

export interface Product {
	id: string;
	name: string;
	type: string;
	creation_date: string;
	description: string;
	price: number;
	image_urls: string[];
	category: Category;
	status: string;
	stock: Stock;
	rate: number;
	reviews: Review[];
}
