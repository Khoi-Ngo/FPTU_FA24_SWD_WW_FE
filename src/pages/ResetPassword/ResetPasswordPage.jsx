import React from 'react';
import { Form, Input, Button, Alert, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/ResetPasswordStyle.css';

export const ResetPasswordPage = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const onFinish = (values) => {
        if (values.newPassword !== values.confirmNewPassword) {
            setError('Passwords do not match!');
        } else {
            setError(null);
            //TODO: call API for reset password


            notification.info({
                message: "The reset password will be implemented later",
                description: "There is no BE API yet"
            })
            navigate("/");
            console.log('Password reset successful:', values);
        }
    };


    return (
        <div className="reset-password-page">
            <div className="reset-password-form-container">
                <h2>Reset Password</h2>
                {error && <Alert message={error} type="error" showIcon />}
                <Form
                    form={form}
                    name="reset_password"
                    onFinish={onFinish}
                    layout="vertical"
                    className="reset-password-form"
                >
                    <Form.Item
                        name="codeSent"
                        label="Code Sent"
                        rules={[{ required: true, message: 'Please input the code sent to you!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[{ required: true, message: 'Please input your new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        rules={[{ required: true, message: 'Please confirm your new password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="reset-password-form-button">
                            OK
                        </Button>
                    </Form.Item>
                </Form>
                <Button type="link" className="reset-password-form-button">
                    <Link to="/login">Back to login</Link>
                </Button>
            </div>
        </div>
    );
};

export default ResetPasswordPage;



