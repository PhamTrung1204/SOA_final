import React, { useState } from 'react';
import {
  Container, Typography, Box, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, IconButton, Checkbox, FormControlLabel, Grid2
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const Checkout = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: '',
    promoCode: '', // Mã khuyến mãi
    selectedPromos: [], // Danh sách khuyến mãi đã chọn
  });

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Sản phẩm 1', price: 150000, quantity: 1, imageUrl: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Sản phẩm 2', price: 200000, quantity: 2, imageUrl: 'https://via.placeholder.com/100' },
  ]);

  const [promotions, setPromotions] = useState([
    { id: 1, description: 'Giảm 10% cho đơn hàng từ 500.000đ', discount: 0.1 },
    { id: 2, description: 'Miễn phí vận chuyển cho đơn hàng trên 300.000đ', discount: 0 },
  ]);

  // Sản phẩm gợi ý
  const [suggestedProducts, setSuggestedProducts] = useState([
    { id: 3, name: 'Sản phẩm 3', price: 100000 },
    { id: 4, name: 'Sản phẩm 4', price: 50000 },
  ]);

  // Tính tổng tiền sau khi áp dụng khuyến mãi
  const calculateTotal = () => {
    let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Áp dụng khuyến mãi
    paymentInfo.selectedPromos.forEach((promoId) => {
      const promo = promotions.find((p) => p.id === promoId);
      if (promo && promo.discount) {
        total -= total * promo.discount;
      }
    });

    return total;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handleIncrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handlePromoToggle = (promoId) => {
    setPaymentInfo((prevState) => {
      const isPromoSelected = prevState.selectedPromos.includes(promoId);
      return {
        ...prevState,
        selectedPromos: isPromoSelected
          ? prevState.selectedPromos.filter((id) => id !== promoId)
          : [...prevState.selectedPromos, promoId],
      };
    });
  };

  const handleCheckout = () => {
    console.log('Thông tin thanh toán:', paymentInfo);
    alert('Thanh toán thành công!');
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4, textAlign: "center" }}>
        Trang Thanh Toán
      </Typography>

      {/* Giỏ hàng */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Giỏ hàng của bạn
        </Typography>
        {cartItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: "100px", marginRight: "10px" }}
              />
              <Typography variant="body1">{item.name}</Typography>
            </Box>
            <Typography variant="body1">
              {item.price.toLocaleString()} đ
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => handleDecrease(item.id)}>
                <Remove />
              </IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton onClick={() => handleIncrease(item.id)}>
                <Add />
              </IconButton>
              <IconButton onClick={() => handleRemove(item.id)} color="error">
                <Delete />
              </IconButton>
            </Box>
            <Typography variant="body1">
              {(item.price * item.quantity).toLocaleString()} đ
            </Typography>
          </Box>
        ))}
        <Typography variant="h6" align="right">
          Tổng cộng: {calculateTotal().toLocaleString()} đ
        </Typography>
      </Paper>

      {/* Khuyến mãi */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">Khuyến mãi</Typography>
        {promotions.map((promo) => (
          <FormControlLabel
            key={promo.id}
            control={
              <Checkbox
                checked={paymentInfo.selectedPromos.includes(promo.id)}
                onChange={() => handlePromoToggle(promo.id)}
              />
            }
            label={promo.description}
          />
        ))}
        <TextField
          label="Nhập mã khuyến mãi"
          name="promoCode"
          value={paymentInfo.promoCode}
          onChange={handleInputChange}
          fullWidth
          sx={{ mt: 2 }}
        />
      </Paper>

      {/* Thông tin thanh toán */}
      <Paper
        elevation={10}
        sx={{
          mt: 8,
          padding: 2,
          //borderRadius: "16px",
        }}
      >
        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Thông tin thanh toán
          </Typography>
          <TextField
            label="Họ và tên"
            name="name"
            value={paymentInfo.name}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
            sx={{ "& .MuiInputLabel-root": { top: -5 } }} // Đưa label lên trên
          />
          <TextField
            label="Địa chỉ giao hàng"
            name="address"
            value={paymentInfo.address}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
            sx={{ "& .MuiInputLabel-root": { top: -5 } }} // Đưa label lên trên
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={paymentInfo.phone}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
            sx={{ "& .MuiInputLabel-root": { top: -5 } }} // Đưa label lên trên
          />
          <TextField
            label="Email"
            name="email"
            value={paymentInfo.email}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
            sx={{ "& .MuiInputLabel-root": { top: -5 } }} // Đưa label lên trên
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Phương thức thanh toán</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="paymentMethod"
              value={paymentInfo.paymentMethod}
              label="PaymentMethod"
              onChange={handleInputChange}
            >
              <MenuItem value="creditCard">Thẻ tín dụng</MenuItem>
              <MenuItem value="bankTransfer">Chuyển khoản ngân hàng</MenuItem>
              <MenuItem value="cashOnDelivery">Thanh toán khi nhận hàng</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Gợi ý sản phẩm */}
      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h5" textAlign="center">
          Sản phẩm gợi ý
        </Typography>
        <Grid2 container spacing={2} justifyContent="center">
          {suggestedProducts.map((product, index) => (
            <Grid2
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>{product.price.toLocaleString()} đ</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Thêm vào giỏ
                </Button>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Paper>
    </Container>
  );
};

export default Checkout;
