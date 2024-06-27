'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
	Button,
	DialogActions,
	TextField,
	IconButton,
	Box,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Grid,
	styled,
	Card,
	InputAdornment,
	OutlinedInput,
	Tooltip,
	useTheme,
	CircularProgress,
	Typography,
	Snackbar,
	Alert,
} from '@mui/material';
import { AddPhotoAlternateOutlined, DeleteOutline } from '@mui/icons-material';
import { Controller, set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { AddProductSchema } from '@/schemas';
import {
	useCreateProductMutation,
	useUpdateProductMutation,
	useGetAllCategoriesQuery,
} from '@/store';
import { Product } from '@/interfaces';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

interface Props {
	refetch: () => void;
	product?: Product;
}

export const ProductForm = ({ refetch, product }: Props) => {
	const theme = useTheme();

	const [uploadedImages, setUploadedImages] = useState<(File | string)[]>([]);
	const [imageError, setImageError] = useState<string | null>(null);

	const { data } = useGetAllCategoriesQuery({ page: 1, limit: 10 });
	const categories = data?.[0] || [];

	const [createProduct] = useCreateProductMutation();
	const [updateProduct] = useUpdateProductMutation();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'error' | 'success'
	>('success');

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof AddProductSchema>>({
		resolver: zodResolver(AddProductSchema),
		defaultValues: product
			? {
					name: product.name,
					price: product.price,
					stock: product.stock.stock,
					description: product.description,
					category: product.category.name,
					product_images: [],
					type: product.type,
			  }
			: {
					name: '',
					price: 0,
					stock: 0,
					description: '',
					category: '',
					product_images: [],
					type: '',
			  },
	});

	useEffect(() => {
		if (product) {
			setValue('name', product.name);
			setValue('price', product.price);
			setValue('stock', product.stock.stock);
			setValue('description', product.description);
			setValue('category', product.category.name);
			setValue('type', product.type ?? '');
			setValue('product_images', product.image_urls);
			setUploadedImages(product.image_urls);
		}
	}, [product, setValue]);

	async function onSubmit(data: z.infer<typeof AddProductSchema>) {
		const formData = new FormData();

		formData.append('name', data.name);
		formData.append('price', data.price.toString());
		formData.append('stock', data.stock.toString());
		formData.append('description', data.description);
		formData.append('category', data.category);
		formData.append('type', data.type ?? '');

		uploadedImages.forEach((file) => {
			if (typeof file === 'string') {
				formData.append('existing_images', file);
			} else {
				formData.append('product_images', file);
			}
		});

		let errorOccurred = false;

		if (product) {
			await updateProduct({
				formData,
				id: product.id,
			})
				.unwrap()
				.catch((error) => {
					setSnackbarMessage(
						'Ocurrió un error al editar el producto'
					);
					setSnackbarSeverity('error');
					setOpenSnackbar(true);
					errorOccurred = true;
				});

			if (!errorOccurred && data) {
				setSnackbarMessage('Producto editado exitosamente');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);
				refetch();
			}
		} else {
			await createProduct(formData)
				.unwrap()
				.catch((error) => {
					setSnackbarMessage('Ocurrió un error al crear el producto');
					setSnackbarSeverity('error');
					setOpenSnackbar(true);
					errorOccurred = true;
				});

			if (!errorOccurred && data) {
				setSnackbarMessage('Producto creado exitosamente');
				setSnackbarSeverity('success');
				setOpenSnackbar(true);
				refetch();
			}
		}
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const files = Array.from(event.target.files);
			if (uploadedImages.length + files.length > 4) {
				setImageError('No puedes agregar más de 4 imágenes');
				return;
			}
			setImageError(null);
			setUploadedImages((prevImages) => [...prevImages, ...files]);
			setValue(
				'product_images',
				[...uploadedImages, ...files].filter(
					(file) => typeof file !== 'string'
				) as File[],
				{
					shouldValidate: true,
				}
			);
		}
	};

	const handleDeleteImage = (index: number) => {
		const updatedImages = uploadedImages.filter((_, i) => i !== index);
		setUploadedImages(updatedImages);
		setValue(
			'product_images',
			updatedImages.filter((file) => typeof file !== 'string') as File[],
			{ shouldValidate: true }
		);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={4} px={4} py={2}>
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 4,
								mt: 2,
							}}
						>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Nombre"
										variant="outlined"
										fullWidth
										error={!!errors.name}
										helperText={errors.name?.message}
										sx={{
											'& label': {
												color: 'text.primary',
											},
											'& .MuiOutlinedInput-root': {
												'& fieldset': {
													borderColor: 'gray',
												},
											},
										}}
									/>
								)}
							/>
							<Controller
								name="price"
								control={control}
								render={({ field }) => (
									<FormControl
										fullWidth
										sx={{
											'& label': {
												color: 'text.primary',
											},
											'& .MuiOutlinedInput-root': {
												'& fieldset': {
													borderColor: 'gray',
												},
											},
										}}
									>
										<InputLabel
											id="precio"
											htmlFor="category"
										>
											Precio
										</InputLabel>
										<OutlinedInput
											{...field}
											id="precio"
											fullWidth
											label="Precio"
											type="number"
											error={!!errors.price}
											startAdornment={
												<InputAdornment
													position="start"
													sx={{
														'& p': {
															color: 'black',
														},
													}}
												>
													$
												</InputAdornment>
											}
											inputProps={{
												min: 1,
												step: 0.01,
											}}
										/>
										{errors.price && (
											<Box
												sx={{
													color: 'error.main',
													fontSize: '0.75rem',
													pt: 0.5,
													pl: 2,
												}}
											>
												{errors.price.message}
											</Box>
										)}
									</FormControl>
								)}
							/>

							<Controller
								name="stock"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Cantidad en inventario"
										variant="outlined"
										type="number"
										fullWidth
										error={!!errors.stock}
										helperText={errors.stock?.message}
										sx={{
											'& label': {
												color: 'text.primary',
											},
											'& .MuiOutlinedInput-root': {
												'& fieldset': {
													borderColor: 'gray',
												},
											},
										}}
										InputProps={{
											inputProps: { min: 1 },
											onKeyDown: (e) => {
												if (
													e.key === '-' ||
													e.key === 'e' ||
													e.key === 'E'
												) {
													e.preventDefault();
												}
											},
										}}
									/>
								)}
							/>

							<Controller
								name="category"
								control={control}
								render={({ field }) => (
									<FormControl
										fullWidth
										sx={{
											'& label': {
												color: 'text.primary',
											},
											'& .MuiOutlinedInput-root': {
												'& fieldset': {
													borderColor: 'gray',
												},
											},
										}}
									>
										<InputLabel id="category-label">
											Categorías
										</InputLabel>
										<Select
											{...field}
											error={!!errors.category}
											labelId="category-label"
											id="category"
											label="Categoría"
										>
											{categories?.length ?? 0 > 0 ? (
												categories?.map((category) => (
													<MenuItem
														key={category.name}
														value={category.name}
													>
														{category.name}
													</MenuItem>
												))
											) : (
												<MenuItem value="" disabled>
													No hay categorías
												</MenuItem>
											)}
										</Select>
										{errors.category && (
											<Box
												component="span"
												sx={{
													color: 'error.main',
													fontSize: '0.75rem',
													pt: 0.5,
													pl: 2,
												}}
											>
												{errors.category.message}
											</Box>
										)}
									</FormControl>
								)}
							/>

							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Tipo"
										variant="outlined"
										fullWidth
										error={!!errors.type}
										helperText={errors.type?.message}
										sx={{
											'& label': {
												color: 'text.primary',
											},
											'& .MuiOutlinedInput-root': {
												'& fieldset': {
													borderColor: 'gray',
												},
											},
										}}
									/>
								)}
							/>
						</Box>
					</Grid>

					<Grid item xs={12} md={6}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								gap: 2,
								mt: 2,
								[theme.breakpoints.down('sm')]: {
									flexDirection: 'row',
									flexWrap: 'wrap',
								},
							}}
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									gap: 2,
									[theme.breakpoints.down('sm')]: {
										flexDirection: 'row',
										flexWrap: 'wrap',
									},
								}}
							>
								<Box
									sx={{
										display: 'block',
										flexDirection: 'column',
										alignItems: 'center',
										gap: 4,
										[theme.breakpoints.down('sm')]: {
											display: 'flex',
											flexDirection: 'row',
										},
									}}
								>
									{uploadedImages
										.slice(1)
										.map((image, index) => (
											<Card
												key={index}
												sx={{
													margin: 1,
												}}
											>
												{typeof image === 'string' ? (
													<Image
														src={image}
														alt="Product"
														width={100}
														height={100}
														style={{
															objectFit: 'cover',
														}}
													/>
												) : (
													<Image
														src={URL.createObjectURL(
															image
														)}
														alt="Product"
														width={100}
														height={100}
														style={{
															objectFit: 'cover',
														}}
													/>
												)}
											</Card>
										))}
								</Box>

								<Card sx={{ borderRadius: '8px' }}>
									{uploadedImages.length > 0 && (
										<Image
											src={
												typeof uploadedImages[0] ===
												'string'
													? uploadedImages[0]
													: URL.createObjectURL(
															uploadedImages[0]
													  )
											}
											alt="Product"
											width={200}
											height={200}
											style={{
												borderRadius: '8px',
												width: '100%',
												height: 'auto',
											}}
										/>
									)}
								</Card>
							</Box>
							<Box
								sx={{
									display: 'flex',
									gap: 2,
									justifyContent: 'center',
								}}
							>
								<Tooltip title="Eliminar imagen" arrow>
									<IconButton
										onClick={() =>
											handleDeleteImage(
												uploadedImages.length - 1
											)
										}
										sx={{ color: '#b71c1c' }}
									>
										<DeleteOutline />
									</IconButton>
								</Tooltip>

								<Button
									component="label"
									role={undefined}
									variant="contained"
									size="small"
									tabIndex={-1}
									startIcon={<AddPhotoAlternateOutlined />}
									sx={{
										border: '1px solid gray',
										borderRadius: '0.5rem',
										fontSize: '0.8rem',
										backgroundColor: 'secondary.main',
										color: 'primary.main',
										textTransform: 'none',
										'&:hover': {
											color: 'secondary.main',
										},
									}}
								>
									Añadir imagen
									<VisuallyHiddenInput
										type="file"
										accept="image/*"
										multiple
										onChange={handleImageChange}
									/>
								</Button>
							</Box>
							{imageError && (
								<Typography
									sx={{
										display: 'flex',
										justifyContent: 'center',
										color: 'error.main',
										fontSize: '0.75rem',
										pt: 0.5,
										pl: 2,
									}}
								>
									{imageError}
								</Typography>
							)}
							{errors.product_images && (
								<Typography
									sx={{
										display: 'flex',
										justifyContent: 'center',
										color: 'error.main',
										fontSize: '0.75rem',
										pt: 0.5,
										pl: 2,
									}}
								>
									{errors.product_images.message}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									error={!!errors.description}
									helperText={errors.description?.message}
									label="Descripción"
									variant="outlined"
									fullWidth
									multiline
									rows={4}
									sx={{
										'& label': {
											color: 'text.primary',
										},
										'& .MuiOutlinedInput-root': {
											'& fieldset': {
												borderColor: 'gray',
											},
										},
									}}
								/>
							)}
						/>
					</Grid>
				</Grid>
				<DialogActions
					sx={{
						display: 'flex',
						justifyContent: 'center',
						pr: 4,
						py: 2,
					}}
				>
					<Button
						type="submit"
						variant="contained"
						sx={{
							borderRadius: '0.5rem',
							width: '50%',
							py: 1,
						}}
						disabled={isSubmitting || !isDirty}
						endIcon={isSubmitting && <CircularProgress size={20} />}
					>
						{product ? 'Actualizar producto' : 'Añadir producto'}
					</Button>
				</DialogActions>
			</form>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					sx={{ width: '100%' }}
					variant="filled"
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</div>
	);
};
