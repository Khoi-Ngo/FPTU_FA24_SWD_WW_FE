import React, { useEffect, useState } from 'react';
import { Spin, Alert, Card, Row, Col, Typography, Button, Descriptions, Avatar, notification, message, Input, Modal, Flex } from 'antd'; // Add Input component
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUserApi, fetchUserDetail } from '../../services/api-service/UserApiService';

const { Title, Text } = Typography;

export const UserDetailPage = () => {
    const { userId } = useParams();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState(null);
    const navigate = useNavigate();

    //#region update password

    const handleUpdatePassword = () => {
        notification.info({
            message: "Click update password"
        });
    };


    //#endregion

    //#region delete/ disable user
    const handleDisaleUser = async () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteUserApi(userId);
                    notification.success({
                        message: "Disabled done"
                    });
                    const response = await fetchUserDetail(userId);
                    setUserDetail(response.data);
                } catch (ex) {
                    notification.error({
                        message: ex.message,
                    });
                }
            }
        });
    }
    //#endregion

    //#region update profile
    const handleUpdateProfile = () => {
        setIsEditing(true);
        setEditableUser(userDetail); // Initialize editableUser with current user details
    };

    const handleSave = () => {
        setUserDetail(editableUser);
        setIsEditing(false);
        notification.success({
            message: "Successfully updated"
        });
    };

    const handleCancel = () => {
        setEditableUser(userDetail);
        setIsEditing(false);
    };
    //#endregion


    //#region fetch detail user

    useEffect(() => {
        const getUserDetail = async () => {
            try {
                const response = await fetchUserDetail(userId);
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

    //redirect to the user list
    const handleBackToList = () => {
        notification.info({
            message: "Back to the user list"
        })
        navigate('/app/users');
    };


    return (
        <div className="user-detail-container" style={{ minWidth: '100vh', margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <Button type="default" onClick={handleBackToList} style={{ width: '25%', height: '40px', backgroundColor: 'white', margin: '15px' }}>
                Back to list of user
            </Button>
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
                <h2 style={{ textAlign: 'center' }}>{userDetail?.firstName} {userDetail?.lastName}</h2>
                <p className="user-role" style={{ textAlign: 'center', color: 'grey' }}>{userDetail?.role}</p>
                <Descriptions
                    bordered
                    column={1}
                    className="user-descriptions"
                >
                    <Descriptions.Item label="Username">
                        {isEditing ?
                            <Input
                                value={editableUser.username}
                                onChange={(e) => setEditableUser({ ...editableUser, username: e.target.value })}
                            />
                            :
                            userDetail?.username
                        }
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                        {isEditing ?
                            <Input
                                value={editableUser.email}
                                onChange={(e) => setEditableUser({ ...editableUser, email: e.target.value })}
                            />
                            :
                            userDetail?.email
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number">
                        {isEditing ?
                            <Input
                                value={editableUser.phoneNumber}
                                onChange={(e) => setEditableUser({ ...editableUser, phoneNumber: e.target.value })}
                            />
                            :
                            userDetail?.phoneNumber || 'N/A'
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {
                            userDetail.status
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">{new Date(userDetail?.createdAt).toLocaleString()}</Descriptions.Item>

                </Descriptions>
                
                
                <div style={{ marginTop: '10vh' }}>
                    {!isEditing ? (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button type="primary" onClick={handleUpdateProfile} >
                                Update Profile
                            </Button>
                            <Button type="default" onClick={handleUpdatePassword} >
                                Update Password
                            </Button>
                            <Button type="default" onClick={handleDisaleUser} >
                                Disable
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button type="primary" onClick={handleSave} >
                                Save
                            </Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
