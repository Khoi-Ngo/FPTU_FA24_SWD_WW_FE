import React from 'react';
import { Table, Button, Space, Typography, Card, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleDetail(record.id)}>Detail</Button>
          <Button type="default" onClick={() => handleUpdate(record.id)}>Update</Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleDetail = (id) => {
    console.log(`Navigate to detail page of record with id: ${id}`);
  };

  const handleUpdate = (id) => {
    console.log(`Navigate to update page of record with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete record with id: ${id}`);
  };

  const handleCreate = () => {
    console.log("Navigate to create new record page");
  };

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
          dataSource={mockRooms} 
          rowKey="id" 
          bordered 
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
};
