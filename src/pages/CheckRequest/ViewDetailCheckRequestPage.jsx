import React, { useEffect, useState } from 'react';
import { Card, Table, Descriptions, Spin, notification, Button, Modal, Input, Select, DatePicker, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, EditFilled, SaveOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    fetchViewDetailCheckRequestAPI,
    updateCheckRequestAPI,
    disableCheckRequestAPI
} from '~/services/api-service/CR-FLOW/CheckRequestApiService';
import { fetchAllActiveWineRoomNameAPI } from '~/services/api-service/WineRoomeApiService';
import { fetchAllStaffAPI } from '~/services/api-service/UserApiService';
import { createAddCheckRequestAPI, disableCheckRequestDetailAPI } from '~/services/api-service/CR-FLOW/CheckRequestDetailApiService';

const { Option } = Select;
const formatValue = (value) => (value  ? value : 'N/A');

const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
];
const getStatusTagColor = (status) => {
    switch (status) {
        case 'COMPLETED':
            return 'green';
        case 'DISABLED':
            return 'red';
        case 'ACTIVE':
            return 'blue';
        default:
            return 'gray'; // Default color for unexpected status values
    }
};

const ViewDetailCheckRequestPage = () => {

    //#region handle create additional check request detail
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
        comments: '',
        wineRoomId: null,
        checkerId: null,
    };
    const [reqCode, setReqCode] = useState(null);

    const [staffOptions, setStaffOptions] = useState([]);
    const [wineRoomOptions, setWineRoomOptions] = useState([]);




    // Handle form input changes
    const handleInputChangeFormAdditional = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Show/Hide Modal
    const showModal = () => setIsModalVisible(true);
    const hideModal = () => {
        setIsModalVisible(false);
        setFormData(initialFormData);
    };


    // Submit form data to create additional request
    const handleSaveCreateAdditional = async () => {
        try {
            formData.checkRequestId = requestId;
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
            fetchDetails();
            setFormData(initialFormData);
        }
    }

    //#endregion

    //#region handle disable check request detail direct in the detail
    const handleDeleteSubCR = async (id) => {
        Modal.confirm({
            title: `Disable Check Request Detail ID : ${id}`,
            content: <p>Are you sure you want to disable this check request detail ?</p>,
            onOk: async () => {
                try {
                    await disableCheckRequestDetailAPI(id, authToken);
                } catch (error) {
                    notification.error({
                        message: 'Disable Failed',
                        description: 'Could not disable check request detail.',
                    });
                } finally {
                    fetchDetails();
                }
            }
        });
    }
    //#endregion

    //#region view detail CR detail
    const handleViewDetailCRDetail = async (id) => {
        //redirect to the detail page
        navigate(`/app/check-request-details/${id}`);
    }
    //#endregion

    //#region init + load data
    const { requestId } = useParams();
    const [checkRequestDetails, setCheckRequestDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newData, setNewData] = useState({});
    const [comments, setComments] = useState('');
    const navigate = useNavigate();
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;

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
            const response = await fetchAllActiveWineRoomNameAPI(authToken);
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


    const fetchDetails = async () => {
        try {
            const response = await fetchViewDetailCheckRequestAPI(requestId, authToken);
            setCheckRequestDetails(response.data);
            setNewData(response.data); // Initialize newData with current data
            setReqCode(response.data.requestCode);
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
        fetchAllStaffActive();
        populateWineRoomOptions();
    }, [requestId]);

    if (isLoading) {
        return <Spin size="large" style={styles.spinner} />;
    }

    const { id, purpose, requestCode, startDate, dueDate, priorityLevel, requesterId, requesterName, status, checkRequestDetails: details } = newData;

    const detailColumns = [
        { title: 'Detail ID', dataIndex: 'id', key: 'id', align: 'center', render: (text) => formatValue(text) },
        { title: 'Purpose', dataIndex: 'purpose', key: 'purpose', align: 'center', render: (text) => formatValue(text) },
        { title: 'Check Request ID', dataIndex: 'checkRequestId', key: 'checkRequestId', align: 'center', render: (text) => formatValue(text) },
        { title: 'Wine ID', dataIndex: 'wineId', key: 'wineId', align: 'center', render: (text) => formatValue(text) },
        { title: 'Wine Name', dataIndex: 'wineName', key: 'wineName', align: 'center', render: (text) => formatValue(text) },
        { title: 'MFD', dataIndex: 'mfd', key: 'mfd', align: 'center', render: (date) => (date ? new Date(date).toLocaleDateString() : '-') },
        { title: 'Room ID', dataIndex: 'roomId', key: 'roomId', align: 'center', render: (text) => formatValue(text) },
        {
            title: 'Room Name',
            dataIndex: 'roomName',
            key: 'roomName',
            align: 'center',
            render: (roomName) => (
                <Tag color="purple">{formatValue(roomName)}</Tag> // Default purple color
            ),
        },
        { title: 'Checker ID', dataIndex: 'checkerId', key: 'checkerId', align: 'center', render: (text) => formatValue(text) },
        {
            title: 'Checker Name',
            dataIndex: 'checkerName',
            key: 'checkerName',
            align: 'center',
            render: (checkerName) => (
                <Tag color="blue">{formatValue(checkerName)}</Tag> // Default blue color
            ),
        },
        { title: 'Wine Room ID', dataIndex: 'wineRoomId', key: 'wineRoomId', align: 'center', render: (text) => formatValue(text) },
        { title: 'Expected Current Quantity', dataIndex: 'expectedCurrQuantity', key: 'expectedCurrQuantity', align: 'center', render: (text) => formatValue(text) },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={getStatusTagColor(status)}>
                    {formatValue(status)}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button
                        style={styles.deleteButton}
                        onClick={() => handleDeleteSubCR(record.id)}
                    >
                        <DeleteOutlined />
                    </Button>
                    <Button
                        style={styles.viewButton}
                        onClick={() => handleViewDetailCRDetail(record.id)}
                    >
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];
    //#endregion

    //#region edit
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
            await updateCheckRequestAPI(
                {
                    Id: requestId,
                    comments: newData.comments,
                    purpose: newData.purpose,
                    priorityLevel: newData.priorityLevel
                }, authToken
            );
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
    //#endregion

    //#region disable
    const handleDisable = () => {
        Modal.confirm({
            title: 'Disable Check Request',
            content: <p>Are you sure you want to disable this check request?</p>,
            onOk: async () => {
                try {
                    await disableCheckRequestAPI(requestId, authToken);
                    notification.success({
                        message: 'Disable Successful',
                        description: 'The check request has been disabled.',
                    });
                    fetchDetails();
                } catch (error) {
                    notification.error({
                        message: 'Disable Failed',
                        description: 'Could not disable check request.',
                    });
                }
            }
        });
    };
    //#endregion

    //#region Handle create additional check request details

    //#endregion



    // Handle back to the list
    const handleBack = () => {
        navigate(`/app/check-requests`);
    };
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
                    <Descriptions.Item label="REQUEST ID">{id}</Descriptions.Item>
                    <Descriptions.Item label="CODE">{requestCode}</Descriptions.Item>
                    <Descriptions.Item label="PURPOSE">
                        {isEditing ? (
                            <Input name="purpose" value={newData.purpose} onChange={handleInputChange} />
                        ) : (
                            purpose
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="START DATE">{startDate}</Descriptions.Item>

                    <Descriptions.Item label="DUE DATE">{dueDate}</Descriptions.Item>
                    <Descriptions.Item label="PRIORITY LEVEL">
                        {isEditing ? (
                            <Select value={newData.priorityLevel} onChange={handleSelectChange} style={{ width: '100%' }}>
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
                    <Descriptions.Item label="REQUESTER ID">{requesterId}</Descriptions.Item>
                    <Descriptions.Item label="REQUESTER NAME">{requesterName}</Descriptions.Item>
                    <Descriptions.Item label="STATUS">{status}</Descriptions.Item>
                    <Descriptions.Item label="COMMENTS">
                        {isEditing ? (
                            <Input name="comments" value={newData.comments || ''} onChange={handleInputChange} />
                        ) : (
                            (newData.comments && newData.comments.length > 0) ? newData.comments : '-'
                        )}
                    </Descriptions.Item>
                </Descriptions>
                <div style={styles.buttonGroup}>
                    <Button onClick={isEditing ? handleSave : handleEdit} type="primary" icon={isEditing ? <SaveOutlined /> : <EditFilled />} style={styles.actionButton}>
                        {isEditing ? 'Save' : 'Edit'}
                    </Button>
                    {isEditing && (
                        <Button onClick={handleCancelEdit} type="default" icon={<CloseOutlined />} style={styles.actionButton}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={handleDisable} type="danger" icon={<DeleteOutlined />} style={styles.actionButton}>
                        Disable
                    </Button>
                </div>
            </Card>
            <Card style={styles.tableCard}>
                <h2 style={styles.sectionHeader}>Check Request Detailed Items</h2>
                <Button
                    type="primary"
                    onClick={showModal}
                    style={styles.backButton}
                >
                    Create Additional
                </Button>
                <Table
                    dataSource={details}
                    columns={detailColumns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    style={styles.table}
                />
            </Card>

            <Modal
                title="Create Additional Check Request Detail"
                open={isModalVisible}
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

const styles = {
    pageContainer: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        marginBottom: '20px',
    },
    pageHeader: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
    },
    infoCard: {
        marginBottom: '20px',
    },
    sectionHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    labelStyle: {
        fontWeight: 'bold',
    },
    contentStyle: {
        paddingLeft: '15px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
    },
    actionButton: {
        width: '100px',
    },
    tableCard: {
        marginTop: '20px',
    },
    table: {
        marginTop: '10px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    }
};

export default ViewDetailCheckRequestPage;
