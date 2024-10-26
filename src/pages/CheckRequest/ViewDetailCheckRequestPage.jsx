import React, { useEffect, useState } from 'react';
import { Card, Table, Descriptions, Spin, notification, Button, Modal, Input, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
    fetchViewDetailCheckRequestAPI,
    updateCheckRequestAPI,
    disableCheckRequestAPI
} from '~/services/api-service/CR-FLOW/CheckRequestApiService';

const { Option } = Select;

const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
];

const ViewDetailCheckRequestPage = () => {
    const { requestId } = useParams();
    const [checkRequestDetails, setCheckRequestDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newData, setNewData] = useState({});
    const [comments, setComments] = useState('');
    const navigate = useNavigate();

    const fetchDetails = async () => {
        try {
            const response = await fetchViewDetailCheckRequestAPI({ requestId });
            setCheckRequestDetails(response.data);
            setNewData(response.data); // Initialize newData with current data
            setIsLoading(false);
        } catch (error) {
            notification.error({
                message: 'Error fetching details',
                description: 'Could not load check request details',
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [requestId]);

    const handleBack = () => {
        navigate(`/app/check-requests`);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchDetails(); // Refetch data to reset to original values
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewData({ ...newData, [name]: value });
    };

    const handleSelectChange = (value) => {
        setNewData({ ...newData, priorityLevel: value });
    };

    const handleSave = async () => {
        try {
            await updateCheckRequestAPI(newData);
            notification.success({
                message: 'Update Successful',
                description: 'The check request has been updated.',
            });
            setIsEditing(false);
            fetchDetails(); // Reload data
        } catch (error) {
            notification.error({
                message: 'Update Failed',
                description: 'Could not update check request.',
            });
        }
    };

    const handleDisable = () => {
        // Confirmation modal for disabling the check request
        Modal.confirm({
            title: 'Disable Check Request',
            content: (
                <div>
                    <p>Are you sure you want to disable this check request?</p>
                </div>
            ),
            onOk: async () => {
                try {
                    // Call disable API only after user confirms
                    await disableCheckRequestAPI({ requestId }); // No comments passed
                    notification.success({
                        message: 'Disable Successful',
                        description: 'The check request has been disabled.',
                    });
                    fetchDetails(); // Reload data
                } catch (error) {
                    notification.error({
                        message: 'Disable Failed',
                        description: 'Could not disable check request.',
                    });
                }
            }
        });
    };


    if (isLoading) {
        return <Spin size="large" style={styles.spinner} />;
    }

    const { id, purpose, requestCode, startDate, dueDate, priorityLevel, requesterId, requesterName, status, checkRequestDetails: details } = newData;

    const detailColumns = [
        { title: 'Detail ID', dataIndex: 'id', key: 'id', align: 'center' },
        { title: 'Purpose', dataIndex: 'purpose', key: 'purpose', align: 'center' },
        { title: 'Check Request ID', dataIndex: 'checkRequestId', key: 'checkRequestId', align: 'center' },
        { title: 'Wine ID', dataIndex: 'wineId', key: 'wineId', align: 'center' },
        { title: 'Wine Name', dataIndex: 'wineName', key: 'wineName', align: 'center' },
        { title: 'MFD', dataIndex: 'mfd', key: 'mfd', align: 'center', render: (date) => (date ? new Date(date).toLocaleDateString() : '-') },
        { title: 'Room ID', dataIndex: 'roomId', key: 'roomId', align: 'center' },
        { title: 'Room Name', dataIndex: 'roomName', key: 'roomName', align: 'center' },
        { title: 'Checker ID', dataIndex: 'checkerId', key: 'checkerId', align: 'center' },
        { title: 'Checker Name', dataIndex: 'checkerName', key: 'checkerName', align: 'center' },
        { title: 'Wine Room ID', dataIndex: 'wineRoomId', key: 'wineRoomId', align: 'center' },
        { title: 'Expected Current Quantity', dataIndex: 'expectedCurrQuantity', key: 'expectedCurrQuantity', align: 'center' },
    ];

    return (
        <div style={styles.pageContainer}>
            <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                style={styles.backButton}
            >
                Back
            </Button>
            <h1 style={styles.pageHeader}>Check Request Details</h1>
            <Card style={styles.infoCard}>
                <h2 style={styles.sectionHeader}>Check Request Information</h2>
                <Descriptions bordered column={1} labelStyle={styles.labelStyle} contentStyle={styles.contentStyle}>
                    <Descriptions.Item label="Request ID">{id}</Descriptions.Item>
                    <Descriptions.Item label="Request Code">{requestCode}</Descriptions.Item>
                    <Descriptions.Item label="Purpose">
                        {isEditing ? (
                            <Input name="purpose" value={newData.purpose} onChange={handleInputChange} />
                        ) : (
                            purpose
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Date">
                        {isEditing ? (
                            <Input name="startDate" type="date" value={new Date(newData.startDate).toISOString().split('T')[0]} onChange={handleInputChange} />
                        ) : (
                            new Date(startDate).toLocaleDateString()
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Due Date">
                        {isEditing ? (
                            <Input name="dueDate" type="date" value={new Date(newData.dueDate).toISOString().split('T')[0]} onChange={handleInputChange} />
                        ) : (
                            new Date(dueDate).toLocaleDateString()
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Priority Level">
                        {isEditing ? (
                            <Select
                                value={newData.priorityLevel}
                                onChange={handleSelectChange}
                                style={{ width: '100%' }}
                            >
                                {priorityOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            priorityLevel
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Requester ID">{requesterId}</Descriptions.Item>
                    <Descriptions.Item label="Requester Name">{requesterName}</Descriptions.Item>
                    <Descriptions.Item label="Status">{status}</Descriptions.Item>
                    <Descriptions.Item label="Comments">
                        {isEditing ? (
                            <Input name="comments" value={newData.comments || ''} onChange={handleInputChange} />
                        ) : (
                            (newData.comments && newData.comments.length > 0) ? newData.comments : '-'
                        )}
                    </Descriptions.Item>
                </Descriptions>
                <Button onClick={isEditing ? handleSave : handleEdit} type="primary" style={{ marginRight: 8 }}>
                    {isEditing ? 'Save' : 'Edit'}
                </Button>
                {isEditing && (
                    <Button onClick={handleCancelEdit} type="default">
                        Cancel
                    </Button>
                )}
                <Button onClick={handleDisable} type="danger" style={{ marginLeft: 8 }}>
                    Disable
                </Button>
            </Card>

            <Card style={styles.tableCard}>
                <h2 style={styles.sectionHeader}>Check Request Detailed Items</h2>
                <Table
                    dataSource={details}
                    columns={detailColumns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    style={styles.table}
                />
            </Card>
        </div>
    );
};

const styles = {
    pageContainer: {
        padding: '20px',
    },
    backButton: {
        marginBottom: '20px',
    },
    pageHeader: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    infoCard: {
        marginBottom: '20px',
    },
    sectionHeader: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    labelStyle: {
        fontWeight: 'bold',
    },
    contentStyle: {
        fontSize: '16px',
    },
    tableCard: {
        marginBottom: '20px',
    },
    table: {
        marginTop: '10px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
};

export default ViewDetailCheckRequestPage;
