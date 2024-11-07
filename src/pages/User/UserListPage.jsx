import React, { useState, useEffect } from 'react'
import { Table, Spin, Alert, Button, Modal, notification, Input, Form, Select } from 'antd'
import { EditOutlined, PlusOutlined, SearchOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { fetchAllUsersAPI, deleteUserApi, updateUserApi, fetchUserDetail } from '../../services/api-service/UserApiService'
import { AddUserForm } from '~/components/User/AddUserForm'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
const { Option } = Select;



const UserListPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedId, setSelectedId] = useState(0)
  const token = window?.localStorage?.getItem("access_token")
  const authToken = `Bearer ${token}`;
  const [loading, setLoading] = useState(true);

  //filter, search, sort

  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');


  //#region fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = window?.localStorage?.getItem("access_token")
      const response = await fetchAllUsersAPI(`Bearer ${token}`)
      if (response.data) {
        setUsers(response.data)
      } else {
        notification.warning(
          {
            message: "Something wrong",
          }
        )
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    setFilteredUsers(users);
  }, [])
  //#endregion

  //#region update user
  const handleUpdate = async (userId) => {

    try {
      setSelectedId(userId)
      const response = await fetchUserDetail(userId, authToken)
      setSelectedUser(response.data)
      setIsModalUpdateVisible(true)
    } catch (error) {
      notification.error({ message: 'Error fetching user data', description: error.message })
    }
  }

  const handleSave = async (values) => {
    try {
      await updateUserApi(values, selectedId, authToken)
      notification.success({ message: 'User updated successfully' })
      setIsModalVisible(false)
      setSelectedUser(null)
      fetchUsers() // Refresh the user list after updating
    } catch (error) {
      notification.error({ message: 'Failed to update user', description: error.message })
    } finally {
      await fetchUsers()
      hiddenModalUpdate()
    }
  }

  const hiddenModalUpdate = () => {
    selectedUser.firstName = ""
    selectedUser.lastName = ""
    selectedUser.email = ""
    selectedUser.phoneNumber = ""



    setIsModalUpdateVisible(false)
  }
  //#endregion

  //#region delete user
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteUserApi(userId, authToken)
          notification.success({ message: 'User deleted successfully' })
          fetchUsers()
        } catch (error) {
          notification.error({ message: 'Failed to delete user', description: error.message })
        }
      },
    })
  }
  //#endregion

  const columns = [
    // columns for user list
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Avatar', dataIndex: 'avatar', render: (avatar) => (
        <img src={avatar} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />
      )
    },
    {
      title: 'Name', render: (text, record) => (
        <span style={{ cursor: 'pointer', color: 'blue' }}>{`${record.firstName} ${record.lastName}`}</span>
      ), key: 'name'
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: '', key: 'action', render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="default" color='primary' variant='solid' style={{ margin: 10 }} onClick={() => handleUpdate(record.id)}>
            <EditIcon />
          </Button>
          <Button color='danger' variant='solid' style={{ margin: 10 }} onClick={() => handleDelete(record.id)}>
            <DeleteIcon />
          </Button>
          <Button type="default" variant='solid' style={{ background: 'orange', color: 'white', margin: 10 }} onClick={() => navigate(`/app/users/${record.id}`)}>
            <ArrowForwardIosIcon />
          </Button>
        </div>
      ),
    },
  ]


  //#region handling filter, search, sort on the UI table
  useEffect(() => {
    handleSearchAndFilter();
  }, [users, searchText, roleFilter, statusFilter]);

  const handleSearchAndFilter = () => {
    let filteredData = users;
    if (searchText) {
      filteredData = filteredData.filter(user =>
        user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (roleFilter) {
      filteredData = filteredData.filter(user => user.role === roleFilter);
    }
    if (statusFilter) {
      filteredData = filteredData.filter(user => user.status === statusFilter);
    }
    setFilteredUsers(filteredData);
  };
  //#endregion

  return (
    <div style={{ minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>User List</h1>
      {error && <Alert message="Error" description={error} type="error" showIcon />}







      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin tip="Loading users..." size="large" />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '30px',alignItems: 'center', width: '80%', marginLeft: 'auto', marginRight: '80px' }}>
            <Input
              placeholder="Search by name or email"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={value => setRoleFilter(value)}
              style={{ width: 150 }}
            >
              <Option value="">All Roles</Option>
              <Option value="ADMIN">Admin</Option>
              <Option value="STAFF">Staff</Option>
              <Option value="MANAGER">Manager</Option>

            </Select>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={value => setStatusFilter(value)}
              style={{ width: 150 }}
            >
              <Option value="">All Statuses</Option>
              <Option value="Active">Active</Option>
              <Option value="InActive">Inactive</Option>
            </Select>
            <Button onClick={() => {
              setSearchText('');
              setRoleFilter('');
              setStatusFilter('');
              setFilteredUsers(users);
            }}>
              Reset Filters
            </Button>
          </div>
          <Button type="primary" icon={<PlusOutlined />} shape='round' onClick={() => setIsModalVisible(true)} style={{ margin: '20px' }}>
            Add User
          </Button>
          {/* <Table dataSource={Array.isArray(users) ? users : []} columns={columns} rowKey="id" pagination={{ pageSize: 20 }} /> */}
          <Table dataSource={Array.isArray(filteredUsers) ? filteredUsers : []} columns={columns} rowKey="id" pagination={{ pageSize: 7 }} />
        </>
      )}
      {/* Update User Modal */}
      <Modal
        open={isModalUpdateVisible}
        onCancel={hiddenModalUpdate}
        onOk={handleSave}
        footer={null}
      >
        {selectedUser && (
          <Form
            initialValues={{
              firstName: selectedUser.firstName,
              lastName: selectedUser.lastName,
              email: selectedUser.email,
              phoneNumber: selectedUser.phoneNumber,
            }}
            onFinish={handleSave}
          >
            <Form.Item name="firstName" label="First Name">
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <AddUserForm fetchUsers={fetchUsers} setIsModalVisible={setIsModalVisible} token={authToken} />
      </Modal>
    </div>
  )
}

export default UserListPage
