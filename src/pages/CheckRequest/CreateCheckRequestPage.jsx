import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, DatePicker, Select, notification, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchAllActiveWineRoomNameAPI } from '~/services/api-service/WineRoomeApiService';
import { createCheckRequestAPI } from '~/services/api-service/CR-FLOW/CheckRequestApiService';
import { fetchAllStaffAPI } from '~/services/api-service/UserApiService';
import { AuthContext } from '~/components/auth-context';

const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
];

export const CreateCheckRequestPage = () => {
    const [form] = Form.useForm();
    const [staffOptions, setStaffOptions] = useState([]);
    const [wineRoomOptions, setWineRoomOptions] = useState([]);
    const { userLogin, setUserLogin } = useContext(AuthContext);
    const token = window?.localStorage?.getItem("access_token");
    const authToken = `Bearer ${token}`;

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllStaffActive();
        populateWineRoomOptions();
    }, []);

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


    const handleSubmit = async () => {
        const formValues = form.getFieldsValue();

        const payload = {
            purpose: formValues.purpose,
            startDate: formValues.startDate ? formValues.startDate.toISOString() : null,
            dueDate: formValues.endDate ? formValues.endDate.toISOString() : null,
            comments: formValues.comments,
            priorityLevel: formValues.priorityLevel,
            requesterId: userLogin.id,
            requesterName: userLogin.username,
            createCheckRequestDetailRequests: formValues.details
                .map(detail => ({
                    purpose: detail.purpose,
                    startDate: detail.startDate ? detail.startDate.toISOString() : null,
                    dueDate: detail.dueDate ? detail.dueDate.toISOString() : null,
                    comments: detail.comments,
                    checkerId: detail.checker,
                    wineRoomId: detail.wineRoom,
                }))
                .filter(detail => detail.purpose || detail.startDate || detail.dueDate),
        };
        console.log(payload);

        try {
            const response = await createCheckRequestAPI(payload);
            if (response.status === 200) {
                notification.success({ message: 'Check Request Created Successfully' });
                navigate('/app/check-requests');
            } else {
                notification.warning({ message: 'Action needed' });
            }
        } catch (error) {
            notification.error({ message: 'Error', description: error.message });
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
            <Button onClick={handleBack} style={{ borderRadius: '4px', marginRight: 'auto' }}>Back to List</Button>
            <Divider />
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                {/* Form fields for main request info */}
                <Form.Item name="comments" label="Main Request Comments" rules={[{ required: true, message: 'Comments are required' }]}>
                    <Input placeholder="Enter comments" style={{ borderRadius: '4px', borderColor: '#d9d9d9' }} />
                </Form.Item>
                <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
                    <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                </Form.Item>
                <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'End date is required' }]}>
                    <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                </Form.Item>
                <Form.Item name="purpose" label="Purpose" rules={[{ required: true, message: 'Purpose is required' }]}>
                    <Input placeholder="Enter purpose" style={{ borderRadius: '4px', borderColor: '#d9d9d9' }} />
                </Form.Item>
                <Form.Item name="priorityLevel" label="Priority Level" rules={[{ required: true, message: 'Please select priority level' }]}>
                    <Select options={priorityOptions} placeholder="Select Priority" style={{ borderRadius: '4px' }} />
                </Form.Item>
                <Divider orientation="left">Details</Divider>
                <Form.List name="details" initialValue={[{ purpose: '', startDate: null, dueDate: null, comments: '', checker: '', wineRoom: '' }]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                                <div key={field.key} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #e6e6e6', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                    {/* Detail fields */}
                                    <Form.Item {...field} name={[field.name, 'purpose']} label="Detail Purpose" rules={[{ required: true, message: 'Purpose is required' }]}>
                                        <Input placeholder="Detail Purpose" style={{ borderRadius: '4px' }} />
                                    </Form.Item>
                                    <Form.Item {...field} name={[field.name, 'startDate']} label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
                                        <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item {...field} name={[field.name, 'dueDate']} label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}>
                                        <DatePicker style={{ borderRadius: '4px', width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item {...field} name={[field.name, 'comments']} label="Comments">
                                        <Input placeholder="Comments" style={{ borderRadius: '4px' }} />
                                    </Form.Item>
                                    <Form.Item {...field} name={[field.name, 'checker']} label="Checker/Staff" rules={[{ required: true, message: 'Checker is required' }]}>
                                        <Select options={staffOptions} placeholder="Select Checker" style={{ borderRadius: '4px' }} />
                                    </Form.Item>
                                    <Form.Item {...field} name={[field.name, 'wineRoom']} label="Wine Room" rules={[{ required: true, message: 'Wine room is required' }]}>
                                        <Select options={wineRoomOptions} placeholder="Select Wine Room" style={{ borderRadius: '4px' }} />
                                    </Form.Item>
                                    {fields.length > 1 && (
                                        <Button type="link" onClick={() => remove(field.name)} style={{ color: 'red' }}>Remove</Button>
                                    )}
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={add} style={{ width: '100%', borderRadius: '4px', backgroundColor: '#e6f7ff', color: '#1890ff' }}>Add Detail</Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px', borderRadius: '4px' }}>Submit</Button>
                    <Button onClick={handleReset} style={{ marginRight: '10px', borderRadius: '4px' }}>Reset</Button>
                </Form.Item>
            </Form>
        </div>
    );
};
