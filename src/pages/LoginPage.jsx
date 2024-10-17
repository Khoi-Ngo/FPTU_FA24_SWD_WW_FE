import React, { useContext, useState } from 'react';
import { Form, Input, Button, notification, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import '../styles/LoginStyle.css';
import { LoginAPI } from '../services/api-service/AuthApiService';
import { AuthContext } from '../components/auth-context';

export const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // For modal visibility
    const [modalEmail, setModalEmail] = useState(""); // To store email in the modal
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isEntered, setIsEntered] = useState(false);


    const { userLogin, setUserLogin } = useContext(AuthContext);

    const onFinish = async (values) => {
        try {
            if (!isEntered) {
                setIsEntered(true);
                setIsLoading(true);


                const res = await LoginAPI({ username: values.username, password: values.password });

                if (res.data && res.status == 200) {
                    //login ok
                    localStorage.setItem("access_token", res.data.accessToken);
                    setUserLogin(res.data.userInfo);
                    
                }
                notification.info({
                    message: "Login successfully",
                });


                setIsLoading(false);
                setIsEntered(false);
                navigate('/app');
            }
        } catch (error) {
            notification.error({
                message: "Login failed"
            })
        }
    };

    // Show the modal
    const showForgotPasswordModal = () => {
        setIsModalVisible(true);
    };

    // Handle modal OK
    const handleOk = () => {

        //TODO: call api send code verification 

        navigate("/resetpassword");


        // Handle forgot password logic here, e.g., sending email
        notification.info({
            message: `Password reset link sent to ${modalEmail}`,
        });
        setIsModalVisible(false);
        setModalEmail(""); // Clear input after submit
    };

    // Handle modal Cancel
    const handleCancel = () => {
        setModalEmail(""); // Clear input after cancel
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
                        <Input placeholder="username" />
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

                    {/* Forgot password link */}
                    <Form.Item>
                        <Button type="link" onClick={showForgotPasswordModal} className="forgot-password-link">
                            Forgot password?
                        </Button>
                    </Form.Item>
                </Form>

                {/* Modal for password reset */}
                <Modal
                    title="Forgot Password"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Send Reset Link"
                >
                    <Input
                        placeholder="Enter your email"
                        value={modalEmail}
                        onChange={(e) => setModalEmail(e.target.value)}
                    />
                </Modal>
            </div>
        </div>
    );
};


