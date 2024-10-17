import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Divider, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

export const WineCateListPage = () => {
  const [wineCategories, setWineCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // For create modal
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // For detail modal
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories from the API
  const fetchWineCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories');
      setWineCategories(response.data); // Assuming API response has the list of categories
    } catch (error) {
      message.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWineCategories();
  }, []);

  // Handle form submission to create new category
  const handleCreateNewCategory = async (values) => {
    try {
      await axios.post('https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories', values);
      message.success('Category created successfully!');
      setIsModalVisible(false);
      fetchWineCategories(); // Refresh the list
    } catch (error) {
      message.error('Failed to create category.');
    }
  };

  // Handle viewing details of a category
  const handleDetail = async (id) => {
    try {
      const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories/${id}/wines`);
      setSelectedCategory(response.data);
      setIsDetailModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch category details.');
    }
  };

  const handleUpdate = (id) => {
    console.log(`Navigate to update page of record with id: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories/${id}`);
      message.success('Deleted category successfully');
      fetchWineCategories(); // Refresh the list after deletion
    } catch (error) {
      message.error('Failed to delete category.');
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
          <Button type="primary" onClick={() => handleDetail(record.id)}>Detail</Button>
          <Button type="default" onClick={() => handleUpdate(record.id)}>Update</Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>Delete</Button>
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

      {/* Modal for creating new category */}
      <Modal
        title="Create New Wine Category"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleCreateNewCategory}
        >
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for viewing category details */}
      <Modal
        title="Wine Category Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedCategory ? (
          <div>
            <p><strong>ID : </strong> {selectedCategory.id}</p>
            <p><strong>Category Name:</strong> {selectedCategory.categoryName}</p>
            <p><strong>Wine : </strong> {selectedCategory.wines}</p>
            {/* Other details can be shown here */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};
