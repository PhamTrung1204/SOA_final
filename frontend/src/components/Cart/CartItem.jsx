import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartItem = ({
  item,
  isMobile,
  handleQuantityChange,
  handleDeleteItem,
}) => {
  const product = item?.spec?.products;
  const price = item?.spec?.price;
  const quantity = item?.quantity;

  return (
    <Card
      sx={{
        display: "flex",
        marginBottom: "16px",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: isMobile ? "100%" : 150,
          height: isMobile ? 200 : 150,
          objectFit: "cover",
          marginBottom: isMobile ? "16px" : "0",
        }}
        image={product?.imageURLs[0] || ""}
        alt={product?.productName || "Product image"}
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardContent>
          <Typography variant="h6">{product?.productName || "Product"}</Typography>
          <Typography variant="body2">
            Giá: {price?.toLocaleString() || "N/A"} đ
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
            <IconButton
              onClick={() => handleQuantityChange(item._id, "decrease")}
            >
              <RemoveIcon />
            </IconButton>
            <Typography>{quantity}</Typography>
            <IconButton
              onClick={() => handleQuantityChange(item._id, "increase")}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ marginTop: "8px" }}>
            Tổng cộng: {(price * quantity).toLocaleString()} đ
          </Typography>
        </CardContent>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}
        >
          <Button
            onClick={() => handleDeleteItem(item.spec._id)}
            startIcon={<DeleteIcon />}
            color="error"
          >
            Xóa
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default CartItem;
