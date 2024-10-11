import React from 'react';
import { Table, Button, Space, Typography, Card, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Updated import

const { Title } = Typography;

// Mock Data
const mockIORequests = [
  {
    id: 1,
    requestCode: "REQ001",
    startDate: "2024-10-01",
    dueDate: "2024-10-10",
    totalQuantity: 100,
    comments: "Urgent",
    ioType: "IN",
    priorityLevel: "High",
    requesterId: 1,
    requesterName: "Alice",
  },
  {
    id: 2,
    requestCode: "REQ002",
    startDate: "2024-10-05",
    dueDate: "2024-10-15",
    totalQuantity: 200,
    comments: "Normal",
    ioType: "OUT",
    priorityLevel: "Medium",
    requesterId: 2,
    requesterName: "Bob",
  },
];

export const IORequestListPage = () => {
  const navigate = useNavigate(); // Updated to useNavigate

  const columns = [
    {
      title: 'Request Code',
      dataIndex: 'requestCode',
      key: 'requestCode',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: 'IO Type',
      dataIndex: 'ioType',
      key: 'ioType',
    },
    {
      title: 'Priority Level',
      dataIndex: 'priorityLevel',
      key: 'priorityLevel',
    },
    {
      title: 'Requester Name',
      dataIndex: 'requesterName',
      key: 'requesterName',
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

  const handleDetail = () => {
    // Temporarily redirect to /app/iorequests/detail
    navigate(`/app/iodetail`);
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
        <Title level={2}>IO Request List</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate} 
          style={{ marginBottom: 16 }}
        >
          Create New IO Request
        </Button>
        <Divider />
        <Table 
          columns={columns} 
          dataSource={mockIORequests} 
          rowKey="id" 
          bordered 
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
};
