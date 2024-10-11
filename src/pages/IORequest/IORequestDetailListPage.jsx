import React from 'react';
import { Table, Button, Space, Typography, Card, Divider } from 'antd';
import { useNavigate } from 'react-router-dom'; // for page navigation

const { Title } = Typography;

// Mock Data
const mockIORequestDetails = [
  {
    id: 1,
    ioRequestCode: "REQ001",
    wineName: "Chardonnay",
    quantity: 50,
    startDate: "2024-10-01",
    endDate: "2024-10-10",
    roomName: "Cellar A",
    checkerName: "John Doe",
    status: "Completed",
  },
  {
    id: 2,
    ioRequestCode: "REQ002",
    wineName: "Merlot",
    quantity: 200,
    startDate: "2024-10-05",
    endDate: "2024-10-15",
    roomName: "Cellar B",
    checkerName: "Jane Smith",
    status: "In Progress",
  },
];

export const IORequestDetailListPage = () => {
  const navigate = useNavigate();

  // Define table columns
  const columns = [
    {
      title: 'Request Code',
      dataIndex: 'ioRequestCode',
      key: 'ioRequestCode',
    },
    {
      title: 'Wine Name',
      dataIndex: 'wineName',
      key: 'wineName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Checker Name',
      dataIndex: 'checkerName',
      key: 'checkerName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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

  // Handlers for actions
  const handleDetail = (id) => {
    navigate(`/iorequestdetails/${id}`);
  };

  const handleUpdate = (id) => {
    console.log(`Navigate to update page for record with id: ${id}`);
    navigate(`/iorequestdetails/update/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete record with id: ${id}`);
    // Add deletion logic here if needed
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>IO Request Detail List</Title>
        <Divider />
        <Table 
          columns={columns} 
          dataSource={mockIORequestDetails} 
          rowKey="id" 
          bordered 
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
};
