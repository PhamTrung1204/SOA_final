import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  IconButton,
  TextField,
} from "@mui/material";
import { Add, Remove, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useAddCartItem, useAddItemToWishlist, useReadAllReviewsAdmin, useReadProductDetailBySlug, useReadWishlistItems, useRemoveItemFromWishlist } from "../../api/queries";
import { useAuthContext } from "../../context/AuthContext";
import { enqueueSnackbar } from "notistack";

const ProductGeneralInfo = () => {
  const { slug } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSpec, setActiveSpec] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);

  const { user, isAuthenticated } = useAuthContext();
  const { data: productData } = useReadProductDetailBySlug(slug);
  const { data: wishList } = useReadWishlistItems(user?._id);

  const { mutateAsync: like } = useAddItemToWishlist();
  const { mutateAsync: unLike } = useRemoveItemFromWishlist();
  const { mutateAsync: addToCart } = useAddCartItem();

  const specs = Array.isArray(productData?.specs) ? productData.specs : [];
  const { data: productReview, isPending: isLoadingReviews } = useReadAllReviewsAdmin(specs?._id);

  useEffect(() => {
    // Set the initial favorite status based on the wishlist
    if (wishList) {
      setIsFavorite(wishList.products.some((prod) => String(prod._id) === String(productData._id)));
    }
  }, [wishList, productData?._id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user._id) {
      enqueueSnackbar("Bạn cần đăng nhập để thích sản phẩm này!", { variant: "info" });
      return;
    }

    if (isFavorite) {
      await unLike({ customerId: user._id, productId: productData._id });
      enqueueSnackbar("Đã xóa khỏi danh sách yêu thích!", { variant: "success" });
    } else {
      await like({ customerId: user._id, productId: productData._id });
      enqueueSnackbar("Đã thêm vào danh sách yêu thích!", { variant: "success" });
    }
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = async () => {
    if (isAuthenticated) {
      try {
        const userId = user?._id;
        const response = await addToCart({ client: userId, spec: selectedSpec?._id, quantity });
        console.log(response)
        enqueueSnackbar("Sản phẩm đã được thêm vào giỏ hàng!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Lỗi khi thêm vào giỏ hàng!", { variant: "error" });
        console.log(error)
      }
    }
  };

  useEffect(() => {
    if (specs && specs.length > 0) {
      setSelectedSpec(specs[0]);
      setActiveSpec(specs[0]._id);
    }
  }, [specs]);

  const handleSpecChange = (spec) => {
    setSelectedSpec(spec);
    setQuantity(1);
    setActiveSpec(spec._id);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
    return totalStars / reviews.length;
  };

  const handleIncrease = () => {
    if (selectedSpec && quantity < selectedSpec.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const averageRating = calculateAverageRating(productReview);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Product Name and Favorite Button */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5">{productData.productName}</Typography>
        <IconButton color="error" onClick={handleToggleFavorite} aria-label="favorite">
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>

      {/* Rating */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Rating value={averageRating} readOnly precision={0.5} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          ({productReview?.length || 0} đánh giá)
        </Typography>
      </Box>

      {/* Specification Options */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Chọn cấu hình:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {specs.map((spec) => {
          const storageSpec = spec.specifications.find(
            (s) => s.key === "671f02986fb968f4d374e5ce"
          );
          const storageCapacity = storageSpec ? storageSpec.value : "N/A";
          const originalPrice = spec.price;
          const discountPrice = originalPrice * (1 - (productData.specs.discountPercentage || 0) / 100);

          return (
            <Button
              key={spec._id}
              variant="outlined"
              onClick={() => handleSpecChange(spec)}
              sx={{
                mb: 1,
                mr: 1,
                display: "flex",
                justifyContent: "space-between",
                width: 300,
                borderRadius: 4,
                borderColor: activeSpec === spec._id ? "red" : "grey.500",
                color: activeSpec === spec._id ? "red" : "inherit",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <Typography variant="body2">{spec.specificationName}</Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {storageCapacity}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                {productData.discountPercentage > 0 && (
                  <Typography variant="body2" sx={{ textDecoration: "line-through" }}>
                    {originalPrice}{" "}VND
                  </Typography>
                )}
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {discountPrice.toFixed(2)}{" "}VND
                </Typography>
              </Box>
            </Button>
          );
        })}
      </Box>

      {/* Price Display */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
        {selectedSpec && selectedSpec.discountPercentage > 0 ? (
          <>
            <Typography variant="h6" sx={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>
              {selectedSpec.price * (1 - selectedSpec.discountPercentage / 100)}{" "}VND
            </Typography>
            <Typography variant="body2" sx={{ textDecoration: "line-through", color: "gray", ml: 2 }}>
              {selectedSpec.price}{" "}VND
            </Typography>
          </>
        ) : (
          selectedSpec && (
            <Typography variant="h6" sx={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>
              {selectedSpec.price}{" "}VND
            </Typography>
          )
        )}
      </Box>

      {/* Quantity Selector */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          Số lượng:
        </Typography>
        <IconButton onClick={handleDecrease} disabled={quantity <= 1}>
          <Remove />
        </IconButton>
        <TextField
          value={quantity}
          size="small"
          sx={{ width: "50px", textAlign: "center" }}
          inputProps={{ style: { textAlign: "center" } }}
          
        />
        <IconButton onClick={handleIncrease} disabled={selectedSpec && quantity >= selectedSpec.stockQuantity}>
          <Add />
        </IconButton>
      </Box>

      {/* Stock Status */}
      <Typography variant="body2" color={selectedSpec && selectedSpec.stockQuantity > 0 ? "green" : "red"} sx={{ mt: 1 }}>
        {selectedSpec && selectedSpec.stockQuantity > 0
          ? `Còn ${selectedSpec.stockQuantity} sản phẩm`
          : "Hết hàng"}
      </Typography>

      {/* Add to Cart Button */}
      {selectedSpec && selectedSpec.stockQuantity > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductGeneralInfo;
