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
    const { userLogin, setUserLogin } = useContext(AuthContext);

    useEffect(() => {
        if (userLogin) {
            navigate('/app');
        }
    }, [userLogin, navigate]);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            const res = await LoginAPI({ username: values.username, password: values.password });
            if (res.data && res.status === 200) {
                localStorage.setItem("access_token", res.data.accessToken);
                localStorage.setItem("user_info", JSON.stringify(res.data.userInfo));
                setUserLogin(res.data.userInfo);
                notification.success({ message: "Login successful" });
                navigate('/app');
            }
        } catch (error) {
            notification.error({ message: "Login failed", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const showForgotPasswordModal = () => setIsModalVisible(true);
    const handleOk = async () => {
        try {
            const response = await sendMailResetPassAPI({ username: modalUsername, email: modalEmail });
            if (response.data && response.status === 200) {
                notification.success({ message: "Recovery link sent" });
                navigate("/reset-password");
            } else {
                notification.warning({ message: "Check the input information" });
            }
        } catch (error) {
            notification.error({ message: "Error sending recovery link", description: error.message });
        } finally {
            setIsModalVisible(false);
            setModalEmail("");
            setModalUsername("");
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setModalEmail("");
        setModalUsername("");
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <Form form={form} name="login" onFinish={onFinish} className="login-form">
                    <h2>Login</h2>
                    <Form.Item name="username" rules={[{ required: true, message: 'Enter username!' }]}>
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Enter password!' }]}>
                        <Input.Password
                            placeholder="Password"
                            autoComplete="current-password" // Add this attribute
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') form.submit();
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoading}>Login</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="link" onClick={showForgotPasswordModal} className="forgot-password-link">Forgot password?</Button>
                    </Form.Item>
                </Form>
                <Modal
                    title="Forgot Password"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Send recovery link"
                >
                    <Input placeholder="Enter email" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} />
                    <Input placeholder="Enter username" value={modalUsername} onChange={(e) => setModalUsername(e.target.value)} />
                </Modal>
            </div>
        </div>
    );
};
