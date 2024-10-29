import { useEffect, useState } from 'react'
import { Table, Button, Space, Typography, Card, Divider, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PopupDialog from '~/components/PopupDialog'
import { fetchRoomDetailsAPI, removeWineFromRoomAPI } from '~/services/api-service/RoomDetailsService'
import RemoveWineFromRoom from './RemoveWineFromRoom'
import { useParams } from 'react-router-dom'
import { fetchWineRoomsByWineId } from '~/services/api-service/WineRoomeApiService'

const { Title } = Typography

function RoomDetails() {
  const [data, setData] = useState([])
  const [modalAction, setModalAction] = useState('')
  const [content, setContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const roomId = useParams().roomId
  
  const columns = [
    {
      title: 'Wine Name',
      dataIndex: 'wineName',
      key: 'wineName'
    },
    {
      title: 'Initial Quantity',
      dataIndex: 'initialQuantity',
      key: 'initialQuantity'
    },
    {
      title: 'Current Quantity',
      dataIndex: 'currentQuantity',
      key: 'currentQuantity'
    },
    {
      title: 'Total Import Quantity',
      dataIndex: 'import',
      key: 'import'
    },
    {
      title: 'Total Export Quantity',
      dataIndex: 'export',
      key: 'export'
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: record => (
    //     <Space size="middle">
    //       <Button type="primary" onClick={() => handleDetail(record)}>Detail</Button>
    //       <Button type="default" onClick={() => handleUpdate(record)}>Update</Button>
    //       <Button type="danger" onClick={() => handleDelete(record)}>Delete</Button>
    //     </Space>
    //   )
    // }
  ]
  useEffect(() => {
    fetchRoomDetailsData(roomId)
  }, [])
  
  const fetchRoomDetailsData = async (id) => {
    const response = await fetchRoomDetailsAPI(id)
    //const activeRooms = response.filter(room => room.status === 'Active')
    // const transformedData = response.map(item => ({
    //   ...item,
    //   wineName: item.wineId.length > 0 ? item.wineId[0]?.name : 'Unknown'
    // }))
    setData(response.wineRooms)
    //setData(response)
  }
  const handleCreate = () => {
    console.log('Navigate to create new record page')
    setModalAction('create')
    setIsModalOpen(true)
    //setContent(<CreateRoomForm createRoom={createRoom} setIsModalOpen={setIsModalOpen} modalAction={modalAction} isModalOpen={isModalOpen} setModalAction={setModalAction} />)

  }
  const handleDetail = (id) => {
    setModalAction('detail')
    console.log(`Navigate to detail page of record with id: ${id}`)
  }
  const handleDelete = (data) => {
    setModalAction('delete')
    console.log(`Delete record with id: ${data.id}`)
    setIsModalOpen(true)
    setContent(<RemoveWineFromRoom setIsModalOpen={setIsModalOpen} removeWineFromRoom={removeWineFromRoom} data={data} />)
  }
  const removeWineFromRoom = async (id) => {
    await removeWineFromRoomAPI(id).then(() => message.success('Removed Succesfully')).catch(error => message.error(error.response.data.errorMessage))
    fetchRoomDetailsData()
  }
  const handleUpdate = (data) => {
    setModalAction('update')
    console.log(`Navigate to update page of record with id: ${data.id}`)
    setIsModalOpen(true)
    //setContent(<UpdateRoomForm updateRoom={updateRoom} setIsModalOpen={setIsModalOpen} data={data} setModalAction={setModalAction} isModalOpen={isModalOpen} />)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>Room Details</Title>
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ marginBottom: 16 }}
        >
          Add Wine to this room
        </Button> */}
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
        title={modalAction === 'create' ? 'Add Wine' :
          modalAction === 'delete' ? 'Delete Room' :
            modalAction === 'update' ? 'Update Room' :
              'Room Details'}
        content={content}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen} />
    </div>
  )
}

export default RoomDetails
