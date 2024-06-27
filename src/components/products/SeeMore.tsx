import Link from 'next/link';
import { Box, Typography, Link as MuiLink } from '@mui/material';

export const SeeMore = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				mb: 2,
				pt: 6,
			}}
		>
			<Typography variant="h4" sx={{ fontWeight: '700' }}>
				Más relevantes
			</Typography>
			<MuiLink
				href="/todos"
				component={Link}
				underline="hover"
				sx={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' }}
			>
				Ver todos
			</MuiLink>
		</Box>
	);
};
