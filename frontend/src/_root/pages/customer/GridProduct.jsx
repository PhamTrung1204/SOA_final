import { useReadAllCategory, useReadAllProduct, useReadWishlistItems, useSearchProduct } from "../../../api/queries";
import { useLocation, useParams } from 'react-router-dom'
import { useAuthContext } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import ProductCard from "../../../components/Homepage/ProductCard";
import SubNavbar from "../../../components/Homepage/Subnavbar";
import BannerSlider from "../../../components/Homepage/BannerSlider";
import FilterNav from "../../../components/navbar/FilterNav";

const expectedParams = [{ c: 'category' }, { 'n': 'product-name' }, { 'pc': 'product-code' }, { b: 'brand' }, { t: 'tag' },]

function GridProduct() {
  const location = useLocation();
  const initParam = location.state || {};
  // Use URLSearchParams to parse the query string
  const queryParams = new URLSearchParams(location.search);

  const { user, isAuthenticated } = useAuthContext();
  const [searchParams, setSearchParams] = useState(initParam);
  const [userId, setUserId] = useState()

  const { data: searchResult, isLoading: isSearching, isError: searchError } =useSearchProduct(searchParams);
  const { data: wishList, isLoading: isLoadingWishlist, isError: wishListError } = useReadWishlistItems(userId);

  useEffect(() => {
    if (!isAuthenticated || !user._id) return;
    setUserId(user._id)
  }, [user]);

  useEffect(() => {
    const params = {};

    expectedParams.forEach((param, i) => {
      const paramKey = Object.keys(param)[0];
      const value = queryParams.get(paramKey)

      if (!value) return;
      console.log(initParam[expectedParams[i][paramKey]]);

      params[expectedParams[i][paramKey]] = initParam[expectedParams[i][paramKey]];
    })

    setSearchParams(params);
  }, []);

  useEffect(() => {
    console.log(searchParams);

  }, [searchParams]);

  if(searchError || wishListError) return <Typography mx='auto'>Something went wrong</Typography>

  return (
    <Box>
      <FilterNav setFilterParams={setSearchParams} />
      <Grid2 container spacing={2}> {/* Use Grid for layout */}
        {
          isLoadingWishlist || isSearching ?
            <Box display="flex" justifyContent="center" width="100%">
              <CircularProgress />
            </Box> :
            searchResult.map((product) => (
              <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 12 / 5 }} key={product._id}> {/* Responsive grid items */}
                <ProductCard
                  wishList={wishList} // You'll need to fetch the wishlist data here
                  customer={user}
                  isLoggedIn={isAuthenticated}
                  product={product}
                />
              </Grid2>
            ))
        }
      </Grid2>
    </Box>
  );
};

export default GridProduct