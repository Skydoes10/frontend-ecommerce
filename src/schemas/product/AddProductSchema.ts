import { z } from 'zod';

const imageFileSchema = z.union([
	z
		.instanceof(File)
		.refine((file) => file.size > 0, {
			message: 'El archivo no debe estar vacío',
		})
		.refine(
			(file) =>
				['image/jpg', 'image/jpeg', 'image/png'].includes(file.type),
			{
				message: 'El archivo debe ser de tipo JPG, JPEG o PNG',
			}
		)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: 'El archivo no debe ser mayor a 5MB',
		}),
	z.string().url({ message: 'Debe ser una URL válida' }),
]);

export const AddProductSchema = z.object({
	name: z.string().min(3, {
		message: 'El nombre debe tener al menos 3 caracteres',
	}),
	price: z
		.string({
			message: 'El precio debe ser un número',
		})
		.min(1, {
			message: 'El precio debe ser mayor a 0',
		})
		.transform((value) => parseFloat(value)),
	stock: z
		.string({
			message: 'El stock debe ser un número',
		})
		.min(1, {
			message: 'El stock debe ser mayor a 0',
		})
		.transform((value) => parseInt(value)),
	description: z.string().min(10, {
		message: 'La descripción debe tener al menos 10 caracteres',
	}),
	category: z.string().min(1, {
		message: 'Debes seleccionar una categoría',
	}),
	product_images: z
		.array(imageFileSchema)
		.min(1, {
			message: 'Debes agregar al menos una imagen',
		})
		.max(4, {
			message: 'No puedes agregar más de 4 imágenes',
		}),
	type: z.string().optional(),
});
