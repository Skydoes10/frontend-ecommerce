'use client';
import { useState } from 'react';
import { Box, Pagination, Skeleton, Typography } from '@mui/material';

import { Comment } from '@/components';
import { Review } from '@/interfaces';

interface Props {
	comments: Review[];
}

export const CommentsSection = ({ comments }: Props) => {
	const [page, setPage] = useState(1);
	const commentsPerPage = 5;
	const totalPages = Math.ceil(comments.length / commentsPerPage);

	const handleChangePage = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

	const displayedComments = comments.slice(
		(page - 1) * commentsPerPage,
		page * commentsPerPage
	);

	return (
		<Box sx={{ my: 10 }}>
			<Typography
				variant="h4"
				component="div"
				sx={{ mb: 3, fontWeight: 'bold' }}
			>
				Comentarios
			</Typography>
			{displayedComments.length > 0 ? (
				displayedComments.map((comment, index) => (
					<Comment key={index} comment={comment} />
				))
			) : (
				<Typography variant="body1" component="div">
					No hay comentarios :(
				</Typography>
			)}
			<Pagination
				count={totalPages}
				page={page}
				onChange={handleChangePage}
				sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
			/>
		</Box>
	);
};
