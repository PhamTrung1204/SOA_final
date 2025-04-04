import { forwardRef, useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid2,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PropTypes from "prop-types";
import { useLogin } from "../../api/queries";
import { enqueueSnackbar as toaster } from 'notistack';
import { useAuthContext } from "../../context/AuthContext";
import { setBearerToken } from "../../api/myAxios";
import { useNavigate } from "react-router-dom";
import { useAuthAdminContext } from "../../context/AuthAdminContext";

const init_error_message = { username: '', password: '' }

const Login = ({ setModalType, setModalOpen, isAdmin }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(init_error_message);
  const { user: customer, checkAuthUser, isAuthenticated: customerIsAuthenticated } = useAuthContext();
  const { user: admin, checkAuthAdminUser, isAuthenticated: adminIsAuthenticated } = useAuthAdminContext();

  const { mutateAsync: login } = useLogin();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();


    // Kiểm tra tên tài khoản
    console.log(!inputs.password);

    setErrorMessage(() => ({
      username: !inputs.username ? "Username không được để trống" : "",
      password: !inputs.password ? "Password không được để trống" : ""
    }))

    console.log(errorMessage.password);


    if (errorMessage.username !== "" || errorMessage.password !== "") {
      console.log("ue");

      return;
    }

    const token = await login(inputs);

    if (!token) {
      console.log(token)
      toaster('Tên tài khoản hoặc mật khẩu không đúng!', { variant: 'error' });
      setErrorMessage(init_error_message);
      return;
    }
    else {
      toaster('Đăng nhập thành công.', { variant: 'success' });
      if (isAdmin) {
        localStorage.setItem('adminCookie', JSON.stringify(token));
        const isAuthenticated = await checkAuthAdminUser();
        console.log(isAuthenticated);

        if (isAuthenticated)
          navigate("/admin");
        else {
          toaster('Không tìm thấy tài khoản!', { variant: 'error' })
        }
        return;
      }
      else
        localStorage.setItem('cookieFallback', JSON.stringify(token));
      await checkAuthUser();
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (isAdmin && adminIsAuthenticated) {
      navigate('/admin');
    }
    else if (!isAdmin && customerIsAuthenticated) {
      navigate('/')
    }
  }, [admin, customer]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={10}
        sx={{
          mt: 8,
          padding: 2,
          borderRadius: "16px",
        }}
      >
        <Typography component="div" variant="h6" sx={{ mb: 2 }}>
          Đăng nhập
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
          onSubmit={handleLogin}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            required
            id="outlined-required"
            label="Tên tài khoản"
            name="username"
            fullWidth
            autoFocus
            value={inputs.username}
            onChange={handleChange}
            error={!!errorMessage.username}
            helperText={errorMessage.username}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <TextField
            required
            id="outlined-password-input"
            label="Mật khẩu"
            type="password"
            name="password"
            fullWidth
            value={inputs.password}
            onChange={handleChange}
            error={!!errorMessage.password}
            helperText={errorMessage.password}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
          <Grid2 container justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox value="remember" />}
              label={<Typography>Nhớ mật khẩu</Typography>}
            />
            <Typography
              onClick={() => setModalType('forgot-password')}
              color="primary.main"
              sx={{ textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
            >
              Quên mật khẩu?
            </Typography>
          </Grid2>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              height: "3rem",
              borderRadius: "12px",
            }}
          >
            <LoginIcon sx={{ mr: 2 }} />
            Đăng nhập
          </Button>
        </Box>
        {!isAdmin && (
          <Box sx={{ display: 'flex', mt: 4, mb: 2 }}>
            Bạn chưa có tài khoản?
            <Typography
              onClick={() => setModalType('register')}
              color="primary.main"
              sx={{ ml: 1, textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
            >
              Đăng ký ngay
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

Login.propTypes = {
  setModalType: PropTypes.func,
  setModalOpen: PropTypes.func,
  isAdmin: PropTypes.bool,
};

export default forwardRef(Login);
