import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';
import { fetchAllUsersAPI } from '../../service/api-service/UserApiService';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetchAllUsersAPI();
            if (response.data.length === 0) {
                console.log('No users found');
            }
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Define table columns for displaying user data
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            render: (text, record) => `${record.firstName} ${record.lastName}`, // Combine firstName and lastName
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
            render: (text) => new Date(text).toLocaleString(), // Format lastLogin date
        },
    ];

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>User List</h1>
            {loading && <Spin tip="Loading users..." />}
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            {!loading && !error && (
                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                />
            )}
        </div>
    );
};

export default UserListPage;
