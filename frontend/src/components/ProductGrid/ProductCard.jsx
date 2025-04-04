import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
  Rating,
} from "@mui/material";

const ProductCard = ({ product, onClick }) => {
  if (!product) return null;

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.discountPrice) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <Card sx={{ width: "100%", border: "1px solid #1976d2" }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          sx={{ height: "250px", objectFit: "cover" }}
          image={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.title || "Product Image"}
        />
        <CardContent>
          <Box sx={{ textAlign: "center" }}>
            <Typography gutterBottom variant="h6">
              {product.title || "Unknown Title"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description || "No description available."}
            </Typography>
            {product.discountPrice && product.originalPrice && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  {`${product.originalPrice.toLocaleString()} VND`}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "red", fontWeight: "bold" }}
                >
                  {`${product.discountPrice.toLocaleString()} VND`}
                </Typography>
                {discountPercentage > 0 && (
                  <Typography
                    variant="body2"
                    sx={{ color: "green", fontWeight: "bold", mt: 1 }}
                  >
                    {`-${discountPercentage}%`}
                  </Typography>
                )}
              </Box>
            )}
            <Typography sx={{ mt: 1 }}>
              Status: {product.status || "N/A"}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Specs: {product.specs || "N/A"}
            </Typography>
            <Rating
              name="read-only"
              value={product.rating || 0}
              readOnly
              sx={{ mt: 1 }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
