import { forwardRef, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
  Grid2,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({setModalType}, ref) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Regex for validating email format
  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email");
    } else if (emailRegex.test(email)) {
      setError("");
      console.log("Email hợp lệ:", email);
    } else {
      setError("Vui lòng nhập đúng định dạng email");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={10}
        sx={{
          padding: 5,
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
          Quên mật khẩu
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            fontFamily: "Nunito",
            color: "primary.main",
            fontWeight: "bold",
            textAlign: "center",
            mb: 3,
          }}
        >
          FCOMPUTER
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Hãy nhập Email của bạn vào bên dưới để bắt đầu quá trình khôi phục mật khẩu.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              height: "3rem",
              fontSize: { xs: "0.9rem", md: "1rem" },
              borderRadius: "12px",
            }}
          >
            <SendIcon sx={{ mr: 1 }} />
            Gửi yêu cầu
          </Button>
        </Box>

        <Box
          sx={{ display: 'flex', mt: 4, mb: 2}}
        >
          <Typography
            onClick={()=>setModalType('login')}
            color='primary.main'
            sx={{ ml: 1, fontSize: "1rem", textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
          >
            Tiếp tục đăng nhập
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default forwardRef(ForgotPassword);