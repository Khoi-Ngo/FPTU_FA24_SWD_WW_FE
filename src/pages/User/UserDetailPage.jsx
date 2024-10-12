import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Spin, message, Button, Input, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../../styles/UserDetailStyle.css';

const tempConstAvt = 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png';

const UserDetailPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Control edit mode
    const [editableUser, setEditableUser] = useState(null); // To store editable user details

    useEffect(() => {
        const mockUser = {
            id: 1,
            username: 'john.doe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '123-456-7890',
            role: 'Admin',
            status: 'Active',
            lastLogin: '2024-09-25T12:34:56Z',
            createdAt: '2023-01-15T08:23:11Z',
            preferredLanguage: 'English',
            timeZone: 'America/New_York',
            profileImageUrl: tempConstAvt,
            bio: 'A software engineer with a passion for developing backend systems.',
        };

        setTimeout(() => {
            setUser(mockUser);
            setEditableUser(mockUser); // Set initial editable user
            setLoading(false);
        }, 1000);
    }, []);

    const handleUpdateProfile = () => {
        setIsEditing(true);
    };

    const handleUpdatePassword = () => {
        notification.info({
            message: "Click update password"
        });
    };

    const handleUploadAvatar = (event) => {
        notification.info({
            message: "Clik upload avatar"
        })
        //TODO implement later
    }

    const handleSave = () => {
        // Implement save logic, e.g., sending data to the backend
        setUser(editableUser); // Update the user state with new data
        setIsEditing(false);
        notification.success({
            message: "Successfully"
        })
    };

    const handleCancel = () => {
        setEditableUser(user); // Reset editable user details
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditableUser({ ...editableUser, [field]: value });
    };

    if (loading) {
        return <Spin className="loading-spinner" />;
    }

    if (!user) {
        return <div className="error-message">No user data available.</div>;
    }

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
                <label
                    style={{ marginTop: 10, cursor: 'pointer', color: 'gray' }}
                    htmlFor="btnUpload"
                >
                    Change avatar
                </label>
                <input
                    type="file"
                    hidden
                    id="btnUpload"
                    onChange={(event) => handleUploadAvatar(event)}
                />
                <h2>{editableUser.firstName} {editableUser.lastName}</h2>
                <p className="user-role">{user.role}</p>
                <Descriptions
                    bordered
                    column={1}
                    className="user-descriptions"
                >
                    <Descriptions.Item label="Username">
                        {isEditing ? (
                            <Input
                                value={editableUser.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                            />
                        ) : (
                            user.username
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {isEditing ? (
                            <Input
                                value={editableUser.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        ) : (
                            user.email
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone Number">
                        {isEditing ? (
                            <Input
                                value={editableUser.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                        ) : (
                            user.phoneNumber || 'N/A'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">{user.status || 'Active'}</Descriptions.Item>
                    <Descriptions.Item label="Last Login">{new Date(user.lastLogin).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Created At">{new Date(user.createdAt).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Preferred Language">
                        {isEditing ? (
                            <Input
                                value={editableUser.preferredLanguage}
                                onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                            />
                        ) : (
                            user.preferredLanguage || 'English'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Time Zone">
                        {isEditing ? (
                            <Input
                                value={editableUser.timeZone}
                                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                            />
                        ) : (
                            user.timeZone || 'N/A'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bio">
                        {isEditing ? (
                            <Input
                                value={editableUser.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                            />
                        ) : (
                            user.bio || 'No bio available.'
                        )}
                    </Descriptions.Item>
                </Descriptions>

                {/* Conditionally render buttons */}
                <div style={{ marginTop: '10vh' }}>
                    {!isEditing ? (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                            <Button type="primary" onClick={handleUpdateProfile} >
                                Update Profile
                            </Button>

                            <Button type="default" onClick={handleUpdatePassword} >
                                Update Password
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

export default UserDetailPage;
