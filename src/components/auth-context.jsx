import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthWrapper = (props) => {

    const [userLogin, setUserLogin] = useState(null); // Bắt đầu với null
    const [isAppLoading, setIsAppLoading] = useState(true); // Trạng thái loading khi kiểm tra token

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const userInfo = JSON.parse(localStorage.getItem("user_info"));
            if (userInfo) {
                setUserLogin(userInfo); // Đặt thông tin người dùng từ localStorage
            }
        }
        setIsAppLoading(false); // Sau khi kiểm tra xong, đặt loading thành false
    }, []);

    return (
        <AuthContext.Provider value={{ userLogin, setUserLogin, isAppLoading }}>
            {isAppLoading ? (
                <div>Loading...</div> // Hiển thị loading cho đến khi kiểm tra token xong
            ) : (
                props.children
            )}
        </AuthContext.Provider>
    );
};

AuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};
