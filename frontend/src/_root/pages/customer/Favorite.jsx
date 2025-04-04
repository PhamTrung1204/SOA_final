import React from 'react';
import GridProduct from './GridProduct';
import { Container, Typography } from '@mui/material';

const Favorite = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 4 }}>Sản phẩm yêu thích</Typography>
      <GridProduct />
    </Container>
  )
}

export default Favorite
