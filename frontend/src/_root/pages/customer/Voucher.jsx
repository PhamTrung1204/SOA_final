import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useReadAllVouchers } from "../../../api/queries"; // Import your hooks here

const Voucher = () => {
  const [open, setOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [collectedVouchers, setCollectedVouchers] = useState([]);

  // Fetch all vouchers
  const { data: vouchers = [], isLoading, error } = useReadAllVouchers();

  const handleOpen = (voucher) => {
    setSelectedVoucher(voucher);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVoucher(null);
  };

  // Collect voucher code
  const handleCollectVoucher = (voucher) => {
    setCollectedVouchers((prev) => {
      if (!prev.includes(voucher.voucherCode)) {
        return [...prev, voucher.voucherCode];
      }
      return prev;
    });
    handleClose();
  };

  if (isLoading) return <Typography>Đang tải dữ liệu voucher...</Typography>;
  if (error) return <Typography>Có lỗi xảy ra khi lấy dữ liệu voucher</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Khuyến mãi
      </Typography>
      <Grid container spacing={4}>
        {vouchers.map((voucher) => (
          <Grid item xs={12} sm={6} md={4} key={voucher._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {voucher.voucherName}
                </Typography>
                {voucher.discountPercentage && (
                  <Typography variant="body1">
                    Giảm {voucher.discountPercentage}%
                  </Typography>
                )}
                {voucher.fixedAmount && (
                  <Typography variant="body1">
                    Giảm cố định: {voucher.fixedAmount} VND
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  {voucher.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => handleOpen(voucher)}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Voucher detail modal */}
      {selectedVoucher && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedVoucher.voucherName}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{selectedVoucher.description}</Typography>
            {selectedVoucher.discountPercentage && (
              <Typography variant="body1">
                Giảm {selectedVoucher.discountPercentage}%
              </Typography>
            )}
            {selectedVoucher.fixedAmount && (
              <Typography variant="body1">
                Giảm cố định: {selectedVoucher.fixedAmount} VND
              </Typography>
            )}
            <Typography variant="body1">
              Mã áp dụng: {selectedVoucher.voucherCode || "Không có mã"}
            </Typography>
            <Typography variant="body1">
              Ngày cập nhật: {new Date(selectedVoucher.updatedAt).toLocaleDateString("vi-VN")}
            </Typography>
            <Typography variant="body1">
              Số khách hàng đã thu thập: {selectedVoucher.clients.length}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Đóng
            </Button>
            <Button onClick={() => handleCollectVoucher(selectedVoucher)} color="primary">
              Thu thập mã
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Display collected voucher codes */}
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Danh sách mã đã thu thập:
      </Typography>
      <ul>
        {collectedVouchers.map((code, index) => (
          <li key={index}>{code}</li>
        ))}
      </ul>
    </Container>
  );
};

export default Voucher;
