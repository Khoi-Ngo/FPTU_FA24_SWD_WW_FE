import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Card, Divider, notification, Tag } from 'antd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { fetchIORequestApi } from '../../services/api-service/IORequestApiService';

const { Title } = Typography;

const ReportListPage = () => {
    const navigate = useNavigate();
    const [ioRequests, setIORequests] = useState([]);
    const token = window?.localStorage?.getItem("access_token")
    const authToken = `Bearer ${token}`


    const fetchData = async () => {
        try {
            const requests = await fetchIORequestApi(authToken);
            console.log("Fetched IO Requests:", requests);
            setIORequests(requests);
        } catch (error) {
            console.error("Error fetching IO Requests:", error);
            notification.error({
                message: 'Error',
                description: 'Unable to load request list'
            });
        }
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
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : 'N/A'),
            sorter: (a, b) => new Date(b.startDate) - new Date(a.startDate),
        },
        {
            title: 'TYPE',
            dataIndex: 'ioType',
            key: 'ioType',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={
                    status === "Pending" ? 'gold' :
                        status === "Done" ? 'green' :
                            status === "Cancelled" ? 'red' : 'default'
                }>
                    {status || 'Unknown'}
                </Tag>
            )
        },
        {
            title: 'Report',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        style={{ backgroundColor: 'yellow', color: 'black' }}
                        type="primary"
                        onClick={() => handleDetail(record)}
                        title='Details Report'
                    >
                        <ArrowForwardIosIcon />
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDetail = (record) => {
        navigate(`/app/io-report/report-details/${record.id}`);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card bordered={false}>
                <Title level={2}>Report I/O Request List</Title>
                <Divider />

                <Table
                    columns={columns}
                    dataSource={ioRequests}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default ReportListPage;
