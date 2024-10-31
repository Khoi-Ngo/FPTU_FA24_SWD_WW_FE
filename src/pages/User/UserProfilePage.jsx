import React, { useContext, useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Spin, message, Button, Input, notification, Modal, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../../styles/UserDetailStyle.css';
import { AuthContext } from '../../components/auth-context';

import { fetchUserDetail, updatePasswordApi, updateUserApi } from '~/services/api-service/UserApiService';

const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState(null);
    const { userLogin, setUserLogin } = useContext(AuthContext);
    const [passwordform] = Form.useForm(); // Initialize the form instance here
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;

    //#region fetch user profile
    useEffect(() => {
        setTimeout(() => {
            setUser(userLogin);
            setEditableUser(userLogin);
            setLoading(false);
        }, 1000);
    }, [userLogin]);
    //#endregion

    //#region update password
    const handleUpdatePassword = () => {
        // Show pop up including 3 fields: old password, new password, confirm password
        setIsPasswordModalVisible(true);
    };

    const handleOkPasswordForm = async () => {
        // Validate and submit the form
        try {
            const values = await passwordform.validateFields();
            console.log(">>>> Check user login", userLogin.username);

            const response = await updatePasswordApi(
                {
                    newPass: values.newPass,
                    oldPass: values.oldPass,
                    username: userLogin.username
                }, authToken
            );
            if (response.data && response.status === 200) {
                passwordform.resetFields(); // Reset the form when canceled
                setIsPasswordModalVisible(false);
                notification.success(
                    {
                        message: "OK"
                    }
                )
            } else {
                passwordform.resetFields(); // Reset the form when canceled
                setIsPasswordModalVisible(false);
                notification.warning(
                    {
                        message: "NEED CHECK ACTION"
                    }
                )
            }

        } catch (error) {
            passwordform.resetFields(); // Reset the form when canceled
            setIsPasswordModalVisible(false);
            notification.error(
                {
                    message: "FAILED"
                }
            )
        }
    };

    const handleCancelPasswordForm = () => {
        passwordform.resetFields(); // Reset the form when canceled
        setIsPasswordModalVisible(false);
    };
    //#endregion

    //#region upload image
    const handleUploadAvatar = (event) => {
        notification.info({
            message: 'Clicked upload avatar',
        });
        // TODO: Implement later
    };
    //#endregion

    //#region update profile
    const handleUpdateProfile = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await updateUserApi(editableUser, userLogin.id, authToken);
            if (response.data && response.status === 200) {
                setUser(editableUser);
                setUserLogin(editableUser);
                notification.success({
                    message: 'Profile Updated Successfully',
                });
            } else {
                notification.warning({
                    message: 'Something went wrong',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Failed to update profile',
                description: error.message,
            });
            setUser(userLogin);
        } finally {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTimeout(() => {
            setUser(userLogin);
            setEditableUser(userLogin);
        }, 1000);
    };

    const handleInputChange = (field, value) => {
        setEditableUser({ ...editableUser, [field]: value });
    };
    //#endregion

    //#region init
    if (loading) {
        return <Spin className="loading-spinner" />;
    }

    if (!user) {
        return <div className="error-message">No user data available.</div>;
    }
    //#endregion

    return (
        <div className="user-detail-container">
            <Card className="user-card">
                <Avatar
                    size={64}
                    src={user.profileImageUrl}
                    alt="User Avatar"
                    style={{
                        borderRadius: '50%',
                        border: '0.3px solid black',
                    }}
                />
                <label style={{ marginTop: 10, cursor: 'pointer', color: 'gray' }} htmlFor="btnUpload">
                    Change avatar
                </label>
                <input type="file" hidden id="btnUpload" onChange={handleUploadAvatar} />
                <h2>{user.firstName} {user.lastName}</h2>
                <p className="user-role">{user.role}</p>
                <Descriptions bordered column={1} className="user-descriptions">
                    <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {isEditing ? (
                            <Input value={editableUser.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                        ) : user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="First name">
                        {isEditing ? (
                            <Input value={editableUser.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                        ) : user.firstName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last name">
                        {isEditing ? (
                            <Input value={editableUser.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                        ) : user.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number">
                        {isEditing ? (
                            <Input value={editableUser.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                        ) : user.phoneNumber || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">{user.status}</Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: '10vh' }}>
                    {!isEditing ? (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button type="primary" onClick={handleUpdateProfile}>Update Profile</Button>
                            <Button type="default" onClick={handleUpdatePassword}>Update Password</Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button type="primary" onClick={handleSave}>Save</Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* UPDATE PASSWORD MODAL */}
            <Modal
                title="Change Password"
                visible={isPasswordModalVisible}
                onOk={handleOkPasswordForm}
                onCancel={handleCancelPasswordForm}
                okText="Update"
            >
                <Form form={passwordform} layout="vertical" name="password_form">
                    <Form.Item
                        label="Old Password"
                        name="oldPass"
                        rules={[
                            { required: true, message: 'Please input your old password!' },
                            { min: 8, message: 'Password must be at least 8 characters!' },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPass"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 8, message: 'Password must be at least 8 characters!' },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPass"
                        dependencies={['newPass']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPass') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfilePage;
