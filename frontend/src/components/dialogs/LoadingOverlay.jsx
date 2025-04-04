import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingOverlay = ({ message = "Đang xử lý...", visible = false }) => {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{message}</Typography>
      </Box>
    </Box>
  );
};

export default LoadingOverlay;
