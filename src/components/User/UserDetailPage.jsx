import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Button, Descriptions, Avatar, notification, Input, Modal, Form } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUserApi, fetchUserDetail, resetPasswordADMINApi, updateUserApi } from '../../services/api-service/UserApiService';

export const UserDetailPage = () => {
    const { userId } = useParams();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState({}); // Initialize as an empty object
    const navigate = useNavigate();
    const [passwordform] = Form.useForm();
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;

    //#region update password
    const handleUpdatePassword = () => {
        setIsPasswordModalVisible(true);
    };

    const handleOkPasswordForm = async () => {
        try {
            const values = await passwordform.validateFields();
            const response = await resetPasswordADMINApi({
                username: userDetail.username,
                newPass: values.newPass,
            }, authToken);

            if (response.data && response.status === 200) {
                passwordform.resetFields();
                setIsPasswordModalVisible(false);
                notification.success({ message: "Password updated successfully" });
            } else {
                notification.warning({ message: "Check your action" });
            }
        } catch (error) {
            passwordform.resetFields();
            setIsPasswordModalVisible(false);
            notification.error({ message: "Failed to update password" });
        }
    };

    const handleCancelPasswordForm = () => {
        passwordform.resetFields();
        setIsPasswordModalVisible(false);
    };
    //#endregion

    //#region delete/ disable user
    const handleDisableUser = async () => {
        Modal.confirm({
            title: 'Are you sure you want to disable this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteUserApi(userId, authToken);
                    notification.success({ message: "User disabled" });
                    const response = await fetchUserDetail(userId, authToken);
                    setUserDetail(response.data);
                } catch (ex) {
                    notification.error({ message: ex.message });
                }
            }
        });
    };
    //#endregion

    //#region update profile
    const handleUpdateProfile = () => {
        setEditableUser(userDetail || {}); // Initialize editableUser safely
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await updateUserApi(editableUser, userId, authToken);
            if (response.data && response.status === 200) {
                setUserDetail(editableUser);
                notification.success({ message: "Profile updated successfully" });
            } else {
                notification.warning({ message: "Something went wrong" });
            }
        } catch (error) {
            console.error("Failed to save user profile:", error);
            notification.error({
                message: "Failed to update profile",
                description: error.message
            });
        } finally {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        if (editableUser) {
            setEditableUser({ ...editableUser, [field]: value });
        }
    };
    //#endregion

    //#region fetch user detail
    useEffect(() => {
        const getUserDetail = async () => {
            try {
                const response = await fetchUserDetail(userId, authToken);
                setUserDetail(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        getUserDetail();
    }, [userId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Error fetching user details" type="error" showIcon />;
    }
    //#endregion

    const handleBackToList = () => {
        notification.info({ message: "Back to the user list" });
        navigate('/app/users');
    };

    return (
        <div className="user-detail-container" style={{ minWidth: '100vh', margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <Button type="default" onClick={handleBackToList} style={{ width: '25%', height: '40px', backgroundColor: 'white', margin: '15px' }}>
                Back to list of user
            </Button>
            {/* USER CARD REGION */}
            <Card className="user-card" bordered={false}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Avatar
                        size={64}
                        src={userDetail?.profileImageUrl || 'https://via.placeholder.com/150'}
                        alt="User Avatar"
                        style={{
                            borderRadius: '50%',
                            border: '0.3px solid black',
                        }}
                    />
                </div>
                <h2>{userDetail?.firstName} {userDetail?.lastName}</h2>
                <p className="user-role">{userDetail?.role}</p>
                <Descriptions bordered column={1} className="user-descriptions">
                    <Descriptions.Item label="Username">{userDetail?.username}</Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {isEditing ? (
                            <Input value={editableUser?.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                        ) : (
                            userDetail?.email
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="First name">
                        {isEditing ? (
                            <Input value={editableUser?.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                        ) : (
                            userDetail?.firstName
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last name">
                        {isEditing ? (
                            <Input value={editableUser?.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                        ) : (
                            userDetail?.lastName
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number">
                        {isEditing ? (
                            <Input value={editableUser?.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                        ) : (
                            userDetail?.phoneNumber || 'N/A'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">{userDetail?.status}</Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: '10vh' }}>
                    {!isEditing ? (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button type="primary" onClick={handleUpdateProfile}>Update Profile</Button>
                            <Button type="default" onClick={handleUpdatePassword}>Update Password</Button>
                            <Button type="dange" color='danger' variant='solid' onClick={handleDisableUser}>Disable</Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button type="primary" onClick={handleSave}>Save</Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* RESET PASSWORD REGION */}
            <Modal
                title="Change Password"
                open={isPasswordModalVisible}
                onOk={handleOkPasswordForm}
                onCancel={handleCancelPasswordForm}
                okText="Update"
            >
                <Form form={passwordform} layout="vertical" name="password_form">
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
                                    return Promise.reject(new Error('Passwords do not match!'));
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
