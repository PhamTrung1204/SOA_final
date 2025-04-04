import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { TopAppBar } from "../components";

function RootLayout() {
  return (
    <>
      <Container sx={{ py: "92px",  px:{md: '12px',xs: '4px'}}}>
        <TopAppBar />

        <Outlet />
      </Container>
    </>
  );
}

export default RootLayout;
