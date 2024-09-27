import React, { useState } from 'react';
import { Form, Input, Button, notification, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import '../styles/LoginStyle.css';

export const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // For modal visibility
    const [modalEmail, setModalEmail] = useState(""); // To store email in the modal
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isEntered, setIsEntered] = useState(false);

    const onFinish = async (values) => {
        if (!isEntered) {
            setIsEntered(true);
            setIsLoading(true);

            notification.info({
                message: "Implement login later",
            });

            // Call API login logic here...
            
            setIsLoading(false);
            setIsEntered(false);
            navigate('/app');
        }
    };

    // Show the modal
    const showForgotPasswordModal = () => {
        setIsModalVisible(true);
    };

    // Handle modal OK
    const handleOk = () => {
        // Handle forgot password logic here, e.g., sending email
        notification.info({
            message: `Password reset link sent to ${modalEmail}`,
        });
        setIsModalVisible(false);
        setModalEmail(""); // Clear input after submit
    };

    // Handle modal Cancel
    const handleCancel = () => {
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
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input placeholder="Email" />
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


//call API login
            // const res = await loginAPI(values.email, values.password);
            // if (res.data) {
            //     notification.success(
            //         {
            //             message: "Login successfully"
            //         }
            //     );
            //     //!SAVE some crucial information user
            //     localStorage.setItem("access_token", res.data.access_token);
            //     setUserLogin(res.data.user);
            //     //redirect into HomePage
            //     navigate("/");
            // } else {
            //     notification.error(
            //         {
            //             message: "Login failed",
            //             description: res.message
            //         }
            //     )
            // }