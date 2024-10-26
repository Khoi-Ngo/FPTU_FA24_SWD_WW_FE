import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload, Row, Col, notification } from 'antd';
import { ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createWineAPI, fetchAlcoholVolumeAPI, fetchBottleSizesAPI, fetchBrandsAPI, fetchClassesAPI, fetchCorksAPI, fetchCountriesAPI, fetchQualificationsAPI, fetchTastesAPI, fetchWineCategoriesAPI, uploadImageWineAPI } from '../../services/api-service/WineApiService';

const { Dragger } = Upload;


export const CreateWinePage = () => {
    const [form] = Form.useForm();
    const [wineCategories, setWineCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [AlcoholVolume, setAlcoholVolume] = useState([]);
    const [BottleSizes, setBottleSizes] = useState([]);
    const [Classes, setClasses] = useState([]);
    const [Brands, setBrands] = useState([]);
    const [Corks, setCorks] = useState([]);
    const [Qualifications, setQualifications] = useState([]);
    const [Tastes, setTastes] = useState([]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWineCategories()
        fetchContries()
        fetchAlcoholVolume()
        fetchBottleSizes()
        fetchClasses()
        fetchBrands()
        fetchCorks()
        fetchQualifications()
        fetchTastes()
    }, []);




    //#region create wine


    //#region FORM HANDLE
    const onFinish = async (values) => {
        handleCreateWine(values);
        form.resetFields();
        navigate('/app/wines');
    }

    const uploadImageWine = async (payload) => {
        const response = await uploadImageWineAPI(payload)
        setUploadedImage(response.downloadUrl)
        console.log('uploadImageWineAPI has run')
    }

    //#endregion

    //#region API
    const handleCreateWine = async (createWineRequestDTO) => {
        try {
            const payload = {
                ...createWineRequestDTO,
                imageUrl: uploadedImage
            }
            const response = await createWineAPI(payload);
            if (response.data && response.status === 200) {
                notification.success({
                    message: "Create oke"
                })
            } else {
                notification.warning(
                    {
                        message: "Need check action"
                    }
                )
            }

        } catch (error) {
            notification.error(
                { message: "Fail create" }
            )
        }
    }
    const fetchWineCategories = async () => {
        const data = await fetchWineCategoriesAPI()
        if (data) setWineCategories(data)
    }
    const fetchContries = async () => {
        const data = await fetchCountriesAPI()
        if (data) setCountries(data)
    }
    const fetchTastes = async () => {
        const data = await fetchTastesAPI()
        if (data) setTastes(data)
    }
    const fetchClasses = async () => {
        const data = await fetchClassesAPI()
        if (data) setClasses(data)
    }
    const fetchQualifications = async () => {
        const data = await fetchQualificationsAPI()
        if (data) setQualifications(data)
    }
    const fetchCorks = async () => {
        const data = await fetchCorksAPI()
        if (data) setCorks(data)
    }
    const fetchBrands = async () => {
        const data = await fetchBrandsAPI()
        if (data) setBrands(data)
    }
    const fetchBottleSizes = async () => {
        const data = await fetchBottleSizesAPI()
        if (data) setBottleSizes(data)
    }
    const fetchAlcoholVolume = async () => {
        const data = await fetchAlcoholVolumeAPI()
        if (data) setAlcoholVolume(data)
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
    const uploadProps = {
        name: 'file',
        accept: 'image/png, image/jpeg',  // Accept only PNG and JPEG files
        maxCount: 1,  // Limit to a single upload
        beforeUpload: () => {
            return false;  // Prevent automatic upload
        },
        onChange: (info) => {
            if (info.file.status !== 'uploading') {
                console.log('info.file.status: ', info.file.status)

                const formData = new FormData();
                formData.append('file', info.file)

                // Upload the image and store the response
                const uploadedImage = uploadImageWine(formData)
                console.log(info.file, info.fileList);

                console.log('uploadImageWine response: ', uploadedImage)
            }
            if (info.file.status === 'done') {
                console.log('Temporary image URL:', uploadedImage)
                // const url = URL.createObjectURL(info.file.originFileObj)
                // await uploadImageWine(url)
                console.log('Temporary image URL:', uploadedImage) // Debugging: log the temporary URL
            } else if (info.file.status === 'removed') {
                setUploadedImage(null);  // Clear uploaded image when removed
                console.log('something here 12')
            }
            console.log('info.file.status2: ', info.file.status)
        },
    };
    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Wine</h2>
            <Button type="default" onClick={handleBackToList} style={{ height: '50px', backgroundColor: 'white', borderRadius: '4px', borderColor: 'transparent' }}>
                <ArrowLeftOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
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
                    {/* <Col span={12}>
                        <Form.Item
                            name="availableStock"
                            label="Available Stock"
                            rules={[{ required: true, message: 'Please input the available stock!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col> */}
                    <Col span={12}>
                        <Form.Item
                            name="importPrice"
                            label="Import Price"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="exportPrice"
                            label="Export Price"
                        >
                            <Input type="number" />
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
                    {/* <Col span={12}>
                        <Form.Item
                            name="supplier"
                            label="Supplier"
                            rules={[{ required: true, message: 'Please input the supplier!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col> */}
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
                            rules={[{ required: true, message: 'Please select wine category!' }]}
                        >
                            <Select>
                                {wineCategories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="countryId"
                            label="Country"
                            rules={[{ required: true, message: 'Please select country!' }]}
                        >
                            <Select>
                                {countries.map((countries) => (
                                    <Select.Option key={countries.id} value={countries.id}>
                                        {countries.countryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="tasteId"
                            label="Taste"
                            rules={[{ required: true, message: 'Please select taste!' }]}
                        >
                            <Select>
                                {Tastes.map((taste) => (
                                    <Select.Option key={taste.id} value={taste.id}>
                                        {taste.tasteType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="classId"
                            label="Class"
                            rules={[{ required: true, message: 'Please select class!' }]}
                        >
                            <Select>
                                {Classes.map((classes) => (
                                    <Select.Option key={classes.id} value={classes.id}>
                                        {classes.classType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="qualificationId"
                            label="Qualification"
                            rules={[{ required: true, message: 'Please select qualification!' }]}
                        >
                            <Select>
                                {Qualifications.map((qualification) => (
                                    <Select.Option key={qualification.id} value={qualification.id}>
                                        {qualification.qualificationType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="corkId"
                            label="Cork"
                            rules={[{ required: true, message: 'Please select cork!' }]}
                        >
                            <Select>
                                {Corks.map((cork) => (
                                    <Select.Option key={cork.id} value={cork.id}>
                                        {cork.corkType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="brandId"
                            label="Brand"
                            rules={[{ required: true, message: 'Please select brand!' }]}
                        >
                            <Select>
                                {Brands.map((brand) => (
                                    <Select.Option key={brand.id} value={brand.id}>
                                        {brand.brandName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="bottleSizeId"
                            label="Bottle size"
                            rules={[{ required: true, message: 'Please select bottle size!' }]}
                        >
                            <Select>
                                {BottleSizes.map((bottleSize) => (
                                    <Select.Option key={bottleSize.id} value={bottleSize.id}>
                                        {bottleSize.bottleSizeType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="alcoholByVolumeId"
                            label="Alcohol Volume"
                            rules={[{ required: true, message: 'Please select Alcohol Volume!' }]}
                        >
                            <Select>
                                {AlcoholVolume.map((alcoholVolume) => (
                                    <Select.Option key={alcoholVolume.id} value={alcoholVolume.id}>
                                        {alcoholVolume.alcoholByVolumeType}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                </Row>
                <Row>
                    <Form.Item
                        name="imageUrl"
                        label="Image"
                        noStyle
                    />
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>

                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Dragger>
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
