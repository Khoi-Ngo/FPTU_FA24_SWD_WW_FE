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

  const fetchData = async () => {
    const requests = await fetchIORequestApi();
    setIORequests(requests);
  };

  useEffect(() => {
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
    navigate(`/app/iorequests/${record.id}`);
  };


  const handleUpdate = (record) => {
    setCurrentRequest(record);
    form.setFieldsValue(record);
    setIORequestDetails(record.ioRequestDetails || []);
    setIsModalVisible(true);
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to disable this request?")) {
      handleDisableStatus(id).then(() => {

        fetchData();
      });
    }
  };


  // const handleDisable = async (id) => {
  //   try {
  //     console.log(`Deleting IO Request with ID: ${id}`); // Kiểm tra ID
  //     await deleteIORequestApi(id); // Gọi API để xóa yêu cầu
  //     console.log(`Successfully deleted request with ID: ${id}`); // Xác nhận đã xóa

  //     // Cập nhật lại danh sách yêu cầu trong state
  //     setIORequests(ioRequests.filter(request => request.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting request:", error);
  //   }
  // };





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
      } else {
        await createIORequestApi(requestPayload);
      }
      setIsModalVisible(false);
      setCurrentRequest(null);
      setIORequestDetails([]);
      fetchData();
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
        <Title level={2}>I/O Request List</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ marginBottom: 16 }}
        >
          Create New I/O Request
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
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please Select Status!' }]}>
            <Select placeholder="Please Select Status">
              <Option value="Active">Active</Option>
              <Option value="InActive">InActive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentRequest ? "Update" : "Create"}
            </Button>
            {!currentRequest && (
              <Button type="default" onClick={() => setDetailModalVisible(true)} style={{ marginLeft: 16 }}>
                Add More Details
              </Button>
            )}
          </Form.Item>
        </Form>
        {!currentRequest && (
          <div style={{ marginTop: 20 }}>
            <h3>IO Request Details List</h3>
            <ul>
              {ioRequestDetails.map((detail, index) => (
                <li key={index}>{`Wine ID: ${detail.wineId}, Quantity: ${detail.quantity}`}</li>
              ))}
            </ul>
          </div>)}
      </Modal>

      <Modal
        title="Request Details Form"
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
          <Form.Item name="wineId" label="Wine ID" rules={[{ required: true, message: 'Please enter Wine ID!' }]}>
            <Input placeholder="Enter Wine ID " />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity!' }]}>
            <Input type="number" placeholder="Enter Quantity" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* <Modal
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
      </Modal> */}
    </div>
  );
};
