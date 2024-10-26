
import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthWrapper = ({ children }) => {
    const [userLogin, setUserLogin] = useState(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const userInfo = JSON.parse(localStorage.getItem("user_info"));
                setUserLogin(userInfo);
            } catch (error) {
                console.error("Failed to parse user info:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_info");
            }
        }
        setIsAppLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ userLogin, setUserLogin, isAppLoading }}>
            {isAppLoading ? (
                <div>Loading...</div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

AuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};
