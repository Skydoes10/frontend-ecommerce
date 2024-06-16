'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Box,
	Grid,
	TextField,
	Button,
	Typography,
	Alert,
	CircularProgress,
	IconButton,
	InputAdornment,
} from '@mui/material';

import { RegisterSchema } from '@/schemas';
import { useRegisterUserMutation } from '@/store';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const RegisterForm = () => {
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			birthDate: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const router = useRouter();

	const [successfully, setSuccessfully] = useState('');
	const [errorMap, setErrorMap] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const [registerUser, { data, error }] = useRegisterUserMutation();

	async function onSubmit(data: z.infer<typeof RegisterSchema>) {
		let errorocurred = false;
		await registerUser(data)
			.unwrap()
			.catch((error) => {
				setErrorMap('Ocurrió un error al registrar el usuario');
				errorocurred = true;
			});

		if (!errorocurred && data) {
			setErrorMap('');
			setSuccessfully('Usuario registrado correctamente');
			router.push('/');
		}
	}

	return (
		<Box>
			<Typography
				component="h1"
				variant="h5"
				textAlign="center"
				gutterBottom
				sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2 }}
			>
				Registrarse
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Controller
							name="firstName"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nombre"
									variant="outlined"
									fullWidth
									error={!!errors.firstName}
									helperText={errors.firstName?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							name="lastName"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Apellido"
									variant="outlined"
									fullWidth
									error={!!errors.lastName}
									helperText={errors.lastName?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							name="birthDate"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Fecha de nacimiento"
									type="date"
									variant="outlined"
									fullWidth
									InputLabelProps={{ shrink: true }}
									error={!!errors.birthDate}
									helperText={errors.birthDate?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									variant="outlined"
									fullWidth
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Contraseña"
									type={passwordVisible ? 'text' : 'password'}
									variant="outlined"
									fullWidth
									error={!!errors.password}
									helperText={errors.password?.message}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() =>
														setPasswordVisible(
															!passwordVisible
														)
													}
												>
													{passwordVisible ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							name="confirmPassword"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Confirmar contraseña"
									type={
										confirmPasswordVisible
											? 'text'
											: 'password'
									}
									variant="outlined"
									fullWidth
									error={!!errors.confirmPassword}
									helperText={errors.confirmPassword?.message}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() =>
														setConfirmPasswordVisible(
															!confirmPasswordVisible
														)
													}
												>
													{confirmPasswordVisible ? (
														<VisibilityOff />
													) : (
														<Visibility />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						{successfully && (
							<Alert severity="success" sx={{ mb: 2 }}>
								{successfully}
							</Alert>
						)}
						{errorMap && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{errorMap}
							</Alert>
						)}
					</Grid>
					<Grid item xs={12}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={!isDirty || isSubmitting}
							sx={{
								height: 48,
								fontSize: '1rem',
								fontWeight: 'bold',
							}}
							endIcon={
								isSubmitting && <CircularProgress size={20} />
							}
						>
							Registrarse
						</Button>
					</Grid>
				</Grid>
			</form>
			<Typography
				variant="body2"
				textAlign="center"
				mt={2}
				sx={{ color: 'text.secondary' }}
			>
				¿Ya tienes una cuenta?{' '}
				<Link
					href="/iniciar-sesion"
					style={{
						color: '#377AB8',
						textDecoration: 'none',
						fontWeight: 'bold',
					}}
				>
					Iniciar sesión
				</Link>
			</Typography>
		</Box>
	);
};