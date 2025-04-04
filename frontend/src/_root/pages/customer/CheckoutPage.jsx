import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import {
  useReadOwnCart,
  useReadAllVouchers,
  useReadOwnAddresses,
  useCreateNewOrder,
} from "../../../api/queries";
import { useAuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const navigate = useNavigate();
  // Get the current user from context
  const { user: currentUser, isLoading: isUserLoading } = useAuthContext();

  // Fetch cart, vouchers, and addresses data
  const { data: cartData, isLoading: isCartLoading } = useReadOwnCart(
    currentUser?._id
  );
  const { data: vouchersData, isLoading: isVouchersLoading } =
    useReadAllVouchers();
  // const { data: addressesData, isLoading: isAddressesLoading } =
  //   useReadOwnAddresses(currentUser?._id);

  // Mutation hook for creating a new order
  const createNewOrder = useCreateNewOrder();
  const { mutateAsync: create } = useCreateNewOrder();

  // Get current date and add 5 days
  const currentDateTime = new Date();
  const takeOrderTime = new Date(currentDateTime);
  takeOrderTime.setDate(takeOrderTime.getDate() + 5);

  const [orderData, setOrderData] = useState({
    userId: "",
    paymentStatus: "unpaid",
    paymentMethod: "credit_card",
    shippingCost: 58500,
    orderNote: "",
    expectedReceiveTime: currentDateTime.toISOString().slice(0, 16),
    takeOrderTime: takeOrderTime.toISOString().slice(0, 16),
    address: "", // Ensure this is set with a valid ObjectId
    voucher: [],
    cart: {
      client: "",
      cartItems: [],
    },
  });

  // Set user and client information when currentUser data is loaded
  useEffect(() => {
    if (currentUser && currentUser._id) {
      setOrderData((prevData) => ({
        ...prevData,
        userId: currentUser._id,
        cart: {
          ...prevData.cart,
          client: currentUser._id,
        },
      }));
    }
  }, [currentUser]);

  // Set cart items when cartData is loaded
  useEffect(() => {
    if (cartData && cartData.cartItems) {
      setOrderData((prevData) => ({
        ...prevData,
        cart: {
          ...prevData.cart,
          cartItems: cartData.cartItems.map((item) => ({
            spec: item?.spec?._id,
            productName: item?.spec?.products.productName,
            price: item?.spec?.price,
            quantity: item.quantity,
          })),
        },
      }));
    }
  }, [cartData]);

  const addressesData = [
    {
      _id: "addr1",
      address: "123 Lê Lợi",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
    },
    {
      _id: "addr2",
      address: "456 Nguyễn Huệ",
      ward: "Phường Nguyễn Thái Bình",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
    },
  ];
  // const isAddressesLoading = false;

  // Set default address if available
  useEffect(() => {
    setOrderData((prevData) => ({
      ...prevData,
      address: "6711cc0dcdf8a1dcfcf38f88",
    }));
  }, []);

  console.log(addressesData);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle changes within cart items
  const handleNestedChange = (e, index) => {
    const { name, value } = e.target;
    const cartItems = [...orderData.cart.cartItems];
    cartItems[index][name] = value;
    setOrderData((prevData) => ({
      ...prevData,
      cart: { ...prevData.cart, cartItems },
    }));
  };

  // Handle adding voucher to order
  const handleAddVoucher = (e) => {
    const { value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      voucher: value,
    }));
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate address selection
    if (!orderData.address) {
      alert("Please select an address before submitting the order.");
      return;
    }

    // Call the mutation to create a new order
    await createNewOrder.mutateAsync(orderData, {
      onSuccess: () => {
        console.log("Order created successfully");
        // Optionally, navigate to a different page or reset form here
      },
      onError: (error) => {
        console.error("Error creating order:", error);
      },
    });
    // create(orderData)
    navigate("/");
  };

  // Show loading while data is being fetched
  if (isUserLoading || isCartLoading || isVouchersLoading) {
    return <Typography>Loading data...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Order Form
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User ID"
            name="userId"
            value={orderData.userId}
            margin="normal"
            disabled
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Status</InputLabel>
            <Select
              name="paymentStatus"
              value={orderData.paymentStatus}
              onChange={handleChange}
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleChange}
            >
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="paypal">Paypal</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Shipping Cost"
            name="shippingCost"
            value={orderData.shippingCost}
            onChange={handleChange}
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Order Note"
            name="orderNote"
            value={orderData.orderNote}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Expected Receive Time"
            name="expectedReceiveTime"
            value={orderData.expectedReceiveTime}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Take Order Time"
            name="takeOrderTime"
            value={orderData.takeOrderTime}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Address</InputLabel>
            <Select
              name="address"
              value={orderData.address}
              onChange={handleChange}
            >
              {addressesData?.map((address) => (
                <MenuItem key={address._id} value={address._id}>
                  {`${address.address}, ${address.ward}, ${address.district}, ${address.city}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Vouchers</InputLabel>
            <Select
              name="voucher"
              multiple
              value={orderData.voucher}
              onChange={handleAddVoucher}
              renderValue={(selected) =>
                selected
                  .map(
                    (id) =>
                      vouchersData.find((voucher) => voucher._id === id)
                        ?.voucherName || id
                  )
                  .join(", ")
              }
            >
              {vouchersData.map((voucher) => (
                <MenuItem key={voucher._id} value={voucher._id}>
                  {voucher.voucherName} - {voucher.discountPercentage}% off
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" gutterBottom mt={2}>
            Cart Items
          </Typography>
          {orderData.cart.cartItems.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="productName"
                  value={item.productName}
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleNestedChange(e, index)}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={item.price}
                  margin="normal"
                  disabled
                />
              </Grid>
            </Grid>
          ))}
          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary">
              Submit Order
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CheckoutPage;
