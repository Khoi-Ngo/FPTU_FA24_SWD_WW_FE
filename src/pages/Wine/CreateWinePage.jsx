import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload, Row, Col, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createWineAPI, fetchAllWineAPI } from '../../services/api-service/WineApiService';

const { Dragger } = Upload;


export const CreateWinePage = () => {
    const [form] = Form.useForm();
    const [wineCategories, setWineCategories] = useState([]);
    const navigate = useNavigate();

    //#region  fetch wine categories
    useEffect(() => {
        fethcWineCategories();
    }, []);
    const fethcWineCategories = async () => {
        try {
            const response = await fetchAllWineAPI();
            if (response.data) {
                setWineCategories(response.data);
                notification.success(
                    {
                        message: "Load cate ok"
                    }
                )
            } else {
                notification.warning({
                    message: "Check cate list again"
                })
                setWineCategories([]);
            }

        } catch (error) {
            notification.error(
                {
                    message: "Load cate fail",
                }
            )
            navigate("/app/wines");
        }
    }

    //#endregion




    //#region create wine


    //#region FORM HANDLE
    const onFinish = async (values) => {
        handleCreateWine(values);
        form.resetFields();
    }

    const uploadImage = async () => {
        //TODO: implement later

    }

    //#endregion

    //#region API
    const handleCreateWine = async (createWineRequestDTO) => {
        try {
          const response =   await createWineAPI(createWineRequestDTO);
            if(response.data && response.status === 200){
                notification.success({
                    message: "Create oke"
                })
            }else{
                notification.warning(
                    {
                        message: "Need check action"
                    }
                )
            }

        } catch (error) {
            notification.error(
                { message : "Fail create"}
            )
        }
    }

    //#endregion


    //#endregion


    //Redirect to the wine list page
    const handleBackToList = () => {
        notification.info({
            message: "Back to the wine list"
        })
        form.resetFields();
        navigate('/app/wines');
    };
    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Wine</h2>
            <Button type="default" onClick={handleBackToList} style={{ width: '25%', height: '40px', backgroundColor: 'white' }}>
                Back to list of wine
            </Button>
            <Form form={form} name="create_wine" onFinish={values => onFinish(values)} layout="vertical" style={{ width: '100%' }}>
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
                            <Dragger {...uploadImage}>
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
