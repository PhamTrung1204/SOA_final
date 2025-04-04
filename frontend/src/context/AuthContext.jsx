/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useContext } from "react";
import { getLocalstorage, setLocalstorage, removeLocalstorage } from "../util/localstorage";
import { setBearerToken } from "../api/myAxios";
import { getCurrentUser } from "../api/api";
import { enqueueSnackbar as toaster } from 'notistack';

const INIT_USER = {
    id: '',
    name: '',
    username: '',
    firstName: '',
    lastName: '',
    accountStatus: '',
    accountRole: '',
}

const INIT_STATE = {
    user: INIT_USER,
    isAuthenticated: false,
    isLoading: false,
    setUser() { },
    setIsAuthenticated() { },
    checkAuthUser: async () => false,
    logout: () => {},
};

const AuthContext = createContext(INIT_STATE)

export default function AuthProvider({ children }) {
    // const navigate = useNavigate();

    const [user, setUser] = useState(INIT_USER);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    async function checkAuthUser() {
        try {
            const cookieFallback = getLocalstorage('cookieFallback');
            
            if(!cookieFallback)
                return false;

            setBearerToken(cookieFallback);
            
            // if return user
            // setUser(cookieFallback)

            // if return token
            const user = await getCurrentUser();
            const { _id} = user
            console.log(_id);
            
            
            if (!_id)
                return false
            else
                setUser(user)

            setIsAuthenticated(true);
            return true;
        } catch (error) {
            setLocalstorage('cookieFallback',null);
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        removeLocalstorage('cookieFallback');
        setUser(INIT_USER);
        setIsAuthenticated(false);
        setBearerToken(null);
        toaster('Đăng xuất thành công', { variant: 'success' });
    };

    useEffect(() => {
        if (
            localStorage.getItem('cookieFallback') === null
        )
            console.log('not found');
        else
            checkAuthUser();
    }, []);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        setUser,
        setToken,
        setIsAuthenticated,
        checkAuthUser,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);