import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, Button, Space, Descriptions, Divider, notification, Modal, Input, Form, Spin } from 'antd';
import { createCRReport, disableCheckRequestDetailAPI, fetchDetailOfCRDetail } from '~/services/api-service/CR-FLOW/CheckRequestDetailApiService';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AuthContext } from '~/components/auth-context';

const { Title, Text } = Typography;


export const ViewDetailCRDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reportFields, setReportFields] = useState({ ReportDescription: '', DiscrepanciesFound: 0, ActualQuantity: 0 });
    const { userLogin } = useContext(AuthContext);
    const [isEditMode, setIsEditMode] = useState(false);

    //#region init page
    // Fetch data from the API
    useEffect(() => {
        fetchDetailOfCheckRequestDetail();
    }, [id]);

    const fetchDetailOfCheckRequestDetail = async () => {
        try {
            const response = await fetchDetailOfCRDetail(id, authToken);
            if (response.data) {
                setData(response.data);
                notification.success({
                    message: "Data loaded successfully",
                });
            } else {
                notification.warning({
                    message: "Something went wrong",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error loading data",
                description: error.message
            });
        }
    };
    //#endregion
    //#region handleDisable
    //confirmation

    const handleDisable = () => {
        Modal.confirm({
            title: 'Disable Check Request',
            content: <p>Are you sure you want to disable this check request? ID: {id}</p>,
            onOk: async () => {
                try {
                    const response = await disableCheckRequestDetailAPI(id, authToken);
                    if (response.data) {
                        notification.success({
                            message: 'Disable Successful',
                            description: 'The check request has been disabled.',
                        });
                    }

                    fetchDetailOfCRDetail();
                } catch (error) {
                    notification.error({
                        message: 'Disable Failed',
                        description: error.message,
                    });
                }
            }
        });
    };

    //#endregion


    // Handle back to the list
    const handleBack = () => {
        navigate(`/app/check-request-details`);
    };
    if (!data) return <Spin size="large" style={styles.spinner} />


    // Check if reportCode is valid (not empty, null, or whitespace)
    const showReportFields = data.reportCode && data.reportCode.trim() !== "";
    const handleUpdateReport = () => {
        setIsEditMode(true);
        setIsModalVisible(true);
        setReportFields({
            ReportDescription: data.reportDescription || '', DiscrepanciesFound: data.discrepanciesFound || 0, ActualQuantity: data.actualQuantity || 0
        });
    };

    //#region edit sub check request detail
    const handleEdit = () => {
        notification.info(
            {
                message: "PENDING",
                description: "Feature implemented later"
            }
        )
    }
    //#endregion
    //#region edit report
    const handleEditReport = async () => {
        try {
            console.log(reportFields);
            const response = await createCRReport(id, reportFields, authToken);
            if (response.data) {
                notification.success({
                    message: "Report Updated Successfully",
                });
                setIsModalVisible(false);
                fetchDetailOfCheckRequestDetail();
            }
        } catch (error) {
            notification.error({
                message: "Error Updating Report",
                description: error.message
            });
        } finally {
            //fetching again + clear form
            fetchDetailOfCheckRequestDetail();
            setReportFields({ ReportDescription: '', DiscrepanciesFound: 0, ActualQuantity: 0 });
            setIsEditMode(false);
            setIsModalVisible(false);

        }
    }
    //#endregion

    const handleCreateReport = async () => {
        try {
            const response = await createCRReport(id, reportFields, authToken);
            if (response.data) {
                notification.success({
                    message: "Report Created Successfully",
                });
                setIsModalVisible(false);
                fetchDetailOfCheckRequestDetail();
            }
        } catch (error) {
            notification.error({
                message: "Error Creating Report",
                description: error.message
            });
        } finally {
            //fetching again + clear form
            fetchDetailOfCheckRequestDetail();
            setReportFields({ ReportDescription: '', DiscrepanciesFound: 0, ActualQuantity: 0 });
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>

            <Card bordered={false} style={{ maxWidth: '80vw', margin: '0 auto', borderRadius: '8px' }}>
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Check Request Details</Title>

                <Descriptions column={1} bordered size="middle" labelStyle={{ width: '22%' }} contentStyle={{ width: '78%' }}>
                    <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
                    <Descriptions.Item label="Purpose">{data.purpose}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{new Date(data.startDate).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Due Date">{new Date(data.dueDate).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Checker ID">{data.checkerId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Wine Room ID">{data.wineRoomId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Checker Name">{data.checkerName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Comments">{data.comments || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Check Request ID">{data.checkRequestId}</Descriptions.Item>
                    <Descriptions.Item label="Check Request Code">{data.checkRequestCode || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Requester ID">{data.requesterId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Requester Name">{data.requesterName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Wine ID">{data.wineId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Wine Name">{data.wineName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Manufacture Date">{data.mfd ? new Date(data.mfd).toLocaleDateString() : "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Room ID">{data.roomId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Room Name">{data.roomName || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Room Capacity">{data.roomCapacity || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Expected Current Quantity">{data.expectedCurrQuantity || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Status">{data.status || "N/A"}</Descriptions.Item>
                </Descriptions>
                {userLogin.role === 'MANAGER' && (
                    <div>
                        <Button onClick={handleDisable} type="danger" icon={<DeleteOutlined />} style={{ margin: '10px', backgroundColor: 'red', color: 'white' }}>
                            Disable
                        </Button>
                        <Button onClick={handleEdit} type="primary" icon={<EditOutlined />} style={{ margin: '10px' }}>
                            EDIT
                        </Button>
                    </div>
                )}


                {showReportFields ? (
                    <>
                        <Divider>Report Details</Divider>
                        <Descriptions
                            column={1}
                            bordered
                            size="middle"
                            labelStyle={{ width: '22%' }}
                            contentStyle={{ width: '78%' }}
                        >
                            <Descriptions.Item label="Report Code">{data.reportCode}</Descriptions.Item>
                            <Descriptions.Item label="Report Description">
                                {data.reportDescription || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Reporter Assigned">
                                {data.reporterAssigned || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Discrepancies Found">
                                {data.discrepanciesFound || "None"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Actual Quantity">
                                {data.actualQuantity || "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                        <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button type="primary" size="large" onClick={handleUpdateReport}>
                                Update Report
                            </Button>
                        </Space>
                    </>
                ) : (
                    <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}>
                            Create a Report
                        </Button>
                    </Space>
                )}
            </Card>
            <Modal
                title={isEditMode ? "Update Report" : "Create Report"}
                open={isModalVisible}
                onOk={isEditMode ? handleEditReport : handleCreateReport}
                onCancel={() => {
                    setReportFields({
                        ReportDescription: '',
                        DiscrepanciesFound: 0,
                        ActualQuantity: 0
                    });
                    setIsModalVisible(false);
                    setIsEditMode(false);
                }}
                okText={isEditMode ? "Update" : "Submit"}
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Report Description">
                        <Input.TextArea
                            rows={4}
                            value={reportFields.ReportDescription}
                            onChange={(e) =>
                                setReportFields({ ...reportFields, ReportDescription: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Discrepancies Found">
                        <Input
                            type="number"
                            value={reportFields.DiscrepanciesFound}
                            onChange={(e) =>
                                setReportFields({
                                    ...reportFields,
                                    DiscrepanciesFound: Number(e.target.value)
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Actual Quantity">
                        <Input
                            type="number"
                            value={reportFields.ActualQuantity}
                            onChange={(e) =>
                                setReportFields({
                                    ...reportFields,
                                    ActualQuantity: Number(e.target.value)
                                })
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>


        </div>
    );
};

export default ViewDetailCRDetailPage;



//#region Inline styles
const styles = {

    spinner: {
        display: 'block',
        margin: '0 auto',
    },
};

//#endregion
