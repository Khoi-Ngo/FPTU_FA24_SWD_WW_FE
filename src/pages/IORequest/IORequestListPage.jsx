import React, { useState, useEffect } from 'react'; // Thêm useEffect
import { Table, Button, Space, Typography, Card, Divider, Modal, Form, Input, Select } from 'antd'; // Thêm Modal, Form, Input
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Updated import
import axios from 'axios';

const { Title } = Typography;

export const IORequestListPage = () => {
  const navigate = useNavigate(); // Updated to useNavigate
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [currentRequest, setCurrentRequest] = useState(null); // Đối tượng yêu cầu hiện tại
  const [ioRequests, setIORequests] = useState([]); // Trạng thái cho danh sách yêu cầu (bỏ dữ liệu mẫu)
  const [form] = Form.useForm(); // Sử dụng hook useForm
  const [details, setDetails] = useState([]); // Trạng thái cho danh sách chi tiết
  const [detailForm] = Form.useForm(); // Sử dụng hook useForm cho form chi tiết

  // Gọi API lấy dữ liệu IO Requests
  useEffect(() => {
    const fetchIORequests = async () => {
      try {
        const response = await axios.get('https://winewarehousesystem.azurewebsites.net/api/v1/iorequests'); // Gọi API
        setIORequests(response.data); // Cập nhật dữ liệu vào trạng thái ioRequests
      } catch (error) {
        console.error('Error fetching IO Requests:', error);
      }
    };

    fetchIORequests(); // Gọi hàm lấy dữ liệu khi component mount
  }, []); // Chỉ chạy một lần khi component được render lần đầu

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
              if (window.confirm("Are you sure ?")) {
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
    setDetails([]); // Reset danh sách chi tiết
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleOk = (values) => {
    if (details.length === 0) {
      alert("Please add at least one detail.");
      return;
    }

    if (currentRequest) {
      // Cập nhật yêu cầu
      setIORequests(ioRequests.map(request =>
        request.id === currentRequest.id ? { ...request, ...values, details } : request
      ));
    } else {
      // Tạo yêu cầu mới
      const newRequest = {
        id: ioRequests.length + 1, // Tạo ID mới
        ...values,
        details, // Thêm danh sách chi tiết vào yêu cầu mới
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

  const addDetail = () => {
    detailForm.validateFields().then(values => {
      setDetails([...details, values]); // Thêm chi tiết vào danh sách
      detailForm.resetFields(); // Reset form chi tiết
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
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
          dataSource={ioRequests} // Sử dụng danh sách yêu cầu từ API
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Modal để tạo hoặc cập nhật yêu cầu */}
      <Modal
        title={currentRequest ? "Update Form" : "Create Form"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form} // Kết nối form với useForm
          layout="vertical"
          onFinish={handleOk}
          initialValues={currentRequest ? { ...currentRequest } : {}}
        >
          <Form.Item name="requestCode" label="Request Code" rules={[{ required: true, message: 'Please enter the request code!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please enter the start date!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please enter the due date!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="totalQuantity" label="Total Quantity" rules={[{ required: true, message: 'Please enter the quantity!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ioType" label="IO Type" rules={[{ required: true, message: 'Please select the IO type!' }]}>
            <Select>
              <Select.Option value="IN">In</Select.Option>
              <Select.Option value="OUT">Out</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priorityLevel" label="Priority" rules={[{ required: true, message: 'Please select the priority level!' }]}>
            <Select>
              <Select.Option value="Easy">Easy</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="requesterName" label="Requester Name" rules={[{ required: true, message: 'Please enter the requester name!' }]}>
            <Input />
          </Form.Item>

          {/* Form chi tiết */}
          <div style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px' }}>
            <h4>Detail Information</h4>
            <Form form={detailForm} layout="vertical">
              <Form.Item name="wineID" label="Wine ID" rules={[{ required: true, message: 'Please enter the wine ID!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter the quantity!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="comment" label="Comment">
                <Input />
              </Form.Item>
              <Form.Item name="supplier" label="Supplier" rules={[{ required: true, message: 'Please enter the supplier name!' }]}>
                <Input />
              </Form.Item>
              <Button type="primary" onClick={addDetail}>
                Add Detail
              </Button>
            </Form>
          </div>

          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            {currentRequest ? "Update" : "Create"}
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Form>
      </Modal>
    </div>
  );
};
