import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Divider, message, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title } = Typography;

export const WineCateListPage = () => {
  const [wineCategories, setWineCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State cho modal
  const [form] = Form.useForm(); // Form instance để quản lý form
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


  const handleDetail = (id) => {
    navigate(`/app/wine-categories/${id}/wines`);
  };


  const handleCreateCategory = async (values) => {
    try {
      await axios.post('https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories', values);
      message.success('Category created successfully!');
      fetchWineCategories();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create category.');
    }
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
          <Button type="primary" onClick={() => handleDetail(record.id)}>Detail</Button> {/* call handleDetail */}
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
          onClick={() => setIsModalVisible(true)} // show modal
          style={{ marginBottom: 16 }}
          shape='round'
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

      {/* Modal create */}
      <Modal
        title="Create New Wine Category"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
