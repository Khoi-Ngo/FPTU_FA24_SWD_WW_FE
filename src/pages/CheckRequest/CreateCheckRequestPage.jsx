import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, notification, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchAllStaffAPI } from '~/services/api-service/UserApiService';
import { createCheckRequestAPI } from '~/services/api-service/CheckRequestApiService';

// Mock wine room data
const mockWineRooms = [
    { wineroomId: 1, wineId: 1, wineName: 'WineA', roomId: 1, roomName: 'RoomA' },
    { wineroomId: 2, wineId: 2, wineName: 'WineB', roomId: 2, roomName: 'RoomB' },
    { wineroomId: 3, wineId: 3, wineName: 'WineC', roomId: 3, roomName: 'RoomC' }
];

// Mock priority levels
const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
];

export const CreateCheckRequestPage = () => {
    const [form] = Form.useForm();
    const [staffOptions, setStaffOptions] = useState([]);
    const [wineRoomOptions, setWineRoomOptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllStaffActive();
        populateWineRoomOptions();
    }, []);

    const fetchAllStaffActive = async () => {
        try {
            const response = await fetchAllStaffAPI();
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

    const populateWineRoomOptions = () => {
        const wineRooms = mockWineRooms.map(room => ({
            label: `${room.wineName} - ${room.roomName}`,
            value: room.wineroomId,
        }));
        setWineRoomOptions(wineRooms);
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            createCheckRequestDetailRequests: values.details.map((detail) => ({
                purpose: detail.purpose,
                startDate: detail.startDate,
                dueDate: detail.dueDate,
                comments: detail.comments,
                checkerId: detail.checker,
                wineRoomId: detail.wineRoom,
            })),
        };

        try {
            const response = await createCheckRequestAPI(payload);
            if (response.data && response.status === 200) {
                notification.success(
                    {
                        message: "Create oke"
                    }
                );
                navigate('/app/check-requests');
            } else {
                notification.warning(
                    {
                        message: "Need check action"
                    }
                )
            }

        } catch (error) {
            notification.error(
                {
                    message: "Error",
                    description: error.message
                }
            )
        }
    };

    const handleReset = () => {
        form.resetFields();
    };

    const handleBack = () => {
        navigate('/app/check-requests');
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Create Check Request</h2>
            <Button onClick={handleBack} style={{ borderRadius: '4px', marginRight: 'auto' }}>
                Back to List
            </Button>
            <Divider />
            <Form form={form} onFinish={handleSubmit} layout="vertical">

                <Form.Item
                    name="comments"
                    label="Main Request Comments"
                    rules={[{ required: true, message: 'Comments are required' }]}
                >
                    <Input placeholder="Enter comments" style={{ borderRadius: '4px', borderColor: '#d9d9d9' }} />
                </Form.Item>

                <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[{ required: true, message: 'Start date is required' }]}
                >
                    <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[{ required: true, message: 'End date is required' }]}
                >
                    <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="purpose"
                    label="Purpose"
                    rules={[{ required: true, message: 'Purpose is required' }]}
                >
                    <Input placeholder="Enter purpose" style={{ borderRadius: '4px', borderColor: '#d9d9d9' }} />
                </Form.Item>

                <Form.Item
                    name="priorityLevel"
                    label="Priority Level"
                    rules={[{ required: true, message: 'Please select priority level' }]}
                >
                    <Select options={priorityOptions} placeholder="Select Priority" style={{ borderRadius: '4px' }} />
                </Form.Item>

                <Divider orientation="left">Details</Divider>
                <Form.List name="details" initialValue={[{ purpose: '', startDate: null, dueDate: null, comments: '', checker: '', wineRoom: '' }]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <div key={field.key} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #e6e6e6', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'purpose']}
                                        fieldKey={[field.fieldKey, 'purpose']}
                                        label="Detail Purpose"
                                        rules={[{ required: true, message: 'Purpose is required' }]}
                                    >
                                        <Input placeholder="Detail Purpose" style={{ borderRadius: '4px' }} />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'startDate']}
                                        fieldKey={[field.fieldKey, 'startDate']}
                                        label="Start Date"
                                        rules={[{ required: true, message: 'Start date is required' }]}
                                    >
                                        <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'dueDate']}
                                        fieldKey={[field.fieldKey, 'dueDate']}
                                        label="Due Date"
                                        rules={[{ required: true, message: 'Due date is required' }]}
                                    >
                                        <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'comments']}
                                        fieldKey={[field.fieldKey, 'comments']}
                                        label="Comments"
                                    >
                                        <Input placeholder="Comments" style={{ borderRadius: '4px' }} />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'checker']}
                                        fieldKey={[field.fieldKey, 'checker']}
                                        label="Checker/Staff"
                                        rules={[{ required: true, message: 'Checker is required' }]}
                                    >
                                        <Select options={staffOptions} placeholder="Select Checker" style={{ borderRadius: '4px' }} />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'wineRoom']}
                                        fieldKey={[field.fieldKey, 'wineRoom']}
                                        label="Wine Room"
                                        rules={[{ required: true, message: 'Wine room is required' }]}
                                    >
                                        <Select options={wineRoomOptions} placeholder="Select Wine Room" style={{ borderRadius: '4px' }} />
                                    </Form.Item>

                                    {fields.length > 1 && (
                                        <Button type="link" onClick={() => remove(field.name)} style={{ color: 'red' }}>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={add} style={{ width: '100%', borderRadius: '4px', backgroundColor: '#e6f7ff', color: '#1890ff' }}>
                                    Add Detail
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px', borderRadius: '4px' }}>
                        Submit
                    </Button>
                    <Button onClick={handleReset} style={{ marginRight: '10px', borderRadius: '4px' }}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
