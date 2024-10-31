import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, Row, Col, notification, Image } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { fetchAlcoholVolumeAPI, fetchBottleSizesAPI, fetchBrandsAPI, fetchClassesAPI, fetchCorksAPI, fetchCountriesAPI, fetchQualificationsAPI, fetchTastesAPI, fetchWineCategoriesAPI, fetchWineDetailAPI, updateWineAPI, uploadImageWineAPI } from '~/services/api-service/WineApiService';


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
    const [form] = Form.useForm()
    const [wine, setWine] = useState(null)
    const [wineCategories, setWineCategories] = useState([])
    const [countries, setCountries] = useState([])
    const [alcoholVolume, setAlcoholVolume] = useState([])
    const [bottleSizes, setBottleSizes] = useState([])
    const [classes, setClasses] = useState([])
    const [brands, setBrands] = useState([])
    const [corks, setCorks] = useState([])
    const [qualifications, setQualifications] = useState([])
    const [tastes, setTastes] = useState([])
    const [uploadedImage, setUploadedImage] = useState(null)
    const { wineId } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        fetchContries()
        fetchClasses()
        fetchCorks()
        fetchQualifications()
        fetchTastes()
        fetchBrands()
        fetchBottleSizes()
        fetchAlcoholVolume()
        fetchWineCategories()
        fetchWineData(wineId)
    }, [wineId])
    useEffect(() => {
        if (wine) {
            // Set form fields when wine data is available
            form.setFieldsValue({
                ...wine,
                mfd: moment(wine.MFD),
                wineCategoryId: wine.wineCategory.id,
                countryId: wine.country.id,
                tasteId: wine.taste.id,
                classId: wine.class.id,
                qualificationId: wine.qualification.id,
                corkId: wine.cork.id,
                brandId: wine.brand.id,
                bottleSizeId: wine.bottleSize.id,
                alcoholByVolumeId: wine.alcoholByVolume.id,
                supplier: wine.supplier,
                imageUrl: wine.imageUrl,
            });
        }
    }, [wine]);

    const onFinish = (values) => {
        const payload = {
            ...values,
            mfd: values.mfd.format('YYYY-MM-DDTHH:mm:ss'),
            wineCategory: { id: values.wineCategoryId },
            country: { id: values.countryId },
            taste: { id: values.tasteId },
            class: { id: values.classId },
            qualification: { id: values.qualificationId },
            cork: { id: values.corkId },
            brand: { id: values.brandId },
            bottleSize: { id: values.bottleSizeId },
            alcoholByVolume: { id: values.alcoholByVolumeId },
            importPrice: values.importPrice,
            exportPrice: values.exportPrice,
            imageUrl: uploadedImage
        }
        console.log('Payload:', payload)
        updateWine(payload)
        navigate('/app/wines');
    }
    //#region API
    const uploadImageWine = async (payload) => {
        const response = await uploadImageWineAPI(payload)
        setUploadedImage(response.downloadUrl)
        console.log('uploadImageWineAPI has run')
    }
    const fetchWineData = async (Id) => {
        try {
            // Simulate a failed API call
            const response = await fetchWineDetailAPI(Id)
            setWine(response)
            console.log('wine ', wine)
            console.log('ID ', Id)
            console.log('wineImage while fetching ', uploadedImage)
            //throw new Error('API request failed')
        } catch (error) {
            console.error('Failed to fetch wine:', error);
            setWine(mockWine)  // Set mock data in case of failure
            notification.warning({
                message: 'Using mock data',
                description: 'Failed to fetch data from API, displaying mock data instead.',
            });
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

    const updateWine = async (payload) => {
        try {
            await updateWineAPI(wineId, payload);
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

    if (!wine) return null; // Ensure wine data is loaded before rendering

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Update Wine</h2>
            <Button type="default" onClick={handleBackToList} style={{ height: '50px', backgroundColor: 'white', borderRadius: '4px', borderColor: 'transparent' }}>
                <ArrowLeftOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
            </Button>
            <Form form={form} name="update_wine" onFinish={onFinish} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item name="wineName" label="Wine Name" rules={[{ required: true, message: 'Please input the wine name!' }]}>
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
                        <Form.Item name="supplier" label="Supplier" rules={[{ required: true, message: 'Please input the supplier!' }]}>
                            <Input />
                        </Form.Item>
                    </Col> */}
                    <Col span={12}>
                        <Form.Item name="mfd" label="Manufacture Date" rules={[{ required: true, message: 'Please select the manufacture date!' }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="wineCategoryId" label="Wine Category" rules={[{ required: true, message: 'Please select wine category!' }]}>
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
                        <Form.Item name="countryId" label="Country" rules={[{ required: true, message: 'Please select country!' }]}>
                            <Select>
                                {countries.map((country) => (
                                    <Select.Option key={country.id} value={country.id}>
                                        {country.countryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* Other form fields for nested objects (taste, class, qualification, etc.) */}
                    <Col span={12}>
                        <Form.Item name="tasteId" label="Taste" rules={[{ required: true, message: 'Please select taste!' }]}>
                            <Select>
                                {tastes.map((taste) => (
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
                                {classes.map((classes) => (
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
                                {qualifications.map((qualification) => (
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
                                {corks.map((cork) => (
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
                                {brands.map((brand) => (
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
                                {bottleSizes.map((bottleSize) => (
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
                                {alcoholVolume.map((alcoholVolume) => (
                                    <Select.Option key={alcoholVolume.id} value={alcoholVolume.id}>
                                        {alcoholVolume.alcoholByVolumeType}
                                    </Select.Option>
                                ))}
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
                        <Form.Item name="imageUrl" style={{ marginBottom: '10px' }}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Click to Upload New Image</Button>
                        </Upload>
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
