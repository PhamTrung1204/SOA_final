/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useContext } from "react";
import { getLocalstorage, setLocalstorage } from "../util/localstorage";
import { setBearerToken } from "../api/myAxios";
import { getCurrentUser } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
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
    checkAuthAdminUser: async () => { },
};

const AuthAdminContext = createContext(INIT_STATE)

export default function AuthAdminProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(INIT_USER);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    async function checkAuthAdminUser() {
        try {
            const adminCookie = getLocalstorage('adminCookie');

            if (!adminCookie)
                return false;

            setBearerToken(adminCookie);

            const user = await getCurrentUser();
            const { _id } = user

            if (!_id)
                return false
            else
                setUser(user)

            setIsAuthenticated(true);
            return true;
        } catch (error) {
            setLocalstorage('adminCookie', null);
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!location.pathname.startsWith('/admin'))
            return;

        if (
            getLocalstorage('adminCookie') === null
        )
            navigate('/admin/login')
        else
            checkAuthAdminUser();
    }, []);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        setUser,
        setToken,
        setIsAuthenticated,
        checkAuthAdminUser,
    }

    return (
        <AuthAdminContext.Provider value={value}>{children}</AuthAdminContext.Provider>
    )
}

export const useAuthAdminContext = () => useContext(AuthAdminContext);