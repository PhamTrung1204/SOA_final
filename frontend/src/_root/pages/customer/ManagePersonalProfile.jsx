import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, Grid2, Box, Avatar } from '@mui/material';
import { useAuthContext } from '../../../context/AuthContext';
import { useUpdateAccount } from '../../../api/queries';

const ManagePersonalProfile = () => {
  const { isAuthenticated, isLoading: isLoadingUser, user } = useAuthContext();
  const { mutateAsync: updateAccount } = useUpdateAccount();


  // Khởi tạo state với các giá trị từ `user`
  const [inputs, setInputs] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    avatar: "",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  // Đặt ảnh đại diện mặc định
  const defaultAvatar = "https://static-00.iconduck.com/assets.00/avatar-icon-512x512-gu21ei4u.png";
  const fileInputRef = useRef(null);

  // Cập nhật các giá trị `inputs` khi `user` thay đổi
  useEffect(() => {
    if (user) {
      setInputs({
        username: user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "", // Chuyển đổi định dạng
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Xử lý thay đổi dữ liệu
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const avatarURL = URL.createObjectURL(file);
      setInputs((values) => ({ ...values, avatar: avatarURL }));
    }
  };

  // Xử lý lưu thay đổi
  const handleSave = async (event) => {
    event.preventDefault();
    let tempError = { firstName: "", lastName: "", phoneNumber: "" };

    if (!inputs.firstName) tempError.firstName = "Tên không được để trống";
    if (!inputs.lastName) tempError.lastName = "Họ không được để trống";
    if (!inputs.phoneNumber) {
      tempError.phoneNumber = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(inputs.phoneNumber)) {
      tempError.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (Object.values(tempError).some((error) => error)) {
      setError(tempError);
      return;
    }

    setError({ firstName: "", lastName: "", phoneNumber: "" });
    try {
      await updateAccount({ ...inputs, _id: user._id });
      console.log("Thay đổi thông tin thành công:", inputs);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>
        Quản lý hồ sơ
      </Typography>
      {/* Avatar và sự kiện thay đổi ảnh đại diện */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          justifyContent: "center",
        }}
      >
        <Avatar
          src={inputs.avatar || defaultAvatar}
          sx={{ width: 100, height: 100, mr: 2, cursor: "pointer" }}
          onClick={() => fileInputRef.current.click()} // Khi nhấp vào avatar, kích hoạt chọn file
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </Box>
      <Box
        component="form"
        onSubmit={handleSave}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          id="outlined-username"
          label="Tên tài khoản"
          name="username"
          fullWidth
          value={inputs.username}
          InputProps={{ readOnly: true }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <Grid2 container spacing={1}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              id="outlined-lastname"
              label="Họ"
              name="lastName"
              fullWidth
              value={inputs.lastName}
              onChange={handleChange}
              error={!!error.lastName}
              helperText={error.lastName}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              id="outlined-firstname"
              label="Tên"
              name="firstName"
              fullWidth
              value={inputs.firstName}
              onChange={handleChange}
              error={!!error.firstName}
              helperText={error.firstName}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid2>
        </Grid2>
        <TextField
          id="outlined-email"
          label="Email"
          name="email"
          fullWidth
          value={inputs.email}
          InputProps={{ readOnly: true }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <TextField
          id="outlined-phoneNumber"
          label="Số điện thoại"
          name="phoneNumber"
          fullWidth
          value={inputs.phoneNumber}
          onChange={handleChange}
          error={!!error.phoneNumber}
          helperText={error.phoneNumber}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <TextField
          id="outlined-dateOfBirth"
          label="Ngày sinh"
          type="date"
          name="dateOfBirth"
          fullWidth
          value={inputs.dateOfBirth}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 1,
            height: "3rem",
            fontSize: "1rem",
            borderRadius: "12px",
          }}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Container>
  );
};

export default ManagePersonalProfile;