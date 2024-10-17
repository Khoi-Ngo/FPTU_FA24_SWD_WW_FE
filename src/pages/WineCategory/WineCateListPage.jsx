import React from 'react';
import { Table, Button, Space, Typography, Card, Divider, Modal } from 'antd';
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

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isDetailVisible, setDetailVisible] = React.useState(false);

  // Hàm để hiển thị modal
  const handleCreate = () => {
    setModalVisible(true);
  };

  // Hàm để đóng modal
  const handleCancel = () => {
    setModalVisible(false);
    setDetailVisible(false); // Đóng detail khi đóng modal
  };

  // Hàm để hiển thị chi tiết
  const handleDetail = () => {
    setDetailVisible(!isDetailVisible); // Chuyển đổi trạng thái hiển thị
  };

  const handleUpdate = (id) => {
    console.log(`Navigate to update page of record with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete record with id: ${id}`);
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

        {/* Modal để tạo mới */}
        <Modal
          title="Create New Wine Category"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <div>
            <p>Request Name: <input type="text" placeholder="Enter Request Name" /></p>
            <Button
              type="default"
              onClick={handleDetail}
              style={{ marginBottom: 16 }}
            >
              Detail
            </Button>
            {/* Hiển thị chi tiết nếu isDetailVisible là true */}
            {isDetailVisible && (
              <div>
                <h3>Detail Information</h3>
                <p>Wine ID: <input type="text" placeholder="Enter Wine ID" /></p>
                <p>Quantity: <input type="number" placeholder="Enter Quantity" /></p>
                <p>Comment: <input type="text" placeholder="Enter Comment" /></p>
                <p>Supplier: <input type="text" placeholder="Enter Supplier" /></p>
                <p>Room ID: <input type="text" placeholder="Enter Room ID" /></p>
                <p>Ngày sản xuất: <input type="date" /></p>
                <p>Checker ID: <input type="text" placeholder="Enter Checker ID" /></p>
              </div>
            )}
          </div>
        </Modal>
      </Card>
    </div>
  );
};
