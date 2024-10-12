import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, Row, Col, notification, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';

//TODO: replace curr image handling

const mockWineCategories = [
    { id: 1, categoryName: 'Red Wine', wineType: 'Cabernet Sauvignon' },
    { id: 2, categoryName: 'White Wine', wineType: 'Chardonnay' },
    { id: 3, categoryName: 'Rose Wine', wineType: 'Zinfandel' },
];

const mockWine = {
    Id: 1,
    WineName: 'Mock Red Wine',
    AlcoholContent: 13.5,
    BottleSize: '750ml',
    AvailableStock: 150,
    Description: 'A fine red wine for testing purposes.',
    Supplier: 'Mock Supplier',
    MFD: '2022-09-15',
    Status: 'Available',
    WineCategoryId: 1,
    ImageUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
};

const UpdateWinePage = () => {
    const [form] = Form.useForm();
    const [wine, setWine] = useState(null);
    const [wineCategories, setWineCategories] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null); // State for uploaded image
    const { wineId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWine = async () => {
            try {
                // Simulate a failed API call
                throw new Error('API request failed');
            } catch (error) {
                console.error('Failed to fetch wine:', error);
                setWine(mockWine);  // Set mock data in case of failure
                notification.warning({
                    message: 'Using mock data',
                    description: 'Failed to fetch data from API, displaying mock data instead.',
                });
            }
        };

        fetchWine();
        setWineCategories(mockWineCategories);
    }, [wineId]);

    useEffect(() => {
        if (wine) {
            // Set form fields when wine data is available
            form.setFieldsValue({
                ...wine,
                mfd: moment(wine.MFD),
            });
        }
    }, [wine, form]);

    const onFinish = (values) => {
        try {
            notification.success({
                message: 'Wine updated successfully',
            });
            navigate('/app/wines');  // Redirect to wine list
        } catch (err) {
            notification.error({
                message: err.message,
            });
            console.error('Error updating wine:', err);
        }
    };

    const handleBackToList = () => {
        navigate('/app/wines');
    };

    const handleReset = () => {
        window.location.reload(); // Reload the page to reset the form
    };

    const uploadProps = {
        name: 'file',
        accept: 'image/png, image/jpeg',  // Accept only PNG and JPEG files
        maxCount: 1,  // Limit to a single upload
        beforeUpload: (file) => {
            return false;  // Prevent automatic upload
        },
        onChange: (info) => {
            if (info.file.status === 'done' || info.file.status === 'uploading') {
                const url = URL.createObjectURL(info.file.originFileObj);
                setUploadedImage(url);
                console.log('Temporary image URL:', url); // Debugging: log the temporary URL
            } else if (info.file.status === 'removed') {
                setUploadedImage(null);  // Clear uploaded image when removed
            }
        },
    };

    if (!wine) return null; // Ensure wine data is loaded before rendering

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Update Wine</h2>
            <Button type="default" onClick={handleBackToList} style={{ marginBottom: '20px' }}>
                Back to Wine List
            </Button>
            <Form form={form} name="update_wine" onFinish={onFinish} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item name="WineName" label="Wine Name" rules={[{ required: true, message: 'Please input the wine name!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="AlcoholContent" label="Alcohol Content" rules={[{ type: 'number', message: 'Please input a valid number!' }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="BottleSize" label="Bottle Size">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="AvailableStock" label="Available Stock" rules={[{ type: 'number', message: 'Please input a valid number!' }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="Supplier" label="Supplier" rules={[{ required: true, message: 'Please input the supplier!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="mfd" label="Manufacture Date" rules={[{ required: true, message: 'Please select the manufacture date!' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="WineCategoryId" label="Wine Category" rules={[{ required: true, message: 'Please select a wine category!' }]}>
                            <Select>
                                {wineCategories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.categoryName} ({category.wineType})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="Description" label="Description">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="Status" label="Status">
                            <Select>
                                <Select.Option value="Available">Available</Select.Option>
                                <Select.Option value="Unavailable">Unavailable</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Display current image or uploaded image */}
                        <Form.Item style={{ marginBottom: '10px' }}>
                            <Image
                                width={200}
                                src={uploadedImage || wine.ImageUrl} // Use uploadedImage first
                                alt="Wine Image"
                                style={{ borderRadius: '8px' }}
                            />
                        </Form.Item>
                        {/* Upload new image */}
                        <Form.Item name="ImageUrl" label="Upload New Image" style={{ marginBottom: '10px' }}>
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Click to Upload New Image</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="default" onClick={handleReset} style={{ width: '40%' }}>
                        Reset
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ width: '40%', marginLeft: '20%' }}>
                        Update Wine
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateWinePage;
