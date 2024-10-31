import React, { useContext, useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Button, notification, Modal, Select, Input, DatePicker } from 'antd';
import { createAddCheckRequestAPI, disableCheckRequestDetailAPI, fetchAllCheckRequestDetailsAPI } from '~/services/api-service/CR-FLOW/CheckRequestDetailApiService';
import { AuthContext } from '~/components/auth-context';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchAllStaffAPI } from '~/services/api-service/UserApiService';
import { fetchAllActiveWineRoomNameAPI } from '~/services/api-service/WineRoomeApiService';
import { Option } from 'antd/es/mentions';

const { Text } = Typography;

export const CheckRequestDetailListPage = () => {

    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;
    //#region init + load data
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        purpose: '',
        startDate: null,
        dueDate: null,
        comments: '',
        checkRequestId: '',
        checkRequestCode: '',
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
    };

    const [staffOptions, setStaffOptions] = useState([]);
    const [wineRoomOptions, setWineRoomOptions] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const response = await fetchAllCheckRequestDetailsAPI();
            setData(response.data);
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
            notification.error({ message: 'Failed to fetch staff', description: error.message });
        }
    };
    const populateWineRoomOptions = async () => {
        try {
            const response = await fetchAllActiveWineRoomNameAPI();
            if (response.data) {
                const wineRooms = response.data.map(room => ({
                    label: `WRID: ${room.id} - RID: ${room.roomId} - RName: ${room.roomName} - WID: ${room.wineId} - WName: ${room.wineName}`,
                    value: room.id,  // Ensure this matches the key used in the data source
                }));
                setWineRoomOptions(wineRooms);
            }
        } catch (error) {
            notification.error({ message: 'Failed to fetch wine rooms', description: error.message });
        }
    };

    useEffect(() => {
        fetchAllStaffActive();
        fetchData();
        populateWineRoomOptions();

    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (id) => <Text>{id}</Text>
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            align: 'center',
            ellipsis: true,
            render: (purpose) => <Text>{purpose}</Text>
        },
        {
            title: 'Check Request ID',
            dataIndex: 'checkRequestId',
            key: 'checkRequestId',
            align: 'center',
            render: (checkRequestId) => <Text>{checkRequestId}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={status === "DISABLED" ? 'red' : 'green'}>
                    {status || 'Unknown'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button
                        onClick={() => handleDelete(record.id)}
                    >
                        <DeleteOutlined />
                    </Button>
                    <Button
                        onClick={() => handleViewDetails(record.id)}
                    >
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];

    //#endregion

    //#region handle delete
    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Disable Check Request',
            content: <p>Are you sure you want to disable this check request?</p>,
            onOk: async () => {
                try {
                    await disableCheckRequestDetailAPI(id);
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
            //set some more fields here
            console.log(formData);
            // formData.checkRequestCode = reqCode;
            // formData.checkRequestId = requestId;
            await createAddCheckRequestAPI(formData);
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
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 5 }}
                />
            )}

            <Modal
                title="Create Additional Check Request Detail"
                visible={isModalVisible}
                onOk={handleCreateAdditional}
                onCancel={hideModal}
                okText="Create"
            >
                <label>Purpose</label>
                <Input
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
                <Input
                    placeholder="Comments"
                    value={formData.comments}
                    onChange={(e) => handleInputChangeFormAdditional('comments', e.target.value)}
                    style={{ marginBottom: 10, width: '100%', height: '60px' }} // Bigger input field
                />
                <label>Select Wine Room</label>
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
                <label>Select Checker</label>
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
        </div>
    );
};
