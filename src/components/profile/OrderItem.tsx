'use client'
import React from 'react';
import { Box, Card, CardContent, Link as MuiLink, Typography } from '@mui/material';
import NextLink from 'next/link';

interface OrderItemProps {
  image: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  productId: string;
}

const OrderItem: React.FC<OrderItemProps> = ({ image, title, description, quantity, price, productId }) => {

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, width: '45%', minWidth: '300px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '16px' }}>
      <Box component="img" sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '10px' }} src={image} alt={title} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2, p: 0 }}>
        <NextLink href={`/producto/${productId}`} passHref>
          <MuiLink sx={{ textDecoration: 'none' }}>
            <Typography variant="h6" component="div" sx={{ color: '#282828', fontWeight: 'bold' }}>
              {title.length > 30 ? `${title.substring(0, 30)}...` : title}
            </Typography>
          </MuiLink>
        </NextLink>
        <Typography variant="body2" color="gray">{description}</Typography>
        <Typography variant="body2" color="gray">x {quantity}</Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 'auto' }}>
        <Typography component="div" sx={{ color: '#4C4C4C', fontWeight: 'bold' }}>${price.toLocaleString()}</Typography>
      </Box>
    </Card>
  );
};

export default OrderItem;
