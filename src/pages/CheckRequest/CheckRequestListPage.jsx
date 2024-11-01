import React, { useState, useEffect } from 'react';
import { Table, Spin, Button, notification, Modal } from 'antd';
import { EditOutlined, EyeOutlined, UserDeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { disableCheckRequestAPI, fetchCheckRequestsAPI } from '~/services/api-service/CR-FLOW/CheckRequestApiService';

const CheckRequestListPage = () => {


    //#region init + load data
    const [checkRequests, setCheckRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;
  

    // Fetch data
    const fetchRequests = async () => {
        try {
            const response = await fetchCheckRequestsAPI(authToken);
            setCheckRequests(response.data);
            setIsLoading(false);
            notification.success({
                message: "Data loaded successfully",
            });
        } catch (e) {
            notification.error({
                message: "Error fetching data",
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);


       // Table columns definition
       const columns = [
        {
            title: 'Request ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'Request Code',
            dataIndex: 'requestCode',
            key: 'requestCode',
            align: 'center',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            align: 'center',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            align: 'center',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Priority Level',
            dataIndex: 'priorityLevel',
            key: 'priorityLevel',
            align: 'center',
        },
        {
            title: 'Requester',
            dataIndex: 'requesterName',
            key: 'requesterName',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
        },
        {
            title: 'Number of details',
            dataIndex: 'noOfDetails',
            key: 'noOfDetails',
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(record.id)}
                    >
                        <UserDeleteOutlined />
                    </Button>
                    <Button
                        style={styles.viewButton}
                        onClick={() => handleViewDetails(record.id)}
                    >
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];

    //#endregion

    //#region Handle create request
    const handleCreate = () => {
        navigate(`/app/create-check-request`);
    };

    //#endregion

    //#region handle delete
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Disable Check Request',
            content: <p>Are you sure you want to disable this check request?</p>,
            onOk: async () => {
                try {
                    await disableCheckRequestAPI(id, authToken);
                    notification.success({
                        message: 'Disable Successful',
                        description: 'The check request has been disabled.',
                    });

                } catch (error) {
                    notification.error({
                        message: 'Disable Failed',
                        description: 'Could not disable check request.',
                    });
                } finally {
                    //fetching all the list again
                    fetchRequests();
                }
            }
        });
    };
    //#endregion

    //#region Handle view details
    const handleViewDetails = (requestId) => {
        navigate(`/app/check-requests/${requestId}`);
    };
    //#endregion

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.pageTitle}>Check Request List</h1>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={styles.createButton}
                onClick={handleCreate}
                shape='round'
            >
                Create a New Check Request
            </Button>
            {isLoading ? (
                <Spin size="large" style={styles.spinner} />
            ) : (
                <Table
                    dataSource={checkRequests}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    style={styles.table}
                />
            )}
        </div>
    );
};

//#region Inline styles
const styles = {
    pageContainer: {
        padding: '40px',
        backgroundColor: '#f4f7fa',
        minHeight: '100vh',
    },
    pageTitle: {
        textAlign: 'center',
        fontSize: '32px',
        color: '#4a4a4a',
        marginBottom: '20px',
    },
    createButton: {
        marginBottom: '20px',
        float: 'right',
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
        fontSize: '16px',
    },
    spinner: {
        display: 'block',
        margin: '0 auto',
    },
    table: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    deleteButton: {
        backgroundColor: '#ff4d4f',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    editButton: {
        backgroundColor: '#52c41a',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    viewButton: {
        backgroundColor: '#1890ff',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
};

//#endregion

export default CheckRequestListPage;
