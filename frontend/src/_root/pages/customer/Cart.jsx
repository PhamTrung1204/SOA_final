import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  useMediaQuery,
} from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Link, useParams } from "react-router-dom";
import DiscountSection from "../../../components/Cart/usevoucher";
import {
  useAddCartItem,
  useDeleteCartItem,
  useReadOwnCart,
  useReadProductDetailBySlug,
  useUpdateCart,
} from "../../../api/queries";
import CartItem from "../../../components/Cart/CartItem";
import { useAuthContext } from "../../../context/AuthContext";
import { enqueueSnackbar } from "notistack";

const Cart = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuthContext();
  const { data: fetchedCartItems, error, isLoading } = useReadOwnCart(user?._id);
  const createCartItem = useAddCartItem();
  const { mutateAsync: updateCart } = useUpdateCart();
  const { mutateAsync: deleteCartItem } = useDeleteCartItem();
  const { data: productData } = useReadProductDetailBySlug(slug);
  const specs = Array.isArray(productData?.specs) ? productData.specs : [];

  const [cartItems, setCartItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    if (fetchedCartItems && Array.isArray(fetchedCartItems.cartItems)) {
      setCartItems(fetchedCartItems?.cartItems);
    }
  }, [fetchedCartItems]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleDeleteItem = async (specId) => {
    try {
      const response = await deleteCartItem({ client: user?._id, spec: specId });
      setCartItems((prevItems) => prevItems.filter((item) => item.spec._id !== specId));
      enqueueSnackbar("Xóa sản phẩm thành công!", { variant: "success" });
    } catch {
      enqueueSnackbar("Lỗi khi xóa!", { variant: "error" });
    }
  };

  const handleUpdateCart = async (updatedCartItems) => {
    try {
      const cartId = fetchedCartItems?._id; // cartId from fetched cart data

      const cartItemsPayload = updatedCartItems.map((item) => ({
        spec: item.spec._id, // spec is the product ID
        quantity: item.quantity, // product quantity
      }));

      const response = await updateCart({
        cartId: cartId,
        cartItems: cartItemsPayload,
      });

      console.log("Cập nhật giỏ hàng thành công!", response);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng", error);
    }
  };

  const handleQuantityChange = (id, operation) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === id) {
          const newQuantity =
            operation === "increase" ? item.quantity + 1 : item.quantity - 1;
          if (newQuantity > 0) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      handleUpdateCart(cartItems);
    }
  }, [cartItems]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.spec?.price * item.quantity,
    0
  );

  const totalWithDiscountAndShipping = totalAmount + shippingFee - discountValue;

  if (isLoading) {
    return (
      <Container sx={{ marginTop: "50px" }}>
        <Typography variant="h6" align="center">
          Đang tải dữ liệu giỏ hàng...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: "50px" }}>
        <Typography variant="h6" align="center" color="error">
          Lỗi khi tải dữ liệu giỏ hàng. Vui lòng thử lại sau.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: "50px", paddingX: isMobile ? "8px" : "24px" }}>
      <Typography
        variant="h4"
        gutterBottom
        align={isMobile ? "center" : "left"}
        sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}
      >
        Giỏ hàng
      </Typography>

      {cartItems.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <SentimentDissatisfiedIcon
            sx={{ fontSize: 80, color: "#757575", marginBottom: "16px" }}
          />
          <Typography
            variant="h6"
            sx={{ fontSize: "30px", textAlign: "center" }}
            gutterBottom
          >
            Giỏ hàng của bạn hiện đang trống!
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Quay lại Trang chủ
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  isMobile={isMobile}
                  handleQuantityChange={handleQuantityChange}
                  handleDeleteItem={() => handleDeleteItem(item.spec._id)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: "16px",
                width: isMobile ? "100%" : "80%",
                margin: isMobile ? "auto" : "0",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Tổng cộng
              </Typography>
              <Typography variant="body1">
                Tổng tiền: {totalAmount.toLocaleString()} đ
              </Typography>
              <Typography variant="body1">
                Phí ship: {shippingFee.toLocaleString()} đ
              </Typography>
              <Typography variant="body1" gutterBottom>
                Giảm giá: {discountValue.toLocaleString()} đ
              </Typography>
              <Typography variant="h6" gutterBottom>
                Thành tiền: {totalWithDiscountAndShipping.toLocaleString()} đ
              </Typography>

              <DiscountSection
                totalAmount={totalAmount}
                setDiscountValue={setDiscountValue}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: "16px" }}
                component={Link}
                to="/checkoutpage"
              >
                Thanh toán
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;