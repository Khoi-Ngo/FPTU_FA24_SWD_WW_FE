import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Button, Modal, notification } from 'antd';
import { fetchAllUsersAPI, deleteUserApi } from '../../services/api-service/UserApiService';
import { EditOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { AddUserForm } from '../../components/User/AddUserForm';
import { UserDetailPage } from '../../components/User/UserDetailPage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const tempConstAvt = 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png';

const mockData = [
  {
    id: '1',
    avatar: tempConstAvt,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    accountStatus: 'Verified',
  },
  // Add more mock users here if needed
];

const UserListPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  //#region fetch all users

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsersAPI();
      if (response.data) {
        setUsers(response.data);
      } else {
        setUsers(mockData);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  //#endregion

  //#region delete/disable user

  const handleDelete = async (userId) => {
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
            message: 'User deleted successfully',
          });
          fetchUsers();
        } catch (error) {
          notification.error({
            message: 'Failed to delete user',
            description: error.message,
          });
        }
      },
    });
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedUser(null);
  };
  //#endregion

  //#region update user
  const handleUpdate = async () => {
    // try {

    // } catch (e) {
    //   notification.
    // }
  };
  //#endregion

  //#region column define - list user
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
          src={avatar}
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
      title: '',
      key: 'action',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            style={{ margin: 10 }}
            className="btn-delete"
            onClick={() => handleDelete(record.id)}
          >
            <UserDeleteOutlined />
          </Button>
          <Button
            style={{ margin: 10 }}
            className="btn-update"
            onClick={() => handleUpdate(record.id)}
          >
            <EditOutlined />
          </Button>
          {/* Add the redirect button here */}
          <Button
            style={{ margin: 10 }}
            className="btn-detail"
            onClick={() => navigate(`/app/users/${record.id}`)} // Redirect to UserDetailPage
          >
            View Details
          </Button>

        </div>
      ),
    },
  ];

  //#endregion

  return (
    <div style={{ minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>User List</h1>
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ margin: '20px' }}>
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
        <AddUserForm fetchUsers={fetchUsers} setIsModalVisible={setIsModalVisible} />
      </Modal>


      {selectedUser && <UserDetailPage selectedUserId={selectedUser.id} />}
    </div>
  );
};

export default UserListPage;
