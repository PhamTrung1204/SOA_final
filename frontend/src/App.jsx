import { Route, Routes } from "react-router-dom";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import AuthProvider from "./context/AuthContext";
import RootLayout from './_root/RootLayout';
import { CreateProduct, Favorite, HomePage, Profile, UpdateItem } from './_root/pages';
import './globalStyle.css'
import AdminLayout from './_root/AdminLayout';
import AdminHomePage from './_root/pages/admin/AdminHomePage';
import { adminNav, customerNav } from './constance/constance.jsx';
import { Login } from './components/index.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SnackbarProvider } from 'notistack'
import { CssVarsProvider, extendTheme } from "@mui/joy";
import AuthAdminProvider from "./context/AuthAdminContext.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ManagePersonalProfile from "./_root/pages/customer/ManagePersonalProfile.jsx";
import ManagePersonalOrder from "./_root/pages/customer/ManagePersonalOrder.jsx";
import Product from "./_root/pages/customer/Product.jsx";
import ProductGrid from "./components/ProductGrid/ProductGrid.jsx";
import GridProduct from "./_root/pages/customer/GridProduct.jsx";
import CheckoutPage from "./_root/pages/customer/CheckoutPage.jsx"

const muiTheme = createTheme({
  defaultColorScheme: "light",
  palette: {
    white: {
      main: "#fff",
      smoke: "f5f5f5",
    },
    black: {
      main: "#000",
      light: "#505050",
    },
    blackLight: {
      main: "#757575"
    },
    secondary: {
      main: "#09083d",
    },
    primary: {
      main: "#0672cb",
    },
    error: {
      main: "#f53935"
    }
  },
  typography: {
    fontFamily: "inter",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? "#1d1d1d" : "#ffffff",
          color: theme.palette.mode === 'dark' ? "#ffffff" : "#000000",
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        text: {
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <Container
        component='main'
        maxWidth='xl'
        disableGutters
      >

        <ThemeProvider theme={muiTheme}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            autoHideDuration={1500}
          >
            <CssBaseline />
            <AuthProvider>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/products/:c?/:n?/:pc?/:b?/:t?" element={<GridProduct />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/manage-profile" element={<ManagePersonalProfile />} />
                  <Route path="/manage-order" element={<ManagePersonalOrder />} />
                  <Route path="/favorite" element={<Favorite />} />
                  <Route path="/product/:slug" element={<Product />} />
                  <Route path="/checkoutpage" element={<CheckoutPage />} />
                  {customerNav.map(navItem =>
                    <Route path={navItem.segment} element={navItem.element} key={navItem.title} />
                  )}
                </Route>
              </Routes>
            </AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <AuthAdminProvider>
                <Routes>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminHomePage />} />
                    {adminNav.map(navItem =>
                      navItem.children ?
                        <Route path={navItem.segment} key={navItem.title}>
                          {navItem.children.map(child => (
                            <Route path={child.segment} element={child.element} key={child.title} />
                          ))}
                        </Route> :
                        <Route path={navItem.segment} element={navItem.element} key={navItem.title} />
                    )}
                    <Route path="manage-product/product-detail/:productCode" element={<CreateProduct />} />
                    <Route path="manage-product/create-product" element={<CreateProduct />} />
                    <Route path="manage-inventory/manage-item/" element={<UpdateItem />} />
                  </Route>
                  <Route path="admin/login" element={<Login isAdmin />} />
                </Routes>
              </AuthAdminProvider>
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </Container>
    </QueryClientProvider>
  );
}

export default App;