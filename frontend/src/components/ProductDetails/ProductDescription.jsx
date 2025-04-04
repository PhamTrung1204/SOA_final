// src/components/ProductDetails/ProductDescription.js

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useReadProductDetailBySlug } from "../../api/queries";
import { useParams } from "react-router-dom";

const ProductDescription = () => {
  const { slug } = useParams();
  const { data: productData } = useReadProductDetailBySlug(slug);
  
  const product = productData || null;
  const images = product?.imageURLs || []; // Retrieve images like in ProductImages

  return (
    <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Mô tả sản phẩm
        </Typography>
        {/* Product Description Text */}
        <Typography variant="body1" sx={{ mb: 4 }}>
          {product?.description || "Không có mô tả cho sản phẩm này."}
        </Typography>

        {/* Product Images Section */}
        {images.length > 0 ? (
          images.map((url, index) => (
            <Box
              key={index}
              component="img"
              src={url}
              alt={`Product Image ${index + 1}`}
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 2,
                mb: 4,
              }}
            />
          ))
        ) : (
          <Typography variant="body2">
            Không có hình ảnh cho sản phẩm này.
          </Typography>
        )}
      </Paper>
  );
};

export default ProductDescription;
