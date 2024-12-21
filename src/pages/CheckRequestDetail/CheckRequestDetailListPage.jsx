import React, { useContext, useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Button, notification, Modal, Select, Input, DatePicker } from 'antd';
import { createAddCheckRequestAPI, disableCheckRequestDetailAPI, fetchAllCheckRequestDetailsAPI } from '~/services/api-service/CR-FLOW/CheckRequestDetailApiService';
import { AuthContext } from '~/components/auth-context';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchAllStaffAPI } from '~/services/api-service/UserApiService';
import { fetchAllActiveWineRoomNameAPI } from '~/services/api-service/WineRoomeApiService';
import { Option } from 'antd/es/mentions';
import { fetchCheckRequestsAPI } from '~/services/api-service/CR-FLOW/CheckRequestApiService';

const { Text } = Typography;
export const CheckRequestDetailListPage = () => {
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;
    //#region init + load data
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        purpose: '',
        startDate: null,
        dueDate: null,
        comments: '',
        checkRequestId: '',
        checkerId: '',
        wineRoomId: '',
    });

    const initialFormData = {
        purpose: '',
        startDate: null,
        dueDate: null,
        comments: '',
        wineRoomId: null,
        checkerId: null,
        checkRequestId: '',
    };

    const [staffOptions, setStaffOptions] = useState([]);
    const [wineRoomOptions, setWineRoomOptions] = useState([]);
    const [checkRequestOptions, setCheckRequestOptions] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const response = await fetchAllCheckRequestDetailsAPI(authToken);
            setData(response.data);
            notification.success({
                message: "Load oke"
            })
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchAllStaffActive = async () => {
        try {
            const response = await fetchAllStaffAPI(authToken);
            if (response.data) {
                const staffList = response.data.map(staff => ({
                    label: `${staff.firstName} ${staff.lastName} (${staff.username})`,
                    value: staff.id,
                }));
                setStaffOptions(staffList);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const populateWineRoomOptions = async () => {
        try {
            const response = await fetchAllActiveWineRoomNameAPI(authToken);
            if (response.data) {
                const wineRooms = response.data.map(room => ({
                    label: `WRID: ${room.id} - RID: ${room.roomId} - RName: ${room.roomName} - WID: ${room.wineId} - WName: ${room.wineName}`,
                    value: room.id,
                }));
                setWineRoomOptions(wineRooms);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const populateMainCheckRequestOptions = async () => {
        try {
            const response = await fetchCheckRequestsAPI(authToken);
            console.log(response.data);
            if (response.data) {
                const checkRequests = response.data.map(cr => ({
                    label: `CRID: ${cr.id}-CODE: ${cr.requestCode}-${cr.startDate}->${cr.dueDate}`,
                    value: cr.id,
                }));
                setCheckRequestOptions(checkRequests);
            } else {
                notification.warning(
                    {
                        message: "Something wrong"
                    }
                )
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchAllStaffActive();
        fetchData();
        populateWineRoomOptions();
        populateMainCheckRequestOptions();
        setFilteredData(data);

    }, []);
    const formatValue = (value) => (value && value.trim() ? value : 'N/A');
    console.log("DEMO COMMIT NEW PC");
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (id) => <Tag color="gray" style={{ fontWeight: 'bolder' }}>{id}</Tag>
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            align: 'center',
            ellipsis: true,
            render: (purpose) => <Text>{formatValue(purpose)}</Text>
        },
        {
            title: 'Check Request ID',
            dataIndex: 'checkRequestId',
            key: 'checkRequestId',
            align: 'center',
            render: (checkRequestId) => <Tag style={{ fontWeight: 'bolder' }}>{checkRequestId}</Tag>
        },
        {
            title: 'Wine Room ID',
            dataIndex: 'wineRoomId',
            key: 'wineRoomId',
            align: 'center',
            render: (wineRoomId) => <Text>{wineRoomId}</Text>
        },
        {
            title: 'Wine Name',
            dataIndex: 'wineName',
            key: 'wineName',
            align: 'center',
            render: (wineName) => (
                <Tag color="purple" style={{ fontWeight: 'bold', padding: '5px 10px', borderRadius: '8px' }}>
                    {formatValue(wineName)}
                </Tag>
            )
        },
        {
            title: 'Room Name',
            dataIndex: 'roomName',
            key: 'roomName',
            align: 'center',
            render: (roomName) => (
                <Tag color="cyan" style={{ fontWeight: 'bold', padding: '5px 10px', borderRadius: '8px' }}>
                    {formatValue(roomName)}
                </Tag>
            )
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
                return (
                    <Tag color={color}>
                        {status || 'Unknown'}
                    </Tag>
                );
            }
        },

        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {userLogin.role === "MANAGER" && (
                        <Button onClick={() => handleDelete(record.id)}>
                            <DeleteOutlined />
                        </Button>
                    )}
                    <Button onClick={() => handleViewDetails(record.id)}>
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];

    //handling searching || filtering data table
    useEffect(() => {
        const filtered = data.filter(item =>
            item.purpose.toLowerCase().includes(searchText.toLowerCase()) ||
            item.checkRequestId.toString().includes(searchText) ||
            item.roomName?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.wineName?.toLowerCase().includes(searchText.toLowerCase())
        ).filter(item => (statusFilter ? item.status === statusFilter : true));
        setFilteredData(filtered);
    }, [data, searchText, statusFilter]);
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };
    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const resetFilters = () => {
        setSearchText('');
        setStatusFilter(null);
    };

    //#endregion

    //#region handle delete
    const handleDelete = async (id, checkRequestId) => {
        Modal.confirm({
            title: 'Disable Check Request',
            content: <p>Are you sure you want to disable this check request?</p>,
            onOk: async () => {
                try {
                    await disableCheckRequestDetailAPI(id, authToken);
                    notification.success({
                        message: 'Disable Successful',
                        description: 'The check request detail has been disabled.',
                    });

                } catch (error) {
                    notification.error({
                        message: 'Disable Failed',
                        description: 'Could not disable check request detail.',
                    });
                } finally {
                    fetchData();
                }
            }
        });

    }
    //#endregion

    //#region handle view detail
    const handleViewDetails = async (id) => {
        navigate(`/app/check-request-details/${id}`);
    }

    //#endregion

    //#region handle create additional check request
    // Handle form input changes
    const handleInputChangeFormAdditional = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveCreateAdditional = async () => {
        try {
            console.log(formData);
            await createAddCheckRequestAPI(formData, authToken);
            notification.success({
                message: 'Additional Created',
                description: 'The additional check request detail was successfully created.',
            });
            hideModal();
            // Optionally, reload details here
        } catch (error) {
            notification.error({
                message: 'Create Failed',
                description: 'Failed to create additional check request detail.',
            });
        }
    };

    const handleCreateAdditional = async () => {
        try {
            await handleSaveCreateAdditional();
        } catch (error) {
            notification.error({
                message: "Cannot create",
                description: "Fail to create additional detail for this check request"
            })
        } finally {
            //fetch all check request details again
            fetchData();
            setFormData(initialFormData);
        }
    }

    // Show/Hide Modal
    const showModal = () => setIsModalVisible(true);
    const hideModal = () => {
        setIsModalVisible(false);
        setFormData(initialFormData);
    };


    //#endregion
    return (
        <div style={{ padding: '20px' }}>
            <h2>Check Request Details</h2>
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {userLogin.role === "MANAGER" && (
                        <Button type="primary" style={{ margin: '30px' }} onClick={() => setIsModalVisible(true)}>
                            CREATE ADDITIONAL
                        </Button>
                    )}

                    <div style={{ margin: '30px', display: 'flex', gap: '10px' }}>
                        <Input
                            placeholder="Search by Purpose, Request ID, Room Name, or Wine Name"
                            prefix={<SearchOutlined />}
                            onChange={handleSearch}
                            value={searchText}
                        />
                        <Select
                            placeholder="Filter by Status"
                            onChange={handleStatusFilterChange}
                            allowClear
                            style={{ width: 200 }}
                        >
                            <Select.Option value="COMPLETED">Completed</Select.Option>
                            <Select.Option value="ACTIVE">Active</Select.Option>
                            <Select.Option value="DISABLED">Disabled</Select.Option>
                        </Select>
                        <Button onClick={resetFilters}>Reset Filters</Button>
                    </div>


                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{ pageSize: 8 }}
                    />

                    <Modal
                        title="Create Additional Check Request Detail"
                        open={isModalVisible}
                        onOk={handleCreateAdditional}
                        onCancel={hideModal}
                        okText="Create"
                        style={{ minWidth: '80vw' }}
                    >
                        <label>Purpose</label>
                        <Input.TextArea
                            placeholder="Purpose"
                            value={formData.purpose}
                            onChange={(e) => handleInputChangeFormAdditional('purpose', e.target.value)}
                            style={{ marginBottom: 10, width: '100%', height: '60px' }} // Bigger input field
                        />
                        <DatePicker
                            placeholder="Start Date"
                            value={formData.startDate}
                            onChange={(date) => handleInputChangeFormAdditional('startDate', date)}
                            style={{ marginBottom: 10, width: '100%' }}
                        />
                        <DatePicker
                            placeholder="Due Date"
                            value={formData.dueDate}
                            onChange={(date) => handleInputChangeFormAdditional('dueDate', date)}
                            style={{ marginBottom: 10, width: '100%' }}
                        />
                        <label>Comments</label>
                        <Input.TextArea
                            placeholder="Comments"
                            value={formData.comments}
                            onChange={(e) => handleInputChangeFormAdditional('comments', e.target.value)}
                            style={{ marginBottom: 10, width: '100%', height: '60px' }} // Bigger input field
                        />
                        <label>Check Request</label>
                        <Select
                            placeholder="Select CR"
                            value={formData.checkRequestId}
                            onChange={(value) => handleInputChangeFormAdditional('checkRequestId', value)}
                            style={{ marginBottom: 10, width: '100%' }}
                        >
                            {checkRequestOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                        <label>Wine Room</label>
                        <Select
                            placeholder="Select Wine Room"
                            value={formData.wineRoomId}
                            onChange={(value) => handleInputChangeFormAdditional('wineRoomId', value)}
                            style={{ marginBottom: 10, width: '100%' }}
                        >
                            {wineRoomOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                        <label>Checker</label>
                        <Select
                            placeholder="Select Checker"
                            value={formData.checkerId}
                            onChange={(value) => handleInputChangeFormAdditional('checkerId', value)}
                            style={{ marginBottom: 10, width: '100%' }}
                        >
                            {staffOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Modal>
                </>
            )}


        </div>
    );
};
