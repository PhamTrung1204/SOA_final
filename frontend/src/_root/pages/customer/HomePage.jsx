import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, CircularProgress, Grid2 } from "@mui/material";
import Slider from "react-slick";
import BannerSlider from "../../../components/Homepage/BannerSlider";
import ProductCard from "../../../components/Homepage/ProductCard";
import SubNavbar from "../../../components/Homepage/Subnavbar";
import { useReadAllCategory, useReadAllProduct, useReadPopularProduct, useReadWishlistItems } from "../../../api/queries";
import { useAuthContext } from "../../../context/AuthContext";
import { Loading } from "../../../components";

const heightSliderBanner = '1000px'

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
  ],
};

const HomePage = ({ handleAddToCart }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [userId, setUserId] = useState()
  const { data: categories, isLoading: isLoadingCat } = useReadAllCategory();
  const {
    data: products,
    isLoading: isLoadingProd,
    isError,
    error,
  } = useReadAllProduct();

  const { data: popularProducts, isLoading: isLoadingPopularProduct } = useReadPopularProduct();

  const { data: wishList } = useReadWishlistItems(userId);
  console.log("pop:" + popularProducts);

  useEffect(() => {
    if (!isAuthenticated || !user._id) return;
    setUserId(user._id)
  }, [user]);
  if (isLoadingCat || isLoadingProd) {
    return <Loading />;
  }

  if (isError || !products) {
    return <Typography>Có lỗi xảy ra: {error.message}</Typography>;
  }

  return (
    <>
      <Box
        component={"section"}
        sx={{ "& .MuiContainer-root": { p: { md: "12px", lg: "0" } } }}
      >
        <Box flex="1" display={"flex"}>
          <SubNavbar categories={categories} />
          <Box height="400px" width={{ xs: "100%", md: "calc(100% - 220px)" }} >
            <BannerSlider />
          </Box>
        </Box>

        {/* Promotion Products Section */}
        <Typography
          variant="h4"
          align="left"
          sx={{ margin: "30px 0", fontSize: "24px", fontWeight: "600" }}
        >
          Sản phẩm khuyến mãi
        </Typography>
        <Box display='inline-flex' gap={2} overflow="auto" width="100%" py={1}>
          {products?.filter(product => product.specs[0]?.discountPercentage).map((product) => (
            <ProductCard wishList={wishList} customer={user} isLoggedIn={isAuthenticated} product={product} key={product._id} />
          ))}
        </Box>

        {/* Popular Products Section */}
        <Typography
          variant="h4"
          align="left"
          sx={{ margin: "30px 0", fontSize: "24px", fontWeight: "600" }}
        >
          Sản phẩm thịnh hành
        </Typography>
        <Box display='inline-flex' gap={2} overflow="auto" width="100%" py={1}>
          {
            !popularProducts || !popularProducts.length || isLoadingPopularProduct ?
              <Loading /> :
              popularProducts?.map((product) => (
                <ProductCard wishList={wishList} customer={user} isLoggedIn product={product} key={product._id} />
              ))
          }
        </Box>

        {/* Featured Products Section */}
        <Typography
          variant="h4"
          align="left"
          sx={{ margin: "30px 0", fontSize: "24px", fontWeight: "600" }}
        >
          Sản phẩm mới
        </Typography>
        <Box display='inline-flex' gap={2} overflow="auto" width="100%" py={1}>
          {products?.filter(product => product.tag.some(t => t.tagName.toLowerCase() === 'new')).map((product) => (
            <ProductCard wishList={wishList} customer={user} isLoggedIn={isAuthenticated} product={product} key={product._id} />
          ))}
        </Box>
        {/* Featured Products Section */}
        <Typography
          variant="h4"
          align="left"
          sx={{ margin: "30px 0", fontSize: "24px", fontWeight: "600" }}
        >
          Tất cả sản phẩm
        </Typography>
        <Box display='inline-flex' gap={2} overflow="auto" width="100%" py={1}>
          {products?.map((product) => (
            <ProductCard wishList={wishList} customer={user} isLoggedIn={isAuthenticated} product={product} key={product._id} />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
