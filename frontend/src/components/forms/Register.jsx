import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Grid2,
} from "@mui/material";
import PropTypes from "prop-types";
import { useCreateAccount } from "../../api/queries";
import { enqueueSnackbar as toaster } from "notistack";
import LoadingOverlay from "../dialogs/LoadingOverlay";

const Register = ({ setModalType }) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [isAgree, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: register } = useCreateAccount();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    let tempError = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
    };

    // Validation
    if (!inputs.username) {
      tempError.username = "Tên tài khoản không được để trống";
    }
    if (!inputs.password) {
      tempError.password = "Mật khẩu không được để trống";
    }
    if (!inputs.firstName) {
      tempError.firstName = "Tên không được để trống";
    }
    if (!inputs.lastName) {
      tempError.lastName = "Họ không được để trống";
    }
    if (!inputs.email) {
      tempError.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      tempError.email = "Email không hợp lệ";
    }
    if (!inputs.phoneNumber) {
      tempError.phoneNumber = "Số điện thoại không được để trống";
    } else if (!/^\d+$/.test(inputs.phoneNumber)) {
      tempError.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (Object.values(tempError).some((error) => error)) {
      setError(tempError);
      return;
    }

    setError({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
    });

    setIsLoading(true);
    try {
      console.log(inputs);
      
      const response = await register(inputs);

      // Kiểm tra nếu response là false (thất bại) hoặc không có token
      if (!response || typeof response !== "string") {
        toaster("Tên tài khoản hoặc email đã tồn tại. Vui lòng thử lại.", {
          variant: "error",
        });
      } else {
        // Nếu nhận được token, đăng ký thành công
        toaster("Đăng ký thành công!", { variant: "success" });

        // Lưu token vào localStorage
        localStorage.setItem("token", response);

        setModalType('login');
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      toaster("Đã xảy ra lỗi. Vui lòng thử lại.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 8, overflow: "auto" }}>
      <Paper
        elevation={10}
        sx={{
          mt: 8,
          padding: 2,
          borderRadius: "16px",
        }}
      >
        <Typography
          component="div"
          variant="h6"
          sx={{
            mb: 2,
          }}
        >
          Đăng ký
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Nunito",
            color: "primary.main",
            fontWeight: "bold",
            textAlign: "center",
            mb: 3,
          }}
        >
          FCOMPUTER
        </Typography>
        <Box
          component="form"
          onSubmit={handleRegister}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Form fields */}
          <TextField
            required
            id="outlined-username"
            label="Tên tài khoản"
            name="username"
            fullWidth
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            value={inputs.username}
            onChange={handleChange}
            error={!!error.username}
            helperText={error.username}
          />
          <TextField
            id="outlined-password-input"
            label="Mật khẩu"
            type="password"
            name="password"
            autoComplete="current-password"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            value={inputs.password}
            onChange={handleChange}
            error={!!error.password}
            helperText={error.password}
          />
          <Grid2 container spacing={1}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                id="outlined-lastname"
                label="Họ"
                name="lastName"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
                value={inputs.lastName}
                onChange={handleChange}
                error={!!error.lastName}
                helperText={error.lastName}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                id="outlined-firstname"
                label="Tên"
                name="firstName"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
                value={inputs.firstName}
                onChange={handleChange}
                error={!!error.firstName}
                helperText={error.firstName}
              />
            </Grid2>
          </Grid2>
          <TextField
            id="outlined-email"
            label="Email"
            type="email"
            name="email"
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            value={inputs.email}
            onChange={handleChange}
            error={!!error.email}
            helperText={error.email}
          />
          <TextField
            id="outlined-phoneNumber"
            label="Số điện thoại"
            type="tel"
            name="phoneNumber"
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            value={inputs.phoneNumber}
            onChange={handleChange}
            error={!!error.phoneNumber}
            helperText={error.phoneNumber}
          />
          <TextField
            id="outlined-dateOfBirth"
            label="Ngày sinh"
            type="date"
            name="dateOfBirth"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            value={inputs.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAgree}
                onChange={(e) => setIsAgree(e.target.checked)}
                value="agree"
              />
            }
            label="Tôi đồng ý với các điều khoản sử dụng."
          />
          <Button
            type="submit"
            disabled={!isAgree}
            variant="contained"
            sx={{
              borderRadius: "12px",
              backgroundColor: "#6c74cc",
            }}
          >
            Đăng ký
          </Button>
        </Box>
        <Box mt={2}>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            Đã có tài khoản?{" "}
            <Link
              component="button"
              onClick={() => setModalType("login")}
              sx={{
                cursor: "pointer",
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
      {/* Hiển thị overlay loading khi đang xử lý */}
      <LoadingOverlay visible={isLoading} message="Đang tạo tài khoản..." />
    </Container>
  );
};

Register.propTypes = {
  setModalType: PropTypes.func,
};

export default Register;
