import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Button, Modal, Form, Input, notification } from 'antd';
import { fetchAllUsersAPI, deleteUserApi } from '../../service/api-service/UserApiService';
import { EditOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { UserDetailPopup } from '../../components/User/UserDetailPopup';
import { AddUserForm } from '../../components/User/AddUserForm';
import axios from 'axios';

const tempConstAvt = 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetchAllUsersAPI();
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdate = async () => {
        notification.warning(
            {
                message: "Click update"
            }
        )
    }

    const handleDelete = async (userId) => {
        console.log(`>>>> deleted userid: ${userId}`);
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteUserApi(userId);  // Call the deleteUserApi with the user ID
                    notification.success({
                        message: 'User deleted successfully',
                    });
                    fetchUsers();  // Refresh the user list
                } catch (error) {
                    notification.error({
                        message: 'Failed to delete user',
                        description: error.message,
                    });
                }
            },
        });
    };

    const handleNameClick = (user) => {
        setSelectedUser(user);
        setIsDetailsModalVisible(true);
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalVisible(false);
        setSelectedUser(null);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (avatar) => (
                <img
                    src={tempConstAvt}
                    alt="avatar"
                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                />
            ),
        },
        {
            title: 'Name',
            render: (text, record) => (
                <span
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => handleNameClick(record)}
                >
                    {`${record.firstName} ${record.lastName}`}
                </span>
            ),
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Last Login',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: '',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button style={{margin: 10}} className="btn-delete" onClick={() => handleDelete(record.id)}>
                        <UserDeleteOutlined />
                    </button>
                    <button style={{margin: 10}} className="btn-update" onClick={() => handleUpdate(record.id)}>
                        <EditOutlined />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>User List</h1>
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ margin: '16px' }}>
                Add User
            </Button>
            {!error && (
                <Table
                    dataSource={Array.isArray(users) ? users : []}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                />
            )}
            <Modal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <AddUserForm
                    fetchUsers={fetchUsers}
                    setIsModalVisible={setIsModalVisible}
                />
            </Modal>

            {/* User Details Modal */}
            <Modal
                visible={isDetailsModalVisible}
                onCancel={handleDetailsModalClose}
                footer={[
                    <Button key="close" onClick={handleDetailsModalClose}>
                        Close
                    </Button>,
                ]}
                bodyStyle={{
                    maxHeight: '80vh',  // Set max height of modal body
                    overflowY: 'auto',  // Enable scrolling if content overflows
                }}
                centered
            >
                {selectedUser && (
                    <UserDetailPopup selectedUser={selectedUser} />
                )}
            </Modal>
        </div>
    );
};

export default UserListPage;
