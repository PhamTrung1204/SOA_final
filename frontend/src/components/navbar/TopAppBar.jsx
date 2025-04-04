import {
    Button, Typography, Toolbar, ListItemText, ListItemButton,
    ListItem, List, IconButton, Drawer, Divider, AppBar, Box, buttonClasses,
    Modal,
    Paper
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandableSearch from '../inputs/ExpandableSearch.jsx'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { AccountCircleOutlined, Image } from '@mui/icons-material';
import { customerNav } from '../../constance/constance.jsx';
import PropTypes from 'prop-types';
import Logo from '../Logo.jsx';
import { CartIcon } from '../../icons/CustomIcons.jsx';
import Login from '../forms/Login.jsx';
import Register from '../forms/Register.jsx';
import ForgotPassword from '../forms/ForgotPassword.jsx';
import { LoadingIcon } from '../../assets/index.js';
import { useSearchProduct } from '../../api/queries.js';
import Loading from '../Loading.jsx';

const drawerWidth = 240;

const NavbarButton = ({ title, path, navIcon, onClick }) =>
    <NavLink to={path}>
        <Button
            onClick={onClick}
            color='black.main'
            size='large'
            sx={{
                [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
                    fontSize: '32px'
                },
                color: 'black.main',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column',
                px: '8px'
            }}>
            {navIcon}
            <Typography variant='button' sx={{ fontSize: '16px', maxWidth: '120px' }} noWrap>
                {title}
            </Typography>
        </Button>
    </NavLink>

const NavbarLink = ({ title, segment }) =>
    <NavLink to={segment} style={{ color: 'black' }}>
        <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={title} />
            </ListItemButton>
        </ListItem>
    </NavLink>

NavbarLink.propTypes = {
    title: PropTypes.string.isRequired,
    segment: PropTypes.string.isRequired
}

NavbarButton.propTypes = {
    title: PropTypes.string.isRequired,
    path: PropTypes.string,
    navIcon: PropTypes.node.isRequired,
    onClick: PropTypes.func
}

const navItems = customerNav;

function TopAppBar() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: isLoadingUser, user } = useAuthContext();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('login')
    const [searchParam, setSearchParam] = useState();

    const { data: searchResult } = useSearchProduct(searchParam);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleModalToggle = () => {
        setModalOpen(!modalOpen)
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Link to={'/'}>
                <Logo margin='12px 0 12px 0' />
            </Link>
            <Divider />
            <List>
                {navItems.map((item) =>
                    <NavbarLink key={item.title} segment={item.segment} title={item.title} />)}
                {isAuthenticated ?
                    <NavbarLink segment='/profile' title={!isLoadingUser ? `${user.firstName} ${user.lastName}` : ""} /> :
                    <NavbarLink segment='/login' title='Đăng nhập' />
                }
            </List>
        </Box>
    );

    const modal = {
        'login': <Login setModalOpen={setModalOpen} setModalType={setModalType} />,
        'register': <Register setModalType={setModalType} />,
        'forgot-password': <ForgotPassword setModalType={setModalType} />
    }


    return (
        <Box component='header' sx={{ display: 'flex', alignItems: 'center' }}>
            <AppBar color='white' component="nav"
                sx={{
                    '& .MuiToolbar-root': {
                        px: '16px'
                    }
                }}
            >
                <Toolbar sx={{ height: '80px' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link to={'/'}>
                        <Button
                            sx={
                                isSearchFocused ?
                                    { display: 'none' } :
                                    {
                                        display: { xs: 'none', md: 'block' },
                                        '&:hover': {
                                            backgroundColor: 'transparent'
                                        },
                                        minWidth: '200px',
                                        textDecoration: 'none'
                                    }}
                        >
                            <Logo />
                        </Button>
                    </Link>
                    <Box sx={
                        isSearchFocused ?
                            { display: 'none' } :
                            { width: '300px', display: { xs: 'none', md: 'block' } }} />
                    <Box
                        sx={{
                            position: 'relative',
                            width: isSearchFocused ? '100%' : '600px',
                            minWidth: '170px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'width 0.3s ease',
                            mx: 'auto'
                        }}
                    >
                        <ExpandableSearch
                            isSearchFocused={isSearchFocused}
                            setIsSearchFocused={setIsSearchFocused}
                            onChange={(query) => {
                                console.log(query)
                                setSearchParam({ productName: query })
                            }}
                        >
                            {
                                searchResult && isSearchFocused && searchParam?.productName &&
                                (
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            position: 'absolute',
                                            top: '90%',
                                            left: 0,
                                            right: 0,
                                            mt: 1,
                                            borderRadius: '8px',
                                            zIndex: 10,
                                        }}
                                    >
                                        {searchResult.length > 0 ?
                                            searchResult.map((result, index) => (
                                                <ListItem button key={index}>
                                                    <Link
                                                        to={`/product/${result.slug}`}
                                                        style={{ textDecoration: "none", color: "inherit" }}
                                                        onClick={(e) => {
                                                            e.preventDefault(); navigate(`/product/${result.slug}`)
                                                            setIsSearchFocused(false);
                                                            setSearchParam(prev => ({ ...prev, productName: '' }))
                                                        }}
                                                    >
                                                        <Box display='inline-flex' gap={1} alignItems="center">
                                                            <Box width="52px" height="52px" component="img" alt={result.productName} src={`${result.imageURLs.length > 0 ? result.imageURLs[0] : <Loading />}`} />
                                                            <Typography>{result.productName}</Typography>
                                                        </Box>
                                                    </Link>
                                                </ListItem>
                                            ))

                                            :
                                            "Không tìm thấy sản phẩm nào"

                                        }
                                    </Paper>
                                )}
                        </ExpandableSearch>
                    </Box>
                    <IconButton
                        color="inherit"
                        edge="end"
                        sx={{ ml: 2, display: { md: 'none' } }}
                    >
                        <Link to='/cart' style={{ color: 'unset' }}>
                            <CartIcon />
                        </Link>
                    </IconButton>
                    <Box sx={
                        isSearchFocused ?
                            { display: 'none' } :
                            { display: { xs: 'none', md: 'flex' }, alignItems: 'center', height: '100%', justifyContent: 'space-between', minWidth: '450px', width: '520px' }
                    }>
                        {navItems.map((item) => (
                            <NavbarButton title={item.title} path={item.segment} navIcon={item.icon} key={item.title} />
                        ))}
                        {
                            isAuthenticated ?
                                <NavbarButton title={!isLoadingUser ? `${user.firstName} ${user.lastName}` : ""} navIcon={!isLoadingUser ? <AccountCircleOutlined /> : <Box component="img" src={LoadingIcon} />} path='/profile' /> :
                                <NavbarButton title='Đăng nhập' navIcon={<AccountCircleOutlined />} onClick={handleModalToggle} />
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Modal
                open={modalOpen}
                onClose={handleModalToggle}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                sx={{ height: '100vh', maxHeight: '100vh', overflow: 'auto' }}
            >
                {modal[modalType]}
            </Modal>
        </Box>
    );
}

export default TopAppBar;
