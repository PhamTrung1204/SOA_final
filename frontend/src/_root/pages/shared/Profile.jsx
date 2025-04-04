import React, { useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Box, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import SeenProducts from '../../../components/ProductDetails/SeenProducts';

function Profile() {
    const { user, isAuthenticated, isLoading, logout } = useAuthContext();
    const navigate = useNavigate();

    // Redirect to the homepage if the user is not authenticated and loading is complete
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return (
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            {/* Header section with username and logout button */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, mt: 4 }}>
                <Typography variant="h4">
                    {!isLoading ? `${user.firstName} ${user.lastName}` : ""}
                </Typography>
                <Button
                    variant="contained"
                    onClick={logout}
                    sx={{ height: 'fit-content' }}
                >
                    Đăng xuất
                </Button>
            </Box>

            {/* Navigation List */}
            <List>
                <ListItem button component={Link} to="/manage-profile">
                    <ListItemText primary="Quản lý hồ sơ" />
                </ListItem>
                <ListItem button component={Link} to="/manage-order">
                    <ListItemText primary="Quản lý đơn hàng" />
                </ListItem>
                <ListItem button component={Link} to="/favorite">
                    <ListItemText primary="Sản phẩm yêu thích" />
                </ListItem>
            </List>
            
            {/* Recently Viewed Products */}
            <SeenProducts />
        </Container>
    );
}

export default Profile;
