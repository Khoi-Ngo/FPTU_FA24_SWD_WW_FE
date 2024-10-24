import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthWrapper = (props) => {

    const [userLogin, setUserLogin] = useState(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const userInfo = JSON.parse(localStorage.getItem("user_info"));
            if (userInfo) {
                setUserLogin(userInfo);
            }
        }
        setIsAppLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ userLogin, setUserLogin, isAppLoading }}>
            {isAppLoading ? (
                <div>Loading...</div>
            ) : (
                props.children
            )}
        </AuthContext.Provider>
    );
};

AuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};
