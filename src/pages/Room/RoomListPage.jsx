import { useEffect, useState } from 'react'
import { Table, Button, Space, Typography, Card, Divider, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PopupDialog from '~/components/PopupDialog'
import CreateRoomForm from './CreateRoomForm'
import { createRoomAPI, deleteRoomAPI, fetchRoomsAPI, updateRoomAPI } from '~/services/api-service/RoomApiService'
import DeleteRoom from './DeleteRoom'
import UpdateRoomForm from './UpdateRoomForm'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import EditIcon from '@mui/icons-material/Edit'

const { Title } = Typography

export const RoomListPage = () => {
  const [data, setData] = useState([])
  const [modalAction, setModalAction] = useState('')
  const [content, setContent] = useState(null)
  const navigate = useNavigate();

  const fetchRoomData = async () => {
    const response = await fetchRoomsAPI()
    const activeRooms = response.filter(room => room.status === 'Active')
    setData(activeRooms)
  }
  useEffect(() => {
    fetchRoomData()
  }, [])
  const columns = [
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName'
    },
    {
      title: 'Location Address',
      dataIndex: 'locationAddress',
      key: 'locationAddress'
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity'
    },
    {
      title: 'Current Occupancy',
      dataIndex: 'currentOccupancy',
      key: 'currentOccupancy'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: record => (
        <Space size="middle">
          <Button type="default" color='primary' variant='solid' onClick={() => handleUpdate(record)}><EditIcon /></Button>
          <Button type="danger" color='danger' variant='solid' onClick={() => handleDelete(record)}><DeleteIcon /></Button>
          <Button type="default" variant='solid' style={{ background: 'orange', color: 'white' }}  onClick={() => handleDetail(record.id)}><ArrowForwardIosIcon /></Button>
        </Space>
      )
    }
  ]
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDetail = (id) => {
    setModalAction('detail')
    console.log(`Navigate to detail page of record with id: ${id}`)
    navigate(`/app/room-details/${id}`); 
  }

  const handleUpdate = (data) => {
    setModalAction('update')
    console.log(`Navigate to update page of record with id: ${data.id}`)
    setIsModalOpen(true)
    setContent(<UpdateRoomForm updateRoom={updateRoom} setIsModalOpen={setIsModalOpen} data={data} setModalAction={setModalAction} isModalOpen={isModalOpen} />)
  }
  const updateRoom = async (id, data) => {
    await updateRoomAPI(id, data).then(() => message.success('Updated Succesfully')).catch(error => {
      message.error(error.response.data.errorMessage)
    })
    fetchRoomData()
  }

  const handleDelete = (data) => {
    setModalAction('delete')
    console.log(`Delete record with id: ${data.id}`)
    setIsModalOpen(true)
    setContent(<DeleteRoom setIsModalOpen={setIsModalOpen} deleteRoom={deleteRoom} data={data} />)
  }
  const deleteRoom = async (id) => {
    await deleteRoomAPI(id).then(() => message.success('Deleted Succesfully')).catch(error => message.error(error.response.data.errorMessage))
    fetchRoomData()
  }


  const handleCreate = () => {
    console.log('Navigate to create new record page')
    setModalAction('create')
    setIsModalOpen(true)
    setContent(<CreateRoomForm createRoom={createRoom} setIsModalOpen={setIsModalOpen} modalAction={modalAction} isModalOpen={isModalOpen} setModalAction={setModalAction} />)

  }
  const createRoom = async (newRoomData) => {
    const createdRoom = await createRoomAPI({ ...newRoomData }).then(() => message.success('Created Succesfully')).catch(error => message.error(error.response.data.errorMessage))
    setData((prevData) => [...prevData, createdRoom])
    fetchRoomData()
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>Room List</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ marginBottom: 16 }}
          shape='round'
        >
          Create New Room
        </Button>
        <Divider />
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <PopupDialog
        title={modalAction === 'create' ? 'Create Room' :
          modalAction === 'delete' ? 'Delete Room' :
            modalAction === 'update' ? 'Update Room' :
              'Room Details'}
        content={content}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen} />
    </div>
  )
}
