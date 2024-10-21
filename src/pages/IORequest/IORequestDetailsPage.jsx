import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchIORequestByIdApi } from '../../services/api-service/IORequestApiService';
import { Card, Descriptions, Spin, Divider, Typography, Table } from 'antd';
import '../../styles/IORequestDetailsPage.css'
const { Title } = Typography;

export const IORequestDetailsPage = () => {
    const { id } = useParams();
    const [ioRequest, setIORequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestDetails = await fetchIORequestByIdApi(id);
                setIORequest(requestDetails);
            } catch (error) {
                console.error('Error fetching IO Request details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
    }

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
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'IO RequestID',
            dataIndex: 'ioRequestId',
            key: 'ioRequestId',

        },
    ];

    return (
        <div className="container">
            <Card title="IO Request Details" bordered={false} className="card">
                <Title level={3} className="request-title">Request Information</Title>
                <Descriptions bordered column={1} size="small" style={{ marginBottom: '20px' }}>
                    <Descriptions.Item label="Request Code">
                        <strong>{ioRequest?.requestCode}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Date">
                        <strong>{ioRequest?.startDate}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Due Date">
                        <strong>{ioRequest?.dueDate}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="IO Type">
                        <strong>{ioRequest?.ioType}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <span className={ioRequest?.status === 'Active' ? 'request-status-active' : 'request-status-inactive'}>
                            {ioRequest?.status}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Supplier Name">
                        <strong>{ioRequest?.supplierName}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer Name">
                        <strong>{ioRequest?.customerName}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Checker Name">
                        <strong>{ioRequest?.checkerName}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Comments">
                        <strong>{ioRequest?.comments}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Room ID">
                        <strong>{ioRequest?.roomId}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Checker ID">
                        <strong>{ioRequest?.checkerId}</strong>
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4} className="details-title">Request Details</Title>
                <Table
                    columns={columns}
                    dataSource={ioRequest?.ioRequestDetails.map((detail, index) => ({ key: index, ...detail }))}
                    pagination={false}
                    bordered
                    className="table-background"
                />
            </Card>
        </div>
    );
};
