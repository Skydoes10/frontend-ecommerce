'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Footer, Navbar } from '@/components';


/**
 * NotFoundPage component displays a 404 error page with a "Go Back" button.
 * It includes a navigation bar at the top and a footer at the bottom.
 * 
 * @component
 * @returns {JSX.Element} The 404 error page component.
 */
const NotFoundPage = () => {
	const router = useRouter();

	/**
	 * Redirects the user to the home page.
	 */
	const handleGoBack = () => {
		router.push('/');
	};

	return (
		<>
			<Navbar />

			<Container
				component={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
					textAlign: 'center',
					padding: 4,
				}}
			>
				<Box
					component={motion.div}
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{
						type: 'spring',
						stiffness: 260,
						damping: 20,
					}}
					sx={{
						position: 'relative',
						width: 400,
						height: 300,
						mb: 4,
					}}
				>
					<Image
						src={'/not-found/not-found.png'}
						alt="Not Found"
						layout="fill"
						objectFit="cover"
						priority
					/>
				</Box>
				<Typography
					component={motion.h1}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					variant="h1"
					sx={{ fontSize: '4rem', fontWeight: 'bold' }}
				>
					Oh no!
				</Typography>
				<Typography
					component={motion.h2}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					variant="h6"
					sx={{ mb: 3 }}
				>
					Parece que te has perdido
				</Typography>
				<Button
					component={motion.button}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					variant="contained"
					color="primary"
					onClick={handleGoBack}
					sx={{
						textTransform: 'none',
						fontSize: '1rem',
						padding: '10px 20px',
						borderRadius: '8px',
						boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
					}}
				>
					Volver a la página principal
				</Button>
			</Container>

			<Footer />
		</>
	);
};

export default NotFoundPage;
