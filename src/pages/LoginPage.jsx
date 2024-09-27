import React, { useContext, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../styles/LoginStyle.css';




export const LoginPage = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // const { setUserLogin } = useContext(AuthContext);
    const [isEntered, setIsEntered] = useState(false);

    const onFinish = async (values) => {
        //TODO: Implement later

        if (!isEntered) {
            setIsEntered(true);
            setIsLoading(true);

            notification.info(
                {
                    message: "Implement login later",
                }
            )

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
            setIsLoading(false);
            setIsEntered(false);
        }

    };

    return (
        <div className="login-page">
            {/* TODO: inserting background */}
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
                        <Input.Password placeholder="Password"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') form.submit()
                            }}

                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoading}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );

}