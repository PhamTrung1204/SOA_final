import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  styled,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { enqueueSnackbar } from "notistack";
import { useAddItemToWishlist, useRemoveItemFromWishlist } from "../../api/queries";

const TruncatedTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lineClamp', // Ensure lineClamp can be passed as a prop
})(({ lineClamp = 3 }) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lineClamp, // Use dynamic lineClamp value
  lineClamp, // Fallback for other browsers
}));

const ProductCard = ({ product, wishList, customer, isLoggedIn }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { mutateAsync: like, isPending: isLiking } = useAddItemToWishlist();
  const { mutateAsync: unLike, isPending: isUnliking } = useRemoveItemFromWishlist();

  useEffect(() => {
    if (!wishList || !wishList.products) return;
    setIsFavorite(wishList.products.some((prod) => String(prod._id) === String(product._id)));
  }, [wishList, product._id]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn || !customer._id) {
      enqueueSnackbar("Bạn cần đăng nhập để thích sản phẩm này!", { variant: 'info' });
      return;
    }

    if (isFavorite) {
      await unLike({ customerId: customer._id, productId: product._id });
    } else {
      await like({ customerId: customer._id, productId: product._id })
    }

    setIsFavorite(!isFavorite);


  }
  return (
    <Card
      sx={{
        minWidth: 224,
        maxWidth: 224,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "480px", // Chiều cao cố định cho các thẻ card
      }}
    >
      <Link
        to={`/product/${product.slug}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardMedia
          component="img"
          image={product.imageURLs[0]}
          alt={product.productName}
          sx={{
            width: "100%", // Chiều rộng cố định
            height: "224px", // Chiều cao cố định
            objectFit: "contain", // Đảm bảo hình ảnh được cắt mà không bị méo
            borderRadius: "8px 8px 0 0",
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pb: '12px !important'
          }}
        >
          <Box>
            <TruncatedTypography lineClamp={2} variant="h6" fontSize='1rem' lineHeight="1.2" mb={0.2} component="div">
              {product.productName}
            </TruncatedTypography>
            <TruncatedTypography
              variant="body2"
              color="text.secondary"
              fontSize='0.8rem'
              lineClamp={2}
            >
              {product.description}
            </TruncatedTypography>
          </Box>
          <Typography
            fontSize="0.8rem"
            variant="body1"
            style={{
              color: product.productStatus === "available" ? "green" : "red",
            }}
          >
            Trạng thái:{" "}
            {product.productStatus === "available" ? "Còn hàng" : "Hết hàng"}
          </Typography>
          <Typography
            fontSize="1rem"
            variant="body1"
            sx={{
              textDecoration: product.specs[0]?.discountPercentage && 'line-through'
            }}
            style={{
              color: product.specs[0]?.discountPercentage && "#353535",
            }}
            textAlign='right'
          >
            { product.specs[0]?.price?.toString() && new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.specs[0]?.price)}
          </Typography>
          {
            product.specs[0]?.discountPercentage &&
            <Typography
              fontSize="1rem"
              variant="body1"
              style={{
                color: "red"
              }}
              textAlign='right'
            >
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((product.specs[0]?.price * (1 - product.specs[0]?.discountPercentage)))}
            </Typography>
          }
        </CardContent>
      </Link>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        mt={'auto'}
        mb={0.5}
      >
        <IconButton
          color="error"
          onClick={handleToggleFavorite}
          aria-label="favorite"
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2">Mã: {product.productCode}</Typography>
      </Box>
    </Card>
  );
};

export default ProductCard;
