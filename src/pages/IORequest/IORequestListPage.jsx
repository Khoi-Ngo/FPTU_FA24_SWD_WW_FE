import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete'
import { MdDoneOutline } from "react-icons/md";
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MdOutlinePayment } from "react-icons/md";
import { Table, Button, Space, Typography, Card, Divider, Modal, Form, Input, Select, List, DatePicker, notification, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchIORequestApi,
  createIORequestApi,
  updateIORequestApi,
  handleDisableStatus,
  fetchIORequestTypeApi,
  paymentIORequestApi,
  handleDoneStatus,
  fetchRoomByIdForExport
} from '../../services/api-service/IORequestApiService';
import { fetchRoomAvailableForExport, fetchRoomAvailable, fetchSuppliersApi, fetchCheckersApi, fetchCustomersApi, fetchWineIDApi } from '~/services/api-service/FetchInputIORequest';
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
  const token = window?.localStorage?.getItem("access_token")
  const authToken = `Bearer ${token}`


  const fetchData = async (ioType) => {
    try {
      let requests;
      if (ioType === 'ALL') {
        requests = await fetchIORequestApi(authToken);
      } else {
        requests = await fetchIORequestTypeApi(ioType, authToken);
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
          selectedIOType === 'Out' ? fetchRoomAvailableForExport(authToken) : fetchRoomAvailable(authToken),
          fetchSuppliersApi(authToken),
          fetchCheckersApi(authToken),
          fetchCustomersApi(authToken),
          fetchWineIDApi(authToken)
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
      render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : 'N/A'),
      sorter: (a, b) => new Date(b.startDate) - new Date(a.startDate),
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
      render: (status) => (
        <Tag color={status === "Pending" ? 'gold' : status === "Done" ? 'green' : status === "Cancelled" ? 'red' : 'default'} style={{ fontWeight: 'bold' }}>
          {status || 'Unknown'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button style={{ backgroundColor: 'yellow', color: 'black' }}
            title='Show Details'
            type="primary"
            onClick={() => handleDetail(record)}><ArrowForwardIosIcon /></Button>
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            disabled={record.status !== 'Pending'}
            title='Update'
          >
            <EditIcon />
          </Button>
          <Button style={{ backgroundColor: 'red' }}
            type="primary"
            onClick={() => confirmDelete(record.id)}
            disabled={record.status !== 'Pending'}
            title='Disable'
          >
            <DeleteIcon />
          </Button>
          <Button style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
            type="primary"
            onClick={() => confirmDone(record.id)}
            disabled={record.status !== 'Pending'}
            title='Done'
          >
            <MdDoneOutline />
          </Button>
          <Button style={{ backgroundColor: 'orange' }}
            type="primary"
            onClick={() => handlePayment(record.id)}
            disabled={record.status !== 'Pending'}
            title='Payment'
          >
            <MdOutlinePayment />
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
      startDate: dayjs(record.startDate),
      dueDate: dayjs(record.dueDate),
    });
    setSelectedIOType(record.ioType);
    setIsModalVisible(true);
  };


  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to disable this request?")) {
      handleDisableStatus(id, authToken).then((response) => {
        if (response.success) {
          fetchData(selectedIOType);
          notification.success({
            message: 'Disable Successful',
            description: 'Request disable successfully.',
          });
        } else {
          notification.error({
            message: 'Disable Failed',
            description: 'The request could not be disabled.',
          });
        }
      }).catch(error => {
        console.error("Error disabling request:", error);
        notification.error({
          message: 'An error occurred',
          description: 'Unable to disable request. Please try again.',
        });
      });
    }
  };
  const confirmDone = (id) => {
    if (window.confirm("Are you sure you want to done this request?")) {
      handleDoneStatus(id, authToken).then((response) => {
        if (response.success) {
          fetchData(selectedIOType);
          notification.success({
            message: 'Done Successful',
            description: 'The request has been done.',
          });
        } else {
          const errorMessage = response.errorMessage || 'The request could not be completed.';
          console.log('Response error message:', errorMessage);
          notification.error({
            message: 'Done Failed',
            description: errorMessage,
          });
        }
      }).catch(error => {
        console.error("Error completing request:", error);
        const apiErrorMessage = error.response?.data?.errorMessage || 'Unable to done request. Please try again.';
        console.log('Error response:', error.response);
        notification.error({
          message: 'An error occurred',
          description: apiErrorMessage,
        });
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
        await updateIORequestApi(currentRequest.id, requestPayload, authToken);
        notification.success({
          message: 'Update successful',
          description: 'The request was updated successfully.',
        });
      } else {
        console.log("Creating new request");
        await createIORequestApi(requestPayload, authToken);
        notification.success({
          message: 'Created successfully',
          description: 'The request has been successfully created.',
        });
      }
      setIsModalVisible(false);
      setCurrentRequest(null);
      fetchData(selectedIOType);
    } catch (error) {
      console.error("Error creating/updating request:", error);
      notification.error({
        message: 'An error occurred',
        description: 'The request could not be fulfilled. Please try again.',
      });
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
      const roomData = await fetchRoomByIdForExport(roomId, authToken)

      const wineData = roomData.wineRooms;
      setWines(wineData);

      if (selectedIOType === 'Out') {
        const ioRequestDetails = wineData.map(wine => ({
          wineId: wine.wineId,
          quantity: wine.currentQuantity
        }));

        form.setFieldsValue({
          ioRequestDetails: ioRequestDetails
        });
      }
    } catch (error) {
      console.error("Error fetching wines for room:", error);
    }
  };

  const handlePayment = async (id) => {
    try {
      const data = await paymentIORequestApi(id, authToken);
      window.open(data.paymentUrl, '_blank');
    } catch (error) {
      notification.error({
        message: 'Payment Failed',
        description: 'Unable to process payment. Please try again.',
      });
      navigate('/payment-failure');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <Title level={2}>I/O Request List</Title>
        <Space size="middle">
          <Button
            shape='round'
            title='Create Import Request'
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreate('In')}
            style={{ marginBottom: 16 }}
          >
            Create Import Request
          </Button>
          <Button
            shape='round'
            title='Create Export Request'
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
            startDate: currentRequest ? dayjs(currentRequest.startDate) : null,
            dueDate: currentRequest ? dayjs(currentRequest.dueDate) : null,
            ioRequestDetails: currentRequest ? currentRequest.ioRequestDetails : [],
            ioType: selectedIOType
          }}
        >

          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please enter start date!' }]}>
            <DatePicker
              placeholder="Select Start Date"
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          <Form.Item name="comments" label="Comments" rules={[{ required: false }]}>
            <Input.TextArea placeholder="Enter your comments" />
          </Form.Item>
          {selectedIOType === 'In' && (
            <Form.Item name="suplierId" label="Supplier ID" rules={[{ required: true, message: 'Please enter Supplier ID!' }]}>
              <Select placeholder="Select Supplier" showSearch>
                {suppliers.map(supplier => (
                  <Option key={supplier.id} value={supplier.id}>{supplier.suplierName}</Option>
                ))}
              </Select>
            </Form.Item>)}

          <Form.Item name="roomId" label="Room ID" rules={[{ required: true, message: 'Please enter Room ID!' }]}>
            <Select
              placeholder="Select Room"
              showSearch
              onChange={selectedIOType === 'Out' ? handleRoomChange : undefined}
            >
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
          {selectedIOType === 'Out' && (
            <Form.Item name="customerId" label="Customer ID" rules={[{ required: true, message: 'Please enter Customer ID!' }]}>
              <Select placeholder="Select Customer" showSearch>
                {customers.map(customer => (
                  <Option key={customer.id} value={customer.id}>{customer.customerName}</Option>
                ))}
              </Select>
            </Form.Item>)}

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

                        rules={[
                          { required: true, message: 'Enter Number Quantity' },
                          {
                            validator: (_, value) => {
                              if (value && value <= 0) {
                                return Promise.reject(new Error('Quantity must be a positive number'));
                              }
                              return Promise.resolve();
                            },
                          },

                        ]}
                      >
                        <Input type="number" placeholder="Quantity" />
                      </Form.Item>
                      {selectedIOType === 'In' && (
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
                        </Form.Item>)}
                      {selectedIOType === 'Out' && (
                        <Form.Item
                          {...restField}
                          name={[name, 'wineId']}
                          fieldKey={[fieldKey, 'wineId']}
                          rules={[{ required: true, message: 'Missing wine ID' }]}
                        >
                          <Select placeholder="Select Wine">
                            {wines.map(wine => (
                              <Option key={wine.wineId} value={wine.wineId}>
                                {wine.wineName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>)}
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