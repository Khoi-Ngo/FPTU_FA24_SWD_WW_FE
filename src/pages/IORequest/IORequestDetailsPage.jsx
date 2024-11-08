import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchIORequestByIdApi } from '../../services/api-service/IORequestApiService';
import { Card, Descriptions, Spin, Divider, Typography, Table, Button, Modal, Form, Input, Select, Space } from 'antd';
import '../../styles/IORequestDetailsPage.css';
const { Title } = Typography;
import { fetchRoomsAPI } from '~/services/api-service/RoomApiService';
import { fetchSuppliersApi, fetchCheckersApi, fetchCustomersApi, fetchWineIDApi } from '~/services/api-service/FetchInputIORequest';
import { addIORequestDetail, deleteIORequestDetail, updateIORequestDetail } from '~/services/api-service/DetailsApiService';
import { PlusOutlined } from '@ant-design/icons'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

export const IORequestDetailsPage = () => {
    const { id } = useParams();
    const [ioRequest, setIORequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [checkers, setCheckers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [wines, setWines] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDetail, setCurrentDetail] = useState(null);
    const [form] = Form.useForm();
    const token = window?.localStorage?.getItem("access_token")
    const authToken = `Bearer ${token}`


    const fetchData = async () => {
        try {
            const requestDetails = await fetchIORequestByIdApi(id);
            setIORequest(requestDetails);
            const [roomData, supplierData, checkerData, customerData, wineData] = await Promise.all([
                fetchRoomsAPI(authToken),
                fetchSuppliersApi(authToken),
                fetchCheckersApi(authToken),
                fetchCustomersApi(authToken),
                fetchWineIDApi(authToken),
            ]);
            setRooms(roomData);
            setSuppliers(supplierData);
            setCheckers(checkerData);
            setCustomers(customerData);
            setWines(wineData);
        } catch (error) {
            console.error('Error fetching IO Request details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
    }

    const getSupplierName = (suplierId) => {
        const supplier = suppliers.find(s => s.id === suplierId);
        return supplier ? supplier.suplierName : 'N/A';
    };

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.customerName : 'N/A';
    };

    const getCheckerName = (checkerId) => {
        const checker = checkers.find(c => c.id === checkerId);
        return checker ? checker.username : 'N/A';
    };

    const getRoomName = (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        return room ? room.roomName : 'N/A';
    };

    const getWineName = (wineId) => {
        const wine = wines.find(r => r.id === wineId);
        return wine ? wine.wineName : 'N/A';
    };

    const handleAddDetail = async () => {
        try {
            const values = await form.validateFields();
            const newDetail = {
                quantity: values.quantity,
                wineId: values.wineId,
            };
            await addIORequestDetail(ioRequest.id, newDetail, authToken);
            console.log('Detail added');

            fetchData();
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Failed to add detail:', error);
        }
    };

    const handleEditDetail = async () => {
        try {
            const values = await form.validateFields();
            const updatedDetail = {
                id: currentDetail.id,
                quantity: values.quantity,
                wineId: values.wineId,
            };
            await updateIORequestDetail(ioRequest.id, updatedDetail, authToken);
            console.log('Detail updated');

            fetchData();
            setIsModalVisible(false);
            form.resetFields();
            setCurrentDetail(null);
        } catch (error) {
            console.error('Failed to update detail:', error);
        }
    };

    const handleDeleteDetail = async (detailId) => {
        try {
            await deleteIORequestDetail(ioRequest.id, detailId, authToken);
            console.log('Detail deleted');
            setIORequest(prev => ({
                ...prev,
                ioRequestDetails: prev.ioRequestDetails.filter(detail => detail.id !== detailId),
            }));
        } catch (error) {
            console.error('Failed to delete detail:', error);
        }
    };

    const columns = [
        {
            title: 'Detail ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Wine ID',
            dataIndex: 'wineId',
            key: 'wineId',
        },
        {
            title: 'Wine Name',
            dataIndex: 'wineId',
            key: 'wineName',
            render: (wineId) => getWineName(wineId),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="default" color='primary' variant='solid' onClick={() => { setIsModalVisible(true); setCurrentDetail(record); form.setFieldsValue({ quantity: record.quantity, wineId: record.wineId }); }} ><EditIcon /></Button>
                    <Button color='danger' variant='solid' onClick={() => handleDeleteDetail(record.id)} type="link" danger><DeleteIcon /></Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="container">
            <Card title="IO Request Details" bordered={false} className="card">
                <Title level={3} className="request-title">Request Information</Title>
                <Descriptions bordered column={1} size="small" style={{ marginBottom: '20px' }}>
                    <Descriptions.Item label="Request Code"><strong>{ioRequest?.requestCode}</strong></Descriptions.Item>
                    <Descriptions.Item label="Start Date"><strong>{ioRequest?.startDate}</strong></Descriptions.Item>

                    <Descriptions.Item label="IO Type"><strong>{ioRequest?.ioType}</strong></Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <span className={ioRequest?.status === 'Pending' ? 'request-status-pending' :
                            ioRequest?.status === 'Done' ? 'request-status-done' :
                                ioRequest?.status === 'Cancel' ? 'request-status-cancel' : ''}>
                            {ioRequest?.status}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Supplier ID"><strong>{ioRequest?.suplierId}</strong></Descriptions.Item>
                    <Descriptions.Item label="Supplier Name"><strong>{getSupplierName(ioRequest?.suplierId)}</strong></Descriptions.Item>
                    <Descriptions.Item label="Customer ID"><strong>{ioRequest?.customerId}</strong></Descriptions.Item>
                    <Descriptions.Item label="Customer Name"><strong>{getCustomerName(ioRequest?.customerId)}</strong></Descriptions.Item>
                    <Descriptions.Item label="Checker ID"><strong>{ioRequest?.checkerId}</strong></Descriptions.Item>
                    <Descriptions.Item label="Checker Name"><strong>{getCheckerName(ioRequest?.checkerId)}</strong></Descriptions.Item>
                    <Descriptions.Item label="Comments"><strong>{ioRequest?.comments}</strong></Descriptions.Item>
                    <Descriptions.Item label="Room ID"><strong>{ioRequest?.roomId}</strong></Descriptions.Item>
                    <Descriptions.Item label="Room Name"><strong>{getRoomName(ioRequest?.roomId)}</strong></Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4} className="details-title">Request Details</Title>
                <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} style={{ marginBottom: '16px' }}>
                    Add New Details
                </Button>
                <Table
                    columns={columns}
                    dataSource={ioRequest?.ioRequestDetails.map((detail, index) => ({ key: index, ...detail }))}
                    pagination={false}
                    bordered
                    className="table-background"
                />

                {/* Modal Add/Edit */}
                <Modal
                    title={currentDetail ? 'Edit Form' : 'Add Form'}
                    open={isModalVisible}
                    onCancel={() => { setIsModalVisible(false); form.resetFields(); setCurrentDetail(null); }}
                    onOk={currentDetail ? handleEditDetail : handleAddDetail}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="wineId" label="Wine ID" rules={[{ required: true, message: 'Enter Wine ID!' }]}>
                            <Select placeholder="Select Wine ID">
                                {wines.map(wine => (
                                    <Select.Option key={wine.id} value={wine.id}>{wine.wineName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Enter Quantity!' }]}>
                            <Input type="number" placeholder="Enter Quantity" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default IORequestDetailsPage;
