import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Divider, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchIORequestApi,
  createIORequestApi,
  updateIORequestApi,
  handleDisableStatus,
} from '../../services/api-service/IORequestApiService';

const { Title } = Typography;
const { Option } = Select;


export const IORequestListPage = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [ioRequests, setIORequests] = useState([]);
  const [ioRequestDetails, setIORequestDetails] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const requests = await fetchIORequestApi();
      setIORequests(requests);
    };
    fetchData();
  }, []);

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
    setCurrentRequest(record);
    setIsDetailVisible(true);
  };

  const handleUpdate = (record) => {
    setCurrentRequest(record);
    form.setFieldsValue(record);
    setIORequestDetails(record.ioRequestDetails || []);
    setIsModalVisible(true);
  };

  const confirmDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn vô hiệu hóa yêu cầu này?")) {
      handleDisableStatus(id).then(() => {
        setIORequests(ioRequests.filter(request => request.id !== id));
      });
    }
  };


  const handleDisable = async (id) => {
    try {
      console.log(`Deleting IO Request with ID: ${id}`); // Kiểm tra ID
      await deleteIORequestApi(id); // Gọi API để xóa yêu cầu
      console.log(`Successfully deleted request with ID: ${id}`); // Xác nhận đã xóa

      // Cập nhật lại danh sách yêu cầu trong state
      setIORequests(ioRequests.filter(request => request.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };





  const handleCreate = () => {
    setCurrentRequest(null);
    form.resetFields();
    setIORequestDetails([]);
    setIsModalVisible(true);
  };

  const handleAddDetail = (detail) => {
    setIORequestDetails([...ioRequestDetails, detail]);
  };

  const handleOk = async (values) => {
    const requestPayload = {
      ...values,
      ioRequestDetails,
    };

    console.log("Request Payload:", requestPayload);

    try {
      if (currentRequest) {
        const updatedRequest = await updateIORequestApi(currentRequest.id, requestPayload);
        setIORequests(ioRequests.map(request => (request.id === currentRequest.id ? updatedRequest : request)));
      } else {
        const newRequest = await createIORequestApi(requestPayload);
        setIORequests([...ioRequests, newRequest]);
      }
      setIsModalVisible(false);
      setCurrentRequest(null);
      setIORequestDetails([]);
    } catch (error) {
      console.error("Error creating/updating request:", error);
    }
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDetailVisible(false);
    setDetailModalVisible(false);
    setCurrentRequest(null);
    form.resetFields();
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
          dataSource={ioRequests}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={currentRequest ? "Cập nhật yêu cầu" : "Tạo yêu cầu mới"}
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
          <Form.Item name="requestCode" label="Request Code" rules={[{ required: true, message: 'Vui lòng nhập mã yêu cầu!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Vui lòng nhập ngày đến hạn!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ioType" label="IO Type" rules={[{ required: true, message: 'Vui lòng chọn loại IO!' }]}>
            <Select placeholder="Chọn loại IO">
              <Option value="In">In</Option>
              <Option value="Out">Out</Option>
            </Select>
          </Form.Item>
          <Form.Item name="comments" label="Comments" rules={[{ required: false }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="supplierName" label="Supplier Name" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="customerName" label="Customer Name" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roomId" label="Room ID" rules={[{ required: true, message: 'Vui lòng nhập RoomID !' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="checkerId" label="Checker ID" rules={[{ required: true, message: 'Vui lòng nhập ChekerID !' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please !' }]}>
            <Select placeholder="Please Select Status">
              <Option value="In">Active</Option>
              <Option value="Out">InActive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentRequest ? "Cập nhật" : "Tạo"}
            </Button>
            <Button type="default" onClick={() => setDetailModalVisible(true)} style={{ marginLeft: 16 }}>
              Thêm Chi Tiết
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 20 }}>
          <h3>Chi Tiết Yêu Cầu</h3>
          <ul>
            {ioRequestDetails.map((detail, index) => (
              <li key={index}>{`Wine ID: ${detail.wineId}, Quantity: ${detail.quantity}`}</li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal
        title="Thêm Chi Tiết Yêu Cầu"
        visible={isDetailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={(detail) => {
            handleAddDetail(detail);
            setDetailModalVisible(false);
          }}
        >
          <Form.Item name="wineId" label="Wine ID" rules={[{ required: true, message: 'Vui lòng nhập Wine ID!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">ADD</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Request Details"
        visible={isDetailVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <p><strong>ID:</strong> {currentRequest?.id}</p>
          <p><strong>Request Code:</strong> {currentRequest?.requestCode}</p>
          <p><strong>Start Date:</strong> {currentRequest?.startDate}</p>
          <p><strong>Due Date:</strong> {currentRequest?.dueDate}</p>
          <p><strong>Comments:</strong> {currentRequest?.comments}</p>
          <p><strong>IO Type:</strong> {currentRequest?.ioType}</p>
          <p><strong>Supplier Name:</strong> {currentRequest?.supplierName}</p>
          <p><strong>Customer Name:</strong> {currentRequest?.customerName}</p>
          <p><strong>Checker Name:</strong> {currentRequest?.checkerName}</p>
          <p><strong>Room ID:</strong> {currentRequest?.roomId}</p>
          <p><strong>Checker ID:</strong> {currentRequest?.checkerId}</p>
          <p><strong>Status:</strong> {currentRequest?.status}</p>
          <Divider />
          <h4>Details</h4>
          <ul>
            {currentRequest?.ioRequestDetails?.map((detail, index) => (
              <li key={index}>{`ID:${detail.id}, 
              Wine Id:${detail.wineId}, 
              Quantity:${detail.quantity}, 
              IoRequestId:${detail.ioRequestId}`}</li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};
