import { z } from 'zod';

export const RegisterSchema = z
	.object({
		first_name: z
			.string()
			.min(3, {
				message: 'El nombre debe tener al menos 3 caracteres',
			})
			.max(30, { message: 'El nombre debe tener máximo 30 caracteres' }),
		last_name: z
			.string()
			.min(3, {
				message: 'El apellido debe tener al menos 3 caracteres',
			})
			.max(30, {
				message: 'El apellido debe tener máximo 30 caracteres',
			}),
		// birthDate: z.date().refine((date) => {
		//     const now = new Date();
		//     const age = now.getFullYear() - date.getFullYear();
		//     return age >= 18;
		// }, { message: 'Debes ser mayor de edad para registrarte' }),
		birth_date: z.string().min(8, {
			message:
				'Debes ingresar una fecha de nacimiento válida (dd/mm/aaaa)',
		}),
		email: z.string().email({
			message: 'Debes ingresar un correo válido',
		}),
		password: z
			.string()
			.min(6, {
				message: 'La contraseña debe tener al menos 6 caracteres',
			})
			.regex(/[a-z]/, {
				message:
					'La contraseña debe tener al menos una letra minúscula',
			})
			.regex(/[A-Z]/, {
				message:
					'La contraseña debe tener al menos una letra mayúscula',
			})
			.regex(/[0-9]/, {
				message: 'La contraseña debe tener al menos un número',
			}),
		confirmPassword: z.string(),
		role: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Las contraseñas no coinciden',
				path: ['confirmPassword'],
			});
		}
	});
