import React, { useState, useEffect } from 'react'
import { Table, Spin, Alert, Button, Modal, notification, Input, Form } from 'antd'
import { EditOutlined, PlusOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { fetchAllUsersAPI, deleteUserApi, updateUserApi, fetchUserDetail } from '../../services/api-service/UserApiService'
import { AddUserForm } from '~/components/User/AddUserForm'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const tempConstAvt = 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png'
const mockData = [ /* mock data if needed */]

const UserListPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedId, setSelectedId] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const token = window?.localStorage?.getItem("access_token")
  const authToken = `Bearer ${token}`
  

  //#region fetch all users
  const fetchUsers = async () => {
    try {
      const token = window?.localStorage?.getItem("access_token")
      const response = await fetchAllUsersAPI(`Bearer ${token}`)
      if (response.data) {
        setUsers(response.data)
      } else {
        setUsers(mockData)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching users:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
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
          <Button type="default" variant='solid' style={{background: 'orange', color: 'white', margin: 10}} onClick={() => navigate(`/app/users/${record.id}`)}>
          <ArrowForwardIosIcon />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>User List</h1>
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      <Button type="primary" icon={<PlusOutlined />} shape='round' onClick={() => setIsModalVisible(true)} style={{ margin: '20px' }}>
        Add User
      </Button>
      <Table dataSource={Array.isArray(users) ? users : []} columns={columns} rowKey="id" pagination={{ pageSize: 20 }} />

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
