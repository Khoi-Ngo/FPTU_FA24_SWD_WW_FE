import React, { useState, useEffect } from 'react';
import { Card, Typography, Descriptions, Space, Divider, Table, Tag, notification, Button, Modal, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { fetchIORequestByIdApi } from '../../services/api-service/IORequestApiService';
import { fetchReportByIdApi, updateReportApi, deleteReportApi } from '../../services/api-service/ReportApiService';
import { fetchSuppliersApi, fetchCustomersApi, fetchCheckersApi, fetchWineIDApi } from '../../services/api-service/FetchInputIORequest';
import { fetchRoomsAPI } from '~/services/api-service/RoomApiService';
const { Title } = Typography;
import { Upload } from 'antd';
import { uploadFileApi } from '../../services/api-service/ReportApiService';
import '../../styles/ReportDetailPage.css'
import { TbMessageReportFilled } from "react-icons/tb";
import { MdRequestPage } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
const ReportDetailPage = () => {
    const { id } = useParams();
    const [ioRequest, setIORequest] = useState(null);
    const [reports, setReports] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [checkers, setCheckers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [wines, setWines] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentReport, setCurrentReport] = useState(null);
    const [form] = Form.useForm();
    const token = window?.localStorage?.getItem("access_token")
    const authToken = `Bearer ${token}`

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
    const fetchIORequestDetail = async () => {
        try {
            const data = await fetchIORequestByIdApi(id);
            setIORequest(data);
        } catch (error) {
            console.error("Error fetching IO Request details:", error);
            notification.error({
                message: 'Error',
                description: 'Unable to load request list'
            });
        }
    };

    const fetchReportDetail = async () => {
        try {
            const reportData = await fetchReportByIdApi(id);
            setReports(reportData);
        } catch (error) {
            console.error("Error fetching report details:", error);
            notification.error({
                message: 'Error',
                description: 'Unable to load report information'
            });
        }
    };

    const fetchAdditionalData = async () => {
        try {
            const [suppliersData, customersData, checkersData, roomData, wineData] = await Promise.all([
                fetchSuppliersApi(authToken),
                fetchCustomersApi(authToken),
                fetchCheckersApi(authToken),
                fetchRoomsAPI(authToken),
                fetchWineIDApi(authToken),
            ]);
            setRooms(roomData);
            setSuppliers(suppliersData);
            setCustomers(customersData);
            setCheckers(checkersData);
            setWines(wineData);
        } catch (error) {
            console.error("Error fetching additional data:", error);
        }
    };

    useEffect(() => {
        fetchIORequestDetail();
        fetchReportDetail();
        fetchAdditionalData();
    }, [id]);

    const detailColumns = [
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

    ];

    const showUpdateModal = (report) => {
        setCurrentReport(report);
        form.setFieldsValue(report);
        setIsModalVisible(true);
    };

    const handleUpdateReport = async (values) => {
        try {
            let fileUrl = null;


            if (values.reportFile && values.reportFile.file) {
                fileUrl = await uploadFileApi(values.reportFile.file);
            }

            const ioRequestDetails = [{ ...values, id: currentReport.id, reportFile: fileUrl }];
            console.log("Data Respone:", ioRequestDetails);
            const response = await updateReportApi(ioRequest.id, ioRequestDetails);
            console.log("Response from API:", response);
            notification.success({
                message: 'Update successful',
                description: 'Report has been updated successfully.'
            });
            setIsModalVisible(false);
            await fetchReportDetail();
        } catch (error) {
            console.error("Error while updating report:", error);
            notification.error({
                message: 'Error',
                description: 'Unable to update report'
            });
        }
    };

    const handleDeleteReport = async (reportId, idDetails) => {
        try {
            await deleteReportApi(reportId, idDetails);
            notification.success({
                message: 'Delete successful ',
                description: 'Report deleted successfully.'
            });
            await fetchReportDetail();
        } catch (error) {
            console.error("Error while deleting report:", error);
            notification.error({
                message: 'Error',
                description: 'Unable to delete report'
            });
        }
    };

    if (!ioRequest || reports.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="io-request-details-container">
            <Card bordered={false} className="io-request-card">
                <Title level={2} className="io-request-title">IO Request Details No:{ioRequest.id}</Title>
                <Title level={3} className="io-request-subtitle">Request Information <MdRequestPage /></Title>
                <Divider />
                <Descriptions bordered className="io-request-descriptions">
                    <Descriptions.Item label="Request Code">{ioRequest.requestCode}</Descriptions.Item>
                    <Descriptions.Item label="Type">{ioRequest.ioType}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag className={`io-request-status-tag ${ioRequest.status.toLowerCase()}`}>
                            {ioRequest.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="StartDate">
                        {dayjs(ioRequest.startDate).format('YYYY-MM-DD')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Comment">{ioRequest.comments}</Descriptions.Item>
                    <Descriptions.Item label="Supplier">{getSupplierName(ioRequest.suplierId)}</Descriptions.Item>
                    <Descriptions.Item label="Customer">{getCustomerName(ioRequest.customerId)}</Descriptions.Item>
                    <Descriptions.Item label="Checker">{getCheckerName(ioRequest.checkerId)}</Descriptions.Item>
                    <Descriptions.Item label="Room Name">{getRoomName(ioRequest?.roomId)}</Descriptions.Item>
                </Descriptions>

                <Divider />
                <Title level={3} className="io-request-subtitle">Request Details <BiSolidShow /></Title>
                <Table
                    className="io-request-table"
                    columns={detailColumns}
                    dataSource={ioRequest.ioRequestDetails}
                    rowKey="id"
                    bordered
                    pagination={false}
                />

                <Divider />
                <Title level={3} className="io-request-subtitle">Report Information <TbMessageReportFilled /></Title>
                {reports.map((report, index) => (

                    <Descriptions bordered key={index} className="report-descriptions" style={{ paddingBottom: '30px' }}>
                        <Descriptions.Item label="Report ID">
                            {report.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Wine ID">
                            {report.wineId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quantity">
                            {report.quantity}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {report.reportDescription || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Reporter Assigned">
                            {report.reporterAssigned || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Discrepancies Quantity">
                            {report.discrepanciesFound !== null ? report.discrepanciesFound : 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Actual Quantity">
                            {report.actualQuantity}
                        </Descriptions.Item>
                        <Descriptions.Item label="Report File">
                            {report.reportFile ? <a href={report.reportFile}
                                target="_blank" rel="noopener noreferrer">
                                View file</a> : 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Actions">
                            <Button
                                className="update-button"
                                onClick={() => showUpdateModal(report)}
                                disabled={ioRequest.status !== 'Pending'}
                            >
                                Update Report
                            </Button>
                            <span> </span>
                            <Button
                                className="delete-button"
                                onClick={() => handleDeleteReport(id, report.id)}
                                disabled={ioRequest.status !== 'Pending'}
                            >
                                Delete
                            </Button>
                        </Descriptions.Item>

                    </Descriptions>
                ))}

                <Modal
                    title="Update Report Form"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    className="update-modal"
                >
                    <Form form={form} layout="vertical" onFinish={handleUpdateReport} className="update-form">
                        <Form.Item name="reportDescription" label="Description" rules={[{ required: true, message: 'Please enter a description!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="reporterAssigned" label="Reporter Assigned" rules={[{ required: true, message: 'Please enter the name' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="discrepanciesFound" label="Discrepancies Quantity">
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="actualQuantity" label="Actual Quantity">
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="reportFile" label="Report File">
                            <Upload beforeUpload={(file) => { form.setFieldsValue({ reportFile: { file } }); return false; }}>
                                <Button>Choose File</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );

};

export default ReportDetailPage; 