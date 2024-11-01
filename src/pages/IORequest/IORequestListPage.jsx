import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Table, Button, Space, Typography, Card, Divider, Modal, Form, Input, Select, List, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchIORequestApi,
  createIORequestApi,
  updateIORequestApi,
  handleDisableStatus,
  fetchIORequestTypeApi,
  handleDoneStatus,
} from '../../services/api-service/IORequestApiService';
import { fetchRoomsAPI } from '~/services/api-service/RoomApiService';
import { fetchSuppliersApi, fetchCheckersApi, fetchCustomersApi, fetchWineIDApi } from '~/services/api-service/FetchInputIORequest';
const { Title } = Typography;
const { Option } = Select;

export const IORequestListPage = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [ioRequests, setIORequests] = useState([]);
  const [selectedIOType, setSelectedIOType] = useState('ALL');
  const [form] = Form.useForm();

  const [rooms, setRooms] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [checkers, setCheckers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [wines, setWines] = useState([]);

  const fetchData = async (ioType) => {
    try {
      let requests;
      if (ioType === 'ALL') {
        requests = await fetchIORequestApi();
      } else {
        requests = await fetchIORequestTypeApi(ioType);
      }
      console.log("Fetched IO Requests:", requests);
      setIORequests(requests);
    } catch (error) {
      console.error("Error fetching IO Requests:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedIOType);

    const fetchDropdownData = async () => {
      try {
        const [roomData, supplierData, checkerData, customerData, wineData] = await Promise.all([
          fetchRoomsAPI(),
          fetchSuppliersApi(),
          fetchCheckersApi(),
          fetchCustomersApi(),
          fetchWineIDApi()
        ]);
        setRooms(roomData);
        setSuppliers(supplierData);
        setCheckers(checkerData);
        setCustomers(customerData);
        setWines(wineData);
        console.log("Rooms:", roomData);
        console.log("Suppliers:", supplierData);
        console.log("Checkers:", checkerData);
        console.log("Customers:", customerData);
        console.log("Wines:", wineData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
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
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : 'N/A'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => (text ? moment(text).format('YYYY-MM-DD') : 'N/A'),
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
          <Button
            type="default"
            onClick={() => handleUpdate(record)}
            disabled={record.status !== 'Pending'}
          >
            Update
          </Button>
          <Button style={{ backgroundColor: 'red', borderColor: 'black' }}
            type="primary"
            onClick={() => confirmDelete(record.id)}
            disabled={record.status !== 'Pending'}
          >
            Disable
          </Button>
          <Button style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
            type="primary"
            onClick={() => confirmDone(record.id)}
            disabled={record.status !== 'Pending'}
          >
            Done
          </Button>
        </Space>
      ),
    },
  ];

  const handleDetail = (record) => {
    navigate(`/app/io-requests/${record.id}`);
  };

  const handleUpdate = (record) => {
    console.log("Updating record:", record);
    setCurrentRequest(record);
    form.setFieldsValue({
      ...record,
      ioRequestDetails: record.ioRequestDetails || [],
      startDate: moment(record.startDate),
      dueDate: moment(record.dueDate),
    });
    setIsModalVisible(true);
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to disable this request?")) {
      handleDisableStatus(id).then(() => {
        fetchData(selectedIOType);
      });
    }
  };
  const confirmDone = (id) => {
    if (window.confirm("Are you sure you want to done this request?")) {
      handleDoneStatus(id).then(() => {
        fetchData(selectedIOType);
      });
    }
  };

  const handleCreate = (ioType) => {
    setCurrentRequest(null);
    form.resetFields();
    setSelectedIOType(ioType);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    console.log("Submitted values:", values);
    const requestPayload = {
      ...values,
      startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      ioRequestDetails: values.ioRequestDetails || [],
      ioType: selectedIOType
    };
    console.log("Request Payload:", requestPayload);
    try {
      if (currentRequest) {
        console.log("Updating request with ID:", currentRequest.id);
        await updateIORequestApi(currentRequest.id, requestPayload);
      } else {
        console.log("Creating new request");
        await createIORequestApi(requestPayload);
      }
      setIsModalVisible(false);
      setCurrentRequest(null);
      fetchData(selectedIOType);
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
    fetchData(value);
  };

  const handleRoomChange = async (roomId) => {
    try {
      const wineData = await fetchWineIDApi(roomId);
      setWines(wineData);

      const ioRequestDetails = wineData.map(wine => ({
        wineId: wine.id,
        quantity: 0
      }));

      form.setFieldsValue({
        ioRequestDetails: ioRequestDetails
      });
    } catch (error) {
      console.error("Error fetching wines for room:", error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>I/O Request List</Title>
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreate('In')}
            style={{ marginBottom: 16 }}
          >
            Create Import Request
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreate('Out')}
            style={{ marginBottom: 16 }}
          >
            Create Export Request
          </Button>

          <Select
            defaultValue="Show ALL"
            style={{ width: 120, marginBottom: 16 }}
            onChange={handleSelectChange}
          >
            <Option value="ALL">Show ALL</Option>
            <Option value="In">Input Type</Option>
            <Option value="Out">Output Type</Option>
          </Select>
        </Space>
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
        title={currentRequest ? "Update request" : `Create new request (${selectedIOType})`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
          initialValues={{
            ...currentRequest,
            startDate: currentRequest ? moment(currentRequest.startDate) : null,
            dueDate: currentRequest ? moment(currentRequest.dueDate) : null,
            ioRequestDetails: currentRequest ? currentRequest.ioRequestDetails : [],
            ioType: selectedIOType
          }}
        >
          <Form.Item name="requestCode" label="Request Code" rules={[{ required: true, message: 'Please enter the request code!' }]}>
            <Input placeholder="Enter the request code" />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please enter start date!' }]}>
            <DatePicker placeholder="Select Start Date" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please enter due date!' }]}>
            <DatePicker placeholder="Select Due Date" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="comments" label="Comments" rules={[{ required: false }]}>
            <Input.TextArea placeholder="Enter your comments" />
          </Form.Item>
          <Form.Item name="suplierId" label="Supplier ID" rules={[{ required: true, message: 'Please enter Supplier ID!' }]}>
            <Select placeholder="Select Supplier" showSearch>
              {suppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>{supplier.suplierName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="roomId" label="Room ID" rules={[{ required: true, message: 'Please enter Room ID!' }]}>
            <Select placeholder="Select Room" showSearch onChange={handleRoomChange}>
              {rooms.map(room => (
                <Option key={room.id} value={room.id}>{room.roomName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="checkerId" label="Checker ID" rules={[{ required: true, message: 'Please enter Checker ID!' }]}>
            <Select placeholder="Select Checker" showSearch>
              {checkers.map(checker => (
                <Option key={checker.id} value={checker.id}>{checker.username}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="customerId" label="Customer ID" rules={[{ required: true, message: 'Please enter Customer ID!' }]}>
            <Select placeholder="Select Customer" showSearch>
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>{customer.customerName}</Option>
              ))}
            </Select>
          </Form.Item>

          {!currentRequest && (
            <Form.List name="ioRequestDetails">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        fieldKey={[fieldKey, 'quantity']}
                        rules={[{ required: true, message: 'Enter Number Quantity' },
                        { type: 'number', min: 1, message: 'Quantity must be a positive number!' }
                        ]}
                      >
                        <Input type="number" placeholder="Quantity" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'wineId']}
                        fieldKey={[fieldKey, 'wineId']}
                        rules={[{ required: true, message: 'Missing wine ID' }]}
                      >
                        <Select placeholder="Select Wine">
                          {wines.map(wine => (
                            <Option key={wine.id} value={wine.id}>
                              {wine.wineName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Button type="danger" onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Wine
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}

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