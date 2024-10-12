import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload, Row, Col, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Dragger } = Upload;

const mockWineCategories = [
    { id: 1, categoryName: 'Red Wine', wineType: 'Cabernet Sauvignon' },
    { id: 2, categoryName: 'White Wine', wineType: 'Chardonnay' },
    { id: 3, categoryName: 'Rose Wine', wineType: 'Zinfandel' },
];

export const CreateWinePage = () => {
    const [form] = Form.useForm();
    const [wineCategories, setWineCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setWineCategories(mockWineCategories);
    }, []);

    const onFinish = (values) => {
        try {
            console.log('Wine created successfully:', values);
            notification.success({
                message: "Wine created successfully"
            })
            form.resetFields();
        } catch (err) {
            notification.error({
                message: err.message
            })
            console.error('Error creating wine:', err);
        }
    };

    const handleBackToList = () => {
        notification.info({
            message: "Back to the wine list"
        })
        form.resetFields();
        navigate('/app/wines');
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: 'image/*',
        beforeUpload: (file) => {
            console.log('File upload:', file);
            return false;
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Wine</h2>
            <Button type="default" onClick={handleBackToList} style={{ width: '25%', height: '40px', backgroundColor: 'white' }}>
                Back to list of wine
            </Button>
            <Form form={form} name="create_wine" onFinish={onFinish} layout="vertical" style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="wineName"
                            label="Wine Name"
                            rules={[{ required: true, message: 'Please input the wine name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="alcoholContent"
                            label="Alcohol Content"
                            rules={[{ type: 'number', message: 'Please input a valid number!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="bottleSize"
                            label="Bottle Size"
                            rules={[{ message: 'Please input the bottle size!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ message: 'Please input a description!' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="supplier"
                            label="Supplier"
                            rules={[{ required: true, message: 'Please input the supplier!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="mfd"
                            label="Manufacture Date"
                            rules={[{ required: true, message: 'Please select the manufacture date!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="wineCategoryId"
                            label="Wine Category"
                            rules={[{ required: true, message: 'Please select a wine category!' }]}
                        >
                            <Select>
                                {wineCategories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.categoryName} - {category.wineType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            name="imageUrl"
                            label="Image"
                            rules={[{ required: true, message: 'Please upload an image!' }]}
                        >
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Dragger>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%', height: '40px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
                        Create Wine
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateWinePage;
