import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Divider, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchIORequestApi,
  createIORequestApi,
  updateIORequestApi,
  handleDisableStatus,
  fetchIORequestTypeApi,
} from '../../services/api-service/IORequestApiService';

const { Title } = Typography;
const { Option } = Select;

export const IORequestListPage = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [ioRequests, setIORequests] = useState([]);
  const [selectedIOType, setSelectedIOType] = useState('ALL'); // Trạng thái mặc định là 'ALL'
  const [form] = Form.useForm();

  const fetchData = async (ioType) => {
    try {
      let requests;
      if (ioType === 'ALL') {
        requests = await fetchIORequestApi(); // Lấy tất cả
      } else {
        requests = await fetchIORequestTypeApi(ioType); // Lấy theo loại
      }
      setIORequests(requests); // Cập nhật danh sách yêu cầu
    } catch (error) {
      console.error("Error fetching IO Requests:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedIOType); // Fetch data khi loại IO được chọn
  }, [selectedIOType]);

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
      title: 'IO Type',
      dataIndex: 'ioType',
      key: 'ioType',
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
          <Button type="primary" onClick={() => handleDetail(record)}>Detail</Button>
          <Button type="default" onClick={() => handleUpdate(record)}>Update</Button>
          <Button type="danger" onClick={() => confirmDelete(record.id)}>
            Disable
          </Button>
        </Space>
      ),
    },
  ];

  const handleDetail = (record) => {
    navigate(`/app/iorequests/${record.id}`);
  };

  const handleUpdate = (record) => {
    setCurrentRequest(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to disable this request?")) {
      handleDisableStatus(id).then(() => {
        fetchData(selectedIOType); // Refresh data after delete
      });
    }
  };

  const handleCreate = () => {
    setCurrentRequest(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    const requestPayload = {
      ...values,
    };

    try {
      if (currentRequest) {
        await updateIORequestApi(currentRequest.id, requestPayload);
      } else {
        await createIORequestApi(requestPayload);
      }
      setIsModalVisible(false);
      setCurrentRequest(null);
      fetchData(selectedIOType); // Refresh data after create/update
    } catch (error) {
      console.error("Error creating/updating request:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentRequest(null);
    form.resetFields();
  };

  const handleSelectChange = (value) => {
    setSelectedIOType(value);
    fetchData(value); // Fetch data based on selected IO type
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>I/O Request List</Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ marginBottom: 16 }}
        >
          Create New I/O Request
        </Button>
        <Select
          defaultValue="Show ALL"
          style={{ width: 120, marginBottom: 16 }}
          onChange={handleSelectChange}
        >
          <Option value="ALL">Show ALL</Option> {/* Tùy chọn ALL */}
          <Option value="In">Input Type</Option>
          <Option value="Out">Output Type</Option>
        </Select>
        <Divider />

        <Table
          columns={columns}
          dataSource={ioRequests}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={currentRequest ? "Update request" : "Create new request"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
          initialValues={currentRequest || {}}
        >
          <Form.Item name="requestCode" label="Request Code" rules={[{ required: true, message: 'Please enter the request code!' }]}>
            <Input placeholder="Enter the request code" />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please enter start date!' }]}>
            <Input placeholder="Enter the Start Date" />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please enter due date!' }]}>
            <Input placeholder="Enter the Due Date" />
          </Form.Item>
          <Form.Item name="ioType" label="IO Type" rules={[{ required: true, message: 'Please select IO type!' }]}>
            <Select placeholder="Select IO type">
              <Option value="In">In</Option>
              <Option value="Out">Out</Option>
            </Select>
          </Form.Item>
          <Form.Item name="comments" label="Comments" rules={[{ required: false }]}>
            <Input.TextArea placeholder="Enter your comments" />
          </Form.Item>
          <Form.Item name="supplierName" label="Supplier Name" rules={[{ required: false }]}>
            <Input placeholder="Enter Supplier Name" />
          </Form.Item>
          <Form.Item name="customerName" label="Customer Name" rules={[{ required: false }]}>
            <Input placeholder="Enter Customer Name" />
          </Form.Item>
          <Form.Item name="roomId" label="Room ID" rules={[{ required: true, message: 'Please enter RoomID!' }]}>
            <Input placeholder="Enter Room ID" />
          </Form.Item>
          <Form.Item name="checkerId" label="Checker ID" rules={[{ required: true, message: 'Please enter CheckerID!' }]}>
            <Input placeholder="Enter Checker ID" />
          </Form.Item>
          {currentRequest && (
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please Select Status!' }]}>
              <Select placeholder="Please Select Status">
                <Option value="Active">Active</Option>
                <Option value="InActive">InActive</Option>
              </Select>
            </Form.Item>)}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentRequest ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IORequestListPage;
