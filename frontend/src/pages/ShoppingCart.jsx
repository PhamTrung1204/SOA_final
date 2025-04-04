import { useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Router TP-Link Archer AX23 (1275 Mbps/ Wifi 6/ 2.4/5 GHz)",
      price: 949000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Anh Lâm vip vãi loằn",
      price: 949000,
      quantity: 1,
    },
    {
      id: 3,
      name: "Anh Lâm kiệt gì cũng bắt hết vậy?",
      price: 949000,
      quantity: 1,
    },
    {
      id: 4,
      name: "Vãi loằn anh Lâm",
      price: 949000,
      quantity: 1,
    },
  ]);

  const [discountCode, setDiscountCode] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);

  const handleQuantityChange = (id, operation) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                operation === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleApplyDiscount = () => {
    if (discountCode === "SALE10") {
      setDiscountValue(totalAmount * 0.1);
    } else {
      setDiscountValue(0);
    }
  };

  const totalWithDiscountAndShipping =
    totalAmount + shippingFee - discountValue;

  return (
    <Container sx={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>

      {cartItems.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <SentimentDissatisfiedIcon
            style={{ fontSize: 80, color: "#757575", marginBottom: "16px" }}
          />
          <Typography variant="h6" style={{ fontSize: "30px" }} gutterBottom>
            Giỏ hàng của bạn hiện đang trống!
          </Typography>
          <Button
            component={Link}
            to="/homepageclient"
            variant="contained"
            color="primary"
          >
            Quay lại Trang chủ
          </Button>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Phần giỏ hàng bên trái */}
          <Box
            sx={{
              flex: 0.7,
              marginRight: "20px",
              width: "850px",
              marginLeft: "0px",
              paddingLeft: "0px",
              float: "left",
            }}
          >
            <TableContainer sx={{ maxHeight: "400px", overflowX: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "100px" }}>ẢNH</TableCell>
                    <TableCell sx={{ width: "30%" }}>SẢN PHẨM</TableCell>
                    <TableCell sx={{ width: "20%" }}>GIÁ</TableCell>
                    <TableCell sx={{ width: "20%" }}>SỐ LƯỢNG</TableCell>
                    <TableCell sx={{ width: "20%" }}>TỔNG CỘNG</TableCell>
                    <TableCell sx={{ width: "10%" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src="https://www.tnc.com.vn/uploads/product/XUYEN_102020/DELL-S2421HN.jpg"
                          width="100"
                          alt={item.name}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "250px",
                        }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        {item.price.toLocaleString()} đ
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        <Button
                          onClick={() =>
                            handleQuantityChange(item.id, "decrease")
                          }
                        >
                          -
                        </Button>
                        {item.quantity}
                        <Button
                          onClick={() =>
                            handleQuantityChange(item.id, "increase")
                          }
                        >
                          +
                        </Button>
                      </TableCell>
                      <TableCell>
                        {(item.price * item.quantity).toLocaleString()} đ
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <Button
                          onClick={() => handleDeleteItem(item.id)}
                          startIcon={<DeleteIcon />}
                          color="error"
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Phần mã giảm giá và tổng tiền bên phải */}
          <Box sx={{ flex: 0.3 }}>
            <Paper
              sx={{
                padding: "10px",
                borderRadius: "10px",
                marginLeft: "10px",

                width: "350px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Áp dụng mã giảm giá
              </Typography>
              <TextField
                label="Nhập mã giảm giá"
                variant="outlined"
                fullWidth
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                sx={{ marginBottom: "20px" }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleApplyDiscount}
                sx={{ marginBottom: "20px" }}
              >
                Áp dụng
              </Button>

              <Typography variant="h6" gutterBottom>
                Phí ship
              </Typography>
              <TextField
                label="Nhập phí ship"
                variant="outlined"
                type="number"
                fullWidth
                value={shippingFee}
                onChange={(e) => setShippingFee(parseInt(e.target.value))}
                sx={{ marginBottom: "20px" }}
              />

              <Typography variant="h6" gutterBottom>
                Tổng cộng
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                {totalWithDiscountAndShipping.toLocaleString()} đ
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#1976d2", color: "white" }}
              >
                Tiếp tục thanh toán
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
