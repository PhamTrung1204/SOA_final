import React, { useState } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
} from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import {
  useReadAllOrdersOfUser,
  useGetOrderDetail,
  useUpdateOrderAdmin,
} from "../../../api/queries";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

const ManagePersonalOrder = () => {
  const { user } = useAuthContext();
  const userId = user?._id;

  const [currentTab, setCurrentTab] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useReadAllOrdersOfUser(userId);
  const { data: orderDetail, isLoading: isLoadingDetail } = useGetOrderDetail(
    selectedOrderId,
    {
      enabled: !!selectedOrderId,
    }
  );
  const { mutateAsync: updateOrderStatus } = useUpdateOrderAdmin();

  console.log(ordersData);
  const processingOrders =
    ordersData?.filter((order) => order.processStatus === "pending") || [];
  const completedOrders =
    ordersData?.filter((order) => order.processStatus === "completed") || [];
  const canceledOrders =
    ordersData?.filter((order) => order.processStatus === "canceled") || [];

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);

  console.log(ordersData);
  

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleCancelOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      await updateOrderStatus({ _id: selectedOrderId, processStatus: "canceled" });
      setCancelDialogOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
    }
  };

  const renderOrders = (orders) => {
    if (orders.length === 0) {
      return <Typography>Không có đơn hàng nào.</Typography>;
    }

    return (
      <List>
        {orders.map((order) => {
          const formattedDate = moment(order.createdAt).format("DD-MM-YYYY");
          const displayTotal = `${(order.totalAmount).toLocaleString()} VND`;

          const statusLabels = {
            completed: "Đã giao hàng",
            pending: "Đang xử lý",
            canceled: "Đã hủy",
          };
          const statusStyles = {
            completed: { backgroundColor: "lightgreen", color: "darkgreen" },
            pending: { backgroundColor: "lightyellow", color: "goldenrod" },
            canceled: { backgroundColor: "#ffcccb", color: "#b22222" },
          };

          const firstCartItem = order.cart?.cartItems?.[0];
          const product = firstCartItem?.spec?.products;
          const firstImageUrl = product?.imageURLs?.[0];

          return (
            <Paper key={order._id} sx={{ mb: 2, p: 2 }} elevation={10}>
              <ListItem>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      {firstImageUrl && (
                        <img
                          src={firstImageUrl}
                          alt={product?.productName || "Ảnh sản phẩm"}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                    </Box>
                    <ListItemText
                      primary={`Sản phẩm: ${product?.productName || "Tên không có sẵn"}`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt hàng: {formattedDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng cộng: {displayTotal}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        ...statusStyles[order.processStatus],
                        borderRadius: "4px",
                        p: 0.5,
                        fontWeight: "bold",
                        display: "inline-block",
                        mt: 1,
                      }}
                    >
                      {statusLabels[order.processStatus]}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      sx={{ mb: 1 }}
                      onClick={() => handleViewDetails(order._id)}
                    >
                      Xem chi tiết
                    </Button>
                    {currentTab === 0 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelOrderClick(order._id)}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
            </Paper>
          );
        })}
      </List>
    );
  };

  if (isLoading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (isError) {
    return <Typography>Có lỗi xảy ra trong quá trình tải đơn hàng.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 4, mt: 4 }}>
        Quản lý đơn hàng
      </Typography>
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Đơn hàng đang xử lý" />
        <Tab label="Đơn hàng đã mua" />
        <Tab label="Đơn hàng đã hủy" />
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {currentTab === 0 && renderOrders(processingOrders)}
        {currentTab === 1 && renderOrders(completedOrders)}
        {currentTab === 2 && renderOrders(canceledOrders)}
      </Box>

      {/* Order Details Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Chi tiết đơn hàng
          <IconButton
            aria-label="close"
            onClick={handleCloseDetailModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isLoadingDetail ? (
            <Typography>Đang tải chi tiết đơn hàng...</Typography>
          ) : orderDetail ? (
            <>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Mã đơn hàng:</Typography>
                  <Typography variant="body2">{orderDetail._id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Ngày đặt hàng:</Typography>
                  <Typography variant="body2">
                    {moment(orderDetail.createdAt).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Ghi chú:</Typography>
                  <Typography variant="body2">
                    {orderDetail.orderNote || "Không có ghi chú"}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Sản phẩm trong đơn hàng:
              </Typography>
              <List>
                {orderDetail.cart?.cartItems.map((item) => (
                  <ListItem key={item._id}>
                    <Box
                      component="img"
                      src={
                        item.spec?.products?.imageURLs?.[0] ||
                        "https://via.placeholder.com/60"
                      }
                      alt={item.spec?.products?.productName || "Ảnh sản phẩm"}
                      sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        item.spec?.products?.productName || "Tên không có sẵn"
                      }
                      secondary={
                        <Typography variant="body2">{`Số lượng: ${item.quantity} - Đơn giá: ${item.spec?.price.toLocaleString()} VND`}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom>
                Thông tin tài chính:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">Phí vận chuyển:</Typography>
                  <Typography variant="body2">
                    {orderDetail.shippingCost.toLocaleString()} VND
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Giảm giá:</Typography>
                  <Typography variant="body2">
                    - {orderDetail.discountAmount.toLocaleString()} VND
                  </Typography>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="black" fontWeight="bold">
                      Tổng cộng:
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="h5" fontWeight="bold" color="error">
                      {(
                        orderDetail.totalAmount
                      ).toLocaleString()}{" "}
                      VND
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Địa chỉ giao hàng:
              </Typography>
              <Typography variant="body2">
                Địa chỉ: {orderDetail.address?.address || "Không có địa chỉ"}
              </Typography>
              <Typography variant="body2">
                Quận/Huyện:{" "}
                {orderDetail.address?.district || "Không có thông tin"}
              </Typography>
              <Typography variant="body2">
                Tỉnh/Thành phố:{" "}
                {orderDetail.address?.city || "Không có thông tin"}
              </Typography>
            </>
          ) : (
            <Typography>Chi tiết đơn hàng không khả dụng.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn hủy đơn hàng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} color="primary">
            Không
          </Button>
          <Button onClick={confirmCancelOrder} color="error">
            Hủy đơn hàng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagePersonalOrder;
