import React from "react";
import { Grid, Grid2 } from "@mui/material";
import ProductCard from "./ProductCard";
import PropTypes from "prop-types";

const ProductGrid = ({ products }) => {
  return (
    <Grid2 container spacing={2} justifyContent="center">
      {products.map((product) => (
        <Grid2 item xs={12} sm={6} md={3} key={product.id}>
          <ProductCard
            product={product}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

ProductGrid.propTypes={
  products: PropTypes.array,
}

export default ProductGrid;
