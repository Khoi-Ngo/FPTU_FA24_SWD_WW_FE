import React from 'react';
import { Table, Button, Space, Typography, Card, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// Mock Data
const mockWineCategories = [
  {
    id: 1,
    categoryName: "Red Wine",
    description: "A type of wine made from dark-colored grape varieties.",
    wineType: "Red",
  },
  {
    id: 2,
    categoryName: "White Wine",
    description: "A wine that is fermented without skin contact.",
    wineType: "White",
  },
  {
    id: 3,
    categoryName: "Rosé Wine",
    description: "A type of wine that incorporates some of the color from the grape skins.",
    wineType: "Rosé",
  },
];

const { Title } = Typography;

export const WineCateListPage = () => {
  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Wine Type',
      dataIndex: 'wineType',
      key: 'wineType',
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
        <Title level={2}>Wine Categories</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate} 
          style={{ marginBottom: 16 }}
        >
          Create New Wine Category
        </Button>
        <Divider />
        <Table 
          columns={columns} 
          dataSource={mockWineCategories} 
          rowKey="id" 
          bordered 
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
};
