import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import '../styles/LoginStyle.css';
import { LoginAPI } from '../services/api-service/AuthApiService';
import { AuthContext } from '../components/auth-context';
import { sendMailResetPassAPI } from '~/services/api-service/UserApiService';

export const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalEmail, setModalEmail] = useState("");
    const [modalUsername, setModalUsername] = useState("");
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isEntered, setIsEntered] = useState(false);
    const { userLogin, setUserLogin } = useContext(AuthContext);

    // Kiểm tra xem người dùng đã đăng nhập chưa
    useEffect(() => {
        if (userLogin) {
            navigate('/app'); // Nếu đã đăng nhập, chuyển hướng đến /app
        }
    }, [userLogin, navigate]);

    const onFinish = async (values) => {
        try {
            if (!isEntered) {
                setIsEntered(true);
                setIsLoading(true);

                const res = await LoginAPI({ username: values.username, password: values.password });

                if (res.data && res.status === 200) {
                    // Lưu token và thông tin người dùng
                    localStorage.setItem("access_token", res.data.accessToken);
                    localStorage.setItem("user_info", JSON.stringify(res.data.userInfo)); // Lưu thông tin người dùng vào localStorage
                    setUserLogin(res.data.userInfo); // Set thông tin người dùng trong AuthContext
                    notification.info({
                        message: "Login successfully",
                    });

                    setIsLoading(false);
                    setIsEntered(false);
                    navigate('/app');
                }
            }
        } catch (error) {
            notification.error({
                message: "Login failed"
            });
            form.resetFields();
        }
    };

    // Hiển thị modal quên mật khẩu
    const showForgotPasswordModal = () => setIsModalVisible(true);

    // Xử lý khi nhấn OK trên modal
    const handleOk = async () => {
        try {
            setIsModalVisible(false);
            setModalEmail("");
            setModalUsername("");
            const response = await sendMailResetPassAPI({
                username: modalUsername,
                email: modalEmail,
            });
            if (response.data && response.status === 200) {
                navigate("/reset-password");
                notification.success({
                    message: "Code sent"
                });
            } else {
                notification.warning({
                    message: "Need check action"
                });
            }
        } catch (error) {
            notification.error({
                message: "Something went wrong"
            });
        }
    };

    // Đóng modal khi cancel
    const handleCancel = () => {
        setModalEmail("");
        setModalUsername("");
        setIsModalVisible(false);
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    className="login-form"
                >
                    <h2>Login</h2>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            placeholder="Password"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') form.submit();
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoading}>
                            Log in
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="link" onClick={showForgotPasswordModal} className="forgot-password-link">
                            Forgot password?
                        </Button>
                    </Form.Item>
                </Form>

                {/* Modal for password reset */}
                <Modal
                    title="Forgot Password"
                    open={isModalVisible}  // Thay thế visible bằng open
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Send Reset Link"
                >
                    <Input
                        placeholder="Enter your email"
                        value={modalEmail}
                        onChange={(e) => setModalEmail(e.target.value)}
                    />

                    <Input
                        placeholder="Enter your username"
                        value={modalUsername}
                        onChange={(e) => setModalUsername(e.target.value)}
                    />
                </Modal>

            </div>
        </div>
    );
};
