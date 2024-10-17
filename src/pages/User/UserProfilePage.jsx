import React, { useContext, useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Spin, message, Button, Input, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../../styles/UserDetailStyle.css';
import { AuthContext } from '../../components/auth-context';


const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Control edit mode
    const [editableUser, setEditableUser] = useState(null); // To store editable user details
    const { userLogin, setUserLogin } = useContext(AuthContext);

    //#region fetch user profile

    useEffect(() => {
        setTimeout(() => {
            setUser(userLogin);
            setEditableUser(userLogin);
            setLoading(false);
        }, 1000);
    }, []);

    //#endregion


    //#region update password
    const handleUpdatePassword = () => {
        notification.info({
            message: "Click update password"
        });
    };

    //#endregion


    //#region upload image
    const handleUploadAvatar = (event) => {
        notification.info({
            message: "Clik upload avatar"
        })
        //TODO implement later
    }
    //#endregion


    //#region update profile
    const handleUpdateProfile = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setUser(editableUser);
        //TODO: implement calling BE and set UserLogin basing on the update
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
                    <Descriptions.Item label="Status">{user.status }</Descriptions.Item>
                    
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

export default UserProfilePage;
