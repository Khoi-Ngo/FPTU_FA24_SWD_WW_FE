import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Descriptions, message, Row, Col, Table, notification } from 'antd'
import { fetchWineDetailAPI } from '~/services/api-service/WineApiService'
import { fetchWineRoomsByWineId } from '~/services/api-service/WineRoomeApiService'
import { ArrowLeftOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'


export const DetailWinePage = () => {
    const [wine, setWine] = useState(null)
    const [wineRooms, setWineRooms] = useState([])
    const [showWineRooms, setShowWineRooms] = useState(false)
    const { wineId } = useParams()
    const navigate = useNavigate()


    //#region wine detail
    useEffect(() => {
        fetchWineDetail(wineId)
        console.log('wine: ', wine)
    }, [wineId])

    const fetchWineDetail = async (wineId) => {
        try {
            const response = await fetchWineDetailAPI(wineId)
            if (response) {
                setWine(response)
                notification.success(
                    {
                        message: "OK"
                    }
                )
            } else {
                notification.warning(
                    {
                        message: "Cannot get detail",
                        description: "Need check action"
                    }
                )
            }
        } catch (error) {
            notification.error(
                {
                    message: "Cannot get the wine detail",
                    description: error.message
                }
            )
        }
    }
    //#endregion


    //#region wine room list
    const toggleWineRoomList = async () => {
        if (showWineRooms) {
            setWineRooms([])
        } else {
            try {
                //call api wine rooms here
                await fetchWineRoomList(wineId)

            } catch (err) {
                notification.error({
                    message: err.message,
                })
            }
        }
        setShowWineRooms(!showWineRooms)
    }

    const fetchWineRoomList = async (wineId) => {
        try {
            const response = await fetchWineRoomsByWineId(wineId)
            if (response.data && response.status === 200) {
                setWineRooms(response.data)
                notification.success(
                    {
                        message: "Load wine rooms ok"
                    }
                )
            } else {
                notification.warning(
                    {
                        message: "Cannot get wine rooms data",
                        description: "Need check action"
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

    }
    //#endregion


    //redirect to the wine list
    const handleBackToList = () => {
        navigate('/app/wines')
    }


    const columns = [
        { title: 'Wine Name', dataIndex: 'wineName', key: 'wineName' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Manufacture Date', dataIndex: 'mfd', key: 'mfd' },
        { title: 'Import Price', dataIndex: 'importPrice', key: 'importPrice' },
        { title: 'Export Price', dataIndex: 'exportPrice', key: 'exportPrice' },
        { title: 'Wine Category', dataIndex: 'wineCategory', key: 'wineCategory' },
        { title: 'Country', dataIndex: 'country', key: 'country' },
        { title: 'Taste', dataIndex: 'taste', key: 'taste' },
        { title: 'Class', dataIndex: 'class', key: 'class' },
        { title: 'Qualification', dataIndex: 'qualification', key: 'qualification' },
        { title: 'Cork', dataIndex: 'cork', key: 'cork' },
        { title: 'Brand', dataIndex: 'brand', key: 'brand' },
        { title: 'Bottle Size', dataIndex: 'bottleSize', key: 'bottleSize' },
        { title: 'Alcohol Volume', dataIndex: 'alcoholByVolume', key: 'alcoholByVolume' },
        { title: 'Image', dataIndex: 'imageUrl', key: 'imageUrl' },
    ]

    if (!wine) return null

    return (
        <div style={{ width: '100%', height: '100%', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Wine Details</h2>
            <Button type="default" onClick={handleBackToList} style={{ height: '50px', backgroundColor: 'white', borderRadius: '4px', borderColor: 'transparent' }}>
                <ArrowLeftOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
            </Button>
            <Row>
                <Col span={24}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Wine Name">{wine.wineName}</Descriptions.Item>
                        <Descriptions.Item label="Description">{wine.description}</Descriptions.Item>
                        <Descriptions.Item label="Country">{wine.country?.countryName}</Descriptions.Item>
                        <Descriptions.Item label="Import Price">{wine.importPrice}</Descriptions.Item>
                        <Descriptions.Item label="Export Price">{wine.exportPrice}</Descriptions.Item>
                        <Descriptions.Item label="Wine Category">{wine.wineCategory?.categoryName}</Descriptions.Item>
                        <Descriptions.Item label="Manufacture Date">{dayjs(wine.mfd).format('YYYY-MM-DD')}</Descriptions.Item>
                        <Descriptions.Item label="Taste">{wine.taste?.tasteType}</Descriptions.Item>
                        <Descriptions.Item label="Class">{wine.class?.classType}</Descriptions.Item>
                        <Descriptions.Item label="Qualification">{wine.qualification?.qualificationType}</Descriptions.Item>
                        <Descriptions.Item label="Cork">{wine.cork?.corkType}</Descriptions.Item>
                        <Descriptions.Item label="Brand">{wine.brand?.brandName}</Descriptions.Item>
                        <Descriptions.Item label="Bottle Size">{wine.bottleSize?.bottleSizeType}</Descriptions.Item>
                        <Descriptions.Item label="Alcohol Volume">{wine.alcoholByVolume?.alcoholByVolumeType}</Descriptions.Item>
                        <Descriptions.Item label="Image">
                            <img src={wine.imageUrl} alt="wine" style={{ width: '150px', height: '150px', borderRadius: '5%' }} />
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Status">{wine.status}</Descriptions.Item> */}
                    </Descriptions>
                </Col>
            </Row>
            <Button type="link" onClick={toggleWineRoomList} style={{ width: '100%', height: '40px', marginTop: '24px', marginBottom: '24px' }}>
                {showWineRooms ? 'Hide details about the stock' : 'Show more about the stock'}
            </Button>
            {showWineRooms && (
                <Table dataSource={wineRooms} columns={columns} rowKey="Id" pagination={{ pageSize: 8 }} />
            )}
        </div>
    )
}

export default DetailWinePage
