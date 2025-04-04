// src/pages/CheckoutPage.js
import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Anh Lâm kiệt gì cũng bắt",
      price: 949000,
      quantity: 2,
    },
    {
      id: 2,
      name: "Màn hình Dell S2421HN",
      price: 3499000,
      quantity: 3,
    },
    {
      id: 3,
      name: "Bàn phím cơ Keychron K6",
      price: 2190000,
      quantity: 2,
    },
    {
      id: 4,
      name: "Chuột Logitech MX Master 3",
      price: 2190000,
      quantity: 1,
    },
    {
      id: 5,
      name: "Tai nghe Sony WH-1000XM4",
      price: 6990000,
      quantity: 1,
    },
    {
      id: 6,
      name: "Tai nghe Sony WH-1000XM4",
      price: 6990000,
      quantity: 1,
    },
  ]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Thanh toán
      </Typography>

      <Grid container spacing={3}>
        {/* Thông tin giỏ hàng */}
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Hóa đơn
            </Typography>

            {/* Bảng tóm tắt đơn hàng với scroll */}
            <TableContainer style={{ maxHeight: "300px", overflowY: "auto" }}>
              {" "}
              {/* Đặt maxHeight và overflowY để cuộn */}
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Số thứ tự</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell> {/* Số thứ tự */}
                      <TableCell>{item.name}</TableCell> {/* Tên sản phẩm */}
                      <TableCell>
                        {item.price.toLocaleString()} đ
                      </TableCell>{" "}
                      {/* Đơn giá */}
                      <TableCell>{item.quantity}</TableCell> {/* Số lượng */}
                      <TableCell>
                        {(item.price * item.quantity).toLocaleString()} đ
                      </TableCell>{" "}
                      {/* Tổng tiền */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider style={{ margin: "16px 0" }} />
            <Typography variant="h6">
              Tổng cộng: {totalAmount.toLocaleString()} đ
            </Typography>
          </Paper>
        </Grid>

        {/* Form thông tin khách hàng */}
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <form noValidate autoComplete="off">
              <TextField
                label="Họ và tên"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Địa chỉ"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Nút xác nhận thanh toán */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: "20px", padding: "10px" }}
      >
        Xác nhận thanh toán
      </Button>
    </Container>
  );
};

export default CheckoutPage;
