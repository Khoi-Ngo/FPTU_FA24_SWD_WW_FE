import React, { useState } from 'react'; // Thêm useState
import { Table, Button, Space, Typography, Card, Divider, Modal, Form, Input } from 'antd'; // Thêm Modal, Form, Input
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Updated import

const { Title } = Typography;

// Mock Data
const initialIORequests = [
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
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [currentRequest, setCurrentRequest] = useState(null); // Đối tượng yêu cầu hiện tại
  const [ioRequests, setIORequests] = useState(initialIORequests); // Trạng thái cho danh sách yêu cầu
  const [form] = Form.useForm(); // Sử dụng hook useForm

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
          <Button type="default" onClick={() => handleUpdate(record)}>Update</Button>
          <Button
            type="danger"
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
                handleDelete(record.id);
              }
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleDetail = () => {
    navigate(`/app/iodetail`);
  };

  const handleUpdate = (record) => {
    setCurrentRequest(record); // Đặt yêu cầu hiện tại
    form.setFieldsValue(record); // Đặt giá trị cho form
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleDelete = (id) => {
    setIORequests(ioRequests.filter(request => request.id !== id)); // Cập nhật danh sách yêu cầu
  };

  const handleCreate = () => {
    setCurrentRequest(null); // Đặt yêu cầu hiện tại là null để tạo mới
    form.resetFields(); // Reset form
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleOk = (values) => {
    if (currentRequest) {
      // Cập nhật yêu cầu
      setIORequests(ioRequests.map(request =>
        request.id === currentRequest.id ? { ...request, ...values } : request
      ));
    } else {
      // Tạo yêu cầu mới
      const newRequest = {
        id: ioRequests.length + 1, // Tạo ID mới
        ...values,
      };
      setIORequests([...ioRequests, newRequest]); // Thêm yêu cầu mới vào danh sách
    }
    setIsModalVisible(false); // Đóng modal
    setCurrentRequest(null); // Đặt lại yêu cầu hiện tại
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
    setCurrentRequest(null); // Đặt lại yêu cầu hiện tại
    form.resetFields(); // Reset form khi đóng modal
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
          dataSource={ioRequests} // Sử dụng danh sách yêu cầu từ trạng thái
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Modal để tạo hoặc cập nhật yêu cầu */}
      <Modal
        title={currentRequest ? "Cập nhật yêu cầu" : "Tạo yêu cầu mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form} // Kết nối form với useForm
          layout="vertical"
          onFinish={handleOk}
          initialValues={currentRequest ? { ...currentRequest } : {}} // Hiển thị dữ liệu hiện có
        >
          <Form.Item name="requestCode" label="Request Code" rules={[{ required: true, message: 'Vui lòng nhập mã yêu cầu!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Vui lòng nhập ngày đến hạn!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="totalQuantity" label="Total Quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentRequest ? "Cập nhật" : "Tạo"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};