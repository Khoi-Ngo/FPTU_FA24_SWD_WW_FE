import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Divider, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title } = Typography;

export const WineCateListPage = () => {
  const [wineCategories, setWineCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Fetch all categories from the API
  const fetchWineCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories');
      setWineCategories(response.data);
    } catch (error) {
      message.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWineCategories();
  }, []);

  // Hàm xử lý khi bấm vào nút "Detail"
  const handleDetail = (id) => {
    navigate(`/app/wine-categories/${id}/wines`); // Điều hướng đến trang chi tiết
  };

  const columns = [
    {
      title: "Category ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleDetail(record.id)}>Detail</Button> {/* Gọi hàm handleDetail */}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>Wine Categories</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Create New Wine Category
        </Button>
        <Divider />
        <Table
          columns={columns}
          dataSource={wineCategories}
          rowKey="id"
          bordered
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};
