import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Button, Space, Descriptions, Divider } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

export const ViewDetailCRDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    // Fetch data from the API
    useEffect(() => {
        setData(mockData);
        // axios.get(`http://localhost:5245/api/v1/check-request-details/${id}`)
        //     .then(response => {
        //         setData(response.data);
        //     })
        //     .catch(error => console.error("Error fetching data:", error));
    }, [id]);

    if (!data) return <Text>Loading...</Text>;

    // Check if reportCode is valid (not empty, null, or whitespace)
    const showReportFields = data.reportCode && data.reportCode.trim() !== "";

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <Card bordered={false} style={{ minWidth: '100vw', margin: '0 auto', borderRadius: '8px' }}>
                <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Check Request Details</Title>

                <Descriptions column={1} bordered size="middle" labelStyle={{width: '22%'}} contentStyle={{width: '78%'}}>
                    <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
                    <Descriptions.Item label="Purpose">{data.purpose}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{new Date(data.startDate).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Due Date">{new Date(data.dueDate).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Comments">{data.comments || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Check Request ID">{data.checkRequestId}</Descriptions.Item>
                    <Descriptions.Item label="Check Request Code">{data.checkRequestCode || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Wine ID">{data.wineId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Supplier">{data.supplier || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Wine Name">{data.wineName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Manufacture Date">{data.mfd ? new Date(data.mfd).toLocaleDateString() : "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Room ID">{data.roomId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Room Name">{data.roomName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Room Capacity">{data.roomCapacity || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Checker ID">{data.checkerId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Checker Name">{data.checkerName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Wine Room ID">{data.wineRoomId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Expected Current Quantity">{data.expectedCurrQuantity || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Requester ID">{data.requesterId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Requester Name">{data.requesterName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Status">{data.status || "N/A"}</Descriptions.Item>
                </Descriptions>

                {showReportFields && (
                    <>
                        <Divider>Report Details</Divider>
                        <Descriptions column={1} bordered size="middle" labelStyle={{width: '22%'}} contentStyle={{width: '78%'}}>
                            <Descriptions.Item label="Report Code">{data.reportCode}</Descriptions.Item>
                            <Descriptions.Item label="Report Description">{data.reportDescription || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Reporter Assigned">{data.reporterAssigned || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Discrepancies Found">{data.discrepanciesFound || "None"}</Descriptions.Item>
                            <Descriptions.Item label="Actual Quantity">{data.actualQuantity || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Report File">{data.reportFile ? "Available" : "No file attached"}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}

                {!showReportFields && (
                    <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button type="primary" size="large" onClick={() => alert("Creating a report...")}>
                            Create a Report
                        </Button>
                    </Space>
                )}
            </Card>
        </div>
    );
};

export default ViewDetailCRDetailPage;


const mockData = {
    id: "CRD-001",
    purpose: "Quality Assurance Check",
    startDate: "2024-10-15T08:30:00Z",
    dueDate: "2024-10-30T17:00:00Z",
    comments: "This is a routine quality check request.",
    checkRequestId: "CR-2024-001",
    checkRequestCode: "CHK-2024-001",
    wineId: "WINE-1001",
    supplier: "Vineyard Suppliers Inc.",
    wineName: "Chardonnay Reserve 2022",
    mfd: "2022-05-01",
    roomId: "ROOM-301",
    roomName: "Aging Cellar",
    roomCapacity: 500,
    checkerId: "USR-002",
    checkerName: "John Doe",
    wineRoomId: "WR-2023-01",
    expectedCurrQuantity: 250,
    requesterId: "USR-001",
    requesterName: "Jane Smith",
    status: "Pending",
    reportCode: "REP-CHK-2024-001",
    reportDescription: "Initial quality discrepancies identified for further inspection.",
    reporterAssigned: "Michael Brown",
    discrepanciesFound: "Minor label misalignment",
    actualQuantity: 245,
    reportFile: "report-2024-CHK-001.pdf"
  };
  