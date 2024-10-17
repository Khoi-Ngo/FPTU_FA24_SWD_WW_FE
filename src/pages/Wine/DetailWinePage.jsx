import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Descriptions, message, Row, Col, Table, notification } from 'antd';
import moment from 'moment';
import { fetchWineDetailAPI } from '../../services/api-service/WineApiService';
import { fetchWineRoomsByWineId } from '../../services/api-service/WineRoomeApiService';


export const DetailWinePage = () => {
    const [wine, setWine] = useState(null);
    const [wineRooms, setWineRooms] = useState([]);
    const [showWineRooms, setShowWineRooms] = useState(false);
    const { wineId } = useParams();
    const navigate = useNavigate();


    //#region wine detail
    useEffect(() => {
        fetchWineDetail(wineId);
    }, [wineId]);

    const fetchWineDetail = async (wineId) => {
        try {
            const response = fetchWineDetailAPI(wineId);
            if (response.data && response.status === 200) {
                setWine(response.data);
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
            setWineRooms([]);
        } else {
            try {
                //call api wine rooms here
                await fetchWineRoomList(wineId);

            } catch (err) {
                notification.error({
                    message: err.message,
                });
            }
        }
        setShowWineRooms(!showWineRooms);
    };

    const fetchWineRoomList = async (wineId) => {
        try {
            const response = await fetchWineRoomsByWineId(wineId);
            if (response.data && response.status === 200) {
                setWineRooms(response.data);
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
        navigate('/app/wines');
    };


    const columns = [
        { title: 'Room Name', dataIndex: ['Room', 'RoomName'], key: 'roomName' },
        { title: 'Current Quantity', dataIndex: 'CurrQuantity', key: 'currQuantity' },
        { title: 'Total Quantity', dataIndex: 'TotalQuantity', key: 'totalQuantity' },
        { title: 'Location', dataIndex: ['Room', 'LocationAddress'], key: 'location' },
        { title: 'Capacity', dataIndex: ['Room', 'Capacity'], key: 'capacity' },
        { title: 'Current Occupancy', dataIndex: ['Room', 'CurrentOccupancy'], key: 'currentOccupancy' },
        { title: 'Manager Name', dataIndex: ['Room', 'ManagerName'], key: 'managerName' },
    ];

    if (!wine) return null;

    return (
        <div style={{ width: '100%', height: '100%', margin: 'auto', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Wine Details</h2>
            <Button type="default" onClick={handleBackToList} style={{ width: '20%', height: '40px', backgroundColor: 'white', marginBottom: '24px' }}>
                Back to list of wine
            </Button>
            <Row>
                <Col span={24}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Wine Name">{wine.WineName}</Descriptions.Item>
                        <Descriptions.Item label="Alcohol Content">{wine.AlcoholContent}%</Descriptions.Item>
                        <Descriptions.Item label="Bottle Size">{wine.BottleSize}</Descriptions.Item>
                        <Descriptions.Item label="Available Stock">{wine.AvailableStock}</Descriptions.Item>
                        <Descriptions.Item label="Description">{wine.Description}</Descriptions.Item>
                        <Descriptions.Item label="Supplier">{wine.Supplier}</Descriptions.Item>
                        <Descriptions.Item label="Manufacture Date">{moment(wine.MFD).format('YYYY-MM-DD')}</Descriptions.Item>
                        <Descriptions.Item label="Category">{wine.WineCategory.CategoryName}</Descriptions.Item>
                        <Descriptions.Item label="Image">
                            <img src={wine.ImageUrl} alt="wine" style={{ width: '150px', height: '150px', borderRadius: '5%' }} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">{wine.Status}</Descriptions.Item>
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
    );
};

export default DetailWinePage;
