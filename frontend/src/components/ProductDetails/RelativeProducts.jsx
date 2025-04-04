import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, CircularProgress, Container } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Slider from "react-slick";
import { useReadAllProduct, useReadAllTagAdmin, useReadProductByTag } from "../../api/queries";
import { Link } from "react-router-dom";
import ProductCard from "../Homepage/ProductCard";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const RelativeProducts = () => {
  const [favorites, setFavorites] = useState({});

  const { data: products, isLoading: isLoadingProd } = useReadAllProduct();

  const handleToggleFavorite = (product) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [product._id]: !prevFavorites[product._id],
    }));
  };

  // Nếu đang tải sản phẩm hoặc tag
  if (isLoadingProd) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sản phẩm liên quan
        </Typography>
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={favorites[product.id]}
            />
          ))}
        </Slider>
      </Paper>
  );
};

export default RelativeProducts;
