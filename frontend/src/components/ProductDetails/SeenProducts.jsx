import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Container, Paper } from "@mui/material";
import Slider from "react-slick";
import ProductCard from "../Homepage/ProductCard";
import { useReadAllProduct, useReadSeenProducts } from "../../api/queries";
import { useAuthContext } from "../../context/AuthContext";

const sliderSettings = {
  dots: false,
  infinite: false,
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

const SeenProducts = () => {
  const { user, isAuthenticated } = useAuthContext();
  const userId = user?._id;
  const [favorites, setFavorites] = useState({});
  const { data: seenProducts, isLoading } = useReadSeenProducts(userId);
  console.log(seenProducts)

  const { data: products, isLoading: isLoadingProd } = useReadAllProduct();

  const handleToggleFavorite = (product) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [product._id]: !prevFavorites[product._id],
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Sản phẩm đã xem gần đây
      </Typography>
      {seenProducts && seenProducts.length > 0 ? (
        <Slider {...sliderSettings}>
          {seenProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={favorites[product.id]}
            />
          ))}
        </Slider>
      ) : (
        <Typography variant="body1">Bạn chưa xem sản phẩm nào gần đây.</Typography>
      )}
    </Paper>
  );
};

export default SeenProducts;
