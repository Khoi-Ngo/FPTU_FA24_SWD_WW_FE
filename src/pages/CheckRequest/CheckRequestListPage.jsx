import React, { useState, useEffect } from 'react';
import { Table, Spin, Button, notification, Modal, Input, Select, Row, Col, Tag } from 'antd';
import { EditOutlined, EyeOutlined, UserDeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { disableCheckRequestAPI, fetchCheckRequestsAPI } from '~/services/api-service/CR-FLOW/CheckRequestApiService';

const CheckRequestListPage = () => {

    //#region init + load data
    const [checkRequests, setCheckRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const navigate = useNavigate();
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;

    // Fetch data
    const fetchRequests = async () => {
        try {
            const response = await fetchCheckRequestsAPI(authToken);
            setCheckRequests(response.data);
            setFilteredRequests(response.data);
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
    //Handle reset filtering / searching
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter(null);
        setPriorityFilter(null);
        setFilteredRequests(checkRequests); // Reset the filtered requests to the full list
    };
    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterRequests(e.target.value, statusFilter, priorityFilter);
    };

    // Handle status filter change
    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        filterRequests(searchTerm, value, priorityFilter);
    };

    // Handle priority filter change
    const handlePriorityFilterChange = (value) => {
        setPriorityFilter(value);
        filterRequests(searchTerm, statusFilter, value);
    };

    // Filter requests based on search term and filters
    const filterRequests = (searchTerm, status, priority) => {
        const filtered = checkRequests.filter((request) => {
            const matchesSearch = request.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = status ? request.status === status : true;
            const matchesPriority = priority ? request.priorityLevel === priority : true;

            return matchesSearch && matchesStatus && matchesPriority;
        });
        setFilteredRequests(filtered);
    };

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
            render: (requestCode) => <Tag color="gray" style={{ fontWeight: 'bolder' }}>{requestCode}</Tag>,
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
            render: (priorityLevel) => {
                let color;
                switch (priorityLevel) {
                    case 'High':
                        color = 'volcano';  // Bright color to signify high priority
                        break;
                    case 'Medium':
                        color = 'gold';     // Yellow color for medium priority
                        break;
                    case 'Low':
                        color = 'green';    // Green color for low priority
                        break;
                    default:
                        color = 'gray';     // Default color for undefined priority levels
                }
                return <Tag color={color}>{priorityLevel}</Tag>;
            },
        },
        {
            title: 'Requester',
            dataIndex: 'requesterName',
            key: 'requesterName',
            align: 'center',
        },

        {
            title: 'Number of details',
            dataIndex: 'noOfDetails',
            key: 'noOfDetails',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                let color;
                switch (status) {
                    case 'COMPLETED':
                        color = 'green';
                        break;
                    case 'ACTIVE':
                        color = 'blue';
                        break;
                    case 'DISABLED':
                        color = 'red';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color}>{status}</Tag>;
            },
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

            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={6}>
                    <Input
                        placeholder="Search by Request Code or Requester"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Filter by Status"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="ACTIVE">Active</Select.Option>
                        <Select.Option value="COMPLETED">Completed</Select.Option>
                        <Select.Option value="DISABLED">Disabled</Select.Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Filter by Priority"
                        value={priorityFilter}
                        onChange={handlePriorityFilterChange}
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="High">High</Select.Option>
                        <Select.Option value="Medium">Medium</Select.Option>
                        <Select.Option value="Low">Low</Select.Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <Button
                        type="default"
                        icon={<ReloadOutlined />}
                        style={styles.resetButton}
                        onClick={resetFilters}
                        shape='round'
                    >
                        Reset Filters
                    </Button>
                </Col>
                <Col span={6}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={styles.createButton}
                        onClick={handleCreate}
                        shape='round'
                    >
                        Create a New Check Request
                    </Button>
                </Col>
            </Row>

            {isLoading ? (
                <Spin size="large" style={styles.spinner} />
            ) : (
                <Table
                    dataSource={filteredRequests}
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
    resetButton: {
        marginBottom: '20px',
        float: 'right',
        backgroundColor: '#f5f5f5',
        borderColor: '#d9d9d9',
        fontSize: '16px',
        marginLeft: '10px',
    },
};
//#endregion

export default CheckRequestListPage;
