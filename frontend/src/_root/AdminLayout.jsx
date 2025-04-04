import { AppProvider } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { useMemo, useState } from "react"
import Logo from '../components/Logo'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { Box, createTheme, Grid2, IconButton, Typography, useTheme } from '@mui/material'
import { adminNav } from '../constance/constance.jsx'
import { ArrowBack } from '@mui/icons-material'

const initSession = {
  user: null
}

function AdminLayout() {
  const [pathname, setPathname] = useState('/admin');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme()

  // useEffect(() => {
  //   if (session.user === null) {
  //     navigate('login');
  //   } else {
  //     return;
  //   }
  // }, [session.user, navigate]);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        navigate('/admin' + path);
        setPathname(path);
      },
    };
  }, [navigate, pathname]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/admin');
    window.location.reload();
  }

  return (
    <AppProvider
      theme={theme}
      navigation={adminNav}
      router={router}
      branding={{
        title: '', logo:
          <Box
            component='div'
            onClick={handleLogoClick}
            display='flex'
            alignItems='center'
            height="100%"
            justifyContent='center'
            flexDirection={{xs:'column', md:'row'}}
          >
            <Logo lineHeight={1} fontSize={{xs: '1.2rem', md:'1.5rem'}}/>
            <Typography lineHeight='1rem' variant='subtitle2' ml={{ sm: '12px', xs: 'none' }} fontSize={{xs:'0.5rem', md:'1rem'}}>Admin</Typography>
          </Box>
      }}
    >
      <DashboardLayout>
        <Box>
          {
            !location.pathname.startsWith('/admin') &&
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
          }
        </Box>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  )
}

export default AdminLayout