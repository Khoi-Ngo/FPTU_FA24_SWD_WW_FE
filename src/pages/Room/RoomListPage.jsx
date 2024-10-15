import { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PopupDialog from '~/components/PopupDialog';
import CreateRoomForm from './CreateRoomForm';
import { createRoomAPI, deleteRoomAPI, fetchRoomsAPI, updateRoomAPI } from '~/services/api-service/RoomApiService';
import DeleteRoom from './DeleteRoom';

const { Title } = Typography;

// Mock Data
const mockRooms = [
  {
    id: 1,
    roomName: "Tasting Room 1",
    locationAddress: "123 Vineyard Lane",
    capacity: 50,
    currentOccupancy: 30,
    managerName: "John Doe",
  },
  {
    id: 2,
    roomName: "Cellar Room",
    locationAddress: "456 Winery Blvd",
    capacity: 100,
    currentOccupancy: 80,
    managerName: "Jane Smith",
  },
  {
    id: 3,
    roomName: "VIP Room",
    locationAddress: "789 Estate Ave",
    capacity: 20,
    currentOccupancy: 10,
    managerName: "Emily Johnson",
  },
];

export const RoomListPage = () => {
  const [data, setData] = useState([])
  const [modalAction, setModalAction] = useState('')
  const [content, setContent] = useState(null)
  
  const fetchRoomData = () => {
    fetchRoomsAPI().then((response) => {
      setData(response);
      console.log("data: " + data)
    }).catch(error => {
      console.error('Error fetching data:', error)
    })
  }
  useEffect(() => {
    fetchRoomData()
  }, [])
  const columns = [
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Location Address',
      dataIndex: 'locationAddress',
      key: 'locationAddress',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Current Occupancy',
      dataIndex: 'currentOccupancy',
      key: 'currentOccupancy',
    },
    {
      title: 'Manager Name',
      dataIndex: 'managerName',
      key: 'managerName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: record => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleDetail(record)}>Detail</Button>
          <Button type="default" onClick={() => handleUpdate(record)}>Update</Button>
          <Button type="danger" onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ]
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDetail = (id) => {
    setModalAction('detail')
    console.log(`Navigate to detail page of record with id: ${id}`)
  }

  const handleUpdate = (data) => {
    setModalAction('update')
    console.log(`Navigate to update page of record with id: ${data.id}`)
    setIsModalOpen(true)
    setContent(<CreateRoomForm updateRoom={updateRoom} setIsModalOpen={setIsModalOpen} data = {data} modalAction = {modalAction} />)
  }
  const updateRoom = async (id, data) => {
    await updateRoomAPI(id, data)
    fetchRoomData();
  }

  const handleDelete = (data) => {
    setModalAction('delete')
    console.log(`Delete record with id: ${data.id}`);
    setIsModalOpen(true)
    setContent(<DeleteRoom setIsModalOpen={setIsModalOpen} deleteRoom={deleteRoom} data = {data} />)
  }
  const deleteRoom = async (id) => {
    await deleteRoomAPI(id);
    fetchRoomData()
  }


  const handleCreate = () => {
    console.log("Navigate to create new record page")
    setModalAction('create')
    setIsModalOpen(true)
    setContent(<CreateRoomForm createRoom={createRoom} setIsModalOpen={setIsModalOpen} />)

  };
  const createRoom = async (newRoomData) => {
    const createdRoom = await createRoomAPI({ ...newRoomData })
    setData((prevData) => [...prevData, createdRoom]);
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
      {/* <PopupRoom setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} createRoom={createRoom} /> */}
      <PopupDialog
        title={modalAction === 'create' ? "Create Room" :
          modalAction === 'delete' ? "Delete Room" :
            modalAction === 'update' ? "Update Room" :
              "Room Details"}
        content={content}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen} />
    </div>
  );
};
