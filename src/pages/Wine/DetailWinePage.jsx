import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Descriptions, message, Row, Col, Table, notification } from 'antd';
import moment from 'moment';

const mockWine = {
    Id: 1,
    WineName: 'Mock Red Wine',
    AlcoholContent: 13.5,
    BottleSize: '750ml',
    AvailableStock: 150,
    Description: 'A fine red wine for testing purposes.',
    ImageUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
    Supplier: 'Mock Supplier',
    MFD: '2022-09-15',
    Status: 'Available',
    WineCategoryId: 1,
    WineCategory: {
        id: 1,
        CategoryName: 'Red Wine',
        Description: 'Mock Category Description',
        WineType: 'Cabernet Sauvignon',
    }
};

const mockWineRooms = [
    {
        Id: 1,
        CurrQuantity: 50,
        TotalQuantity: 100,
        Room: {
            RoomName: 'Room A',
            LocationAddress: 'Location A',
            Capacity: 200,
            CurrentOccupancy: 150,
            ManagerName: 'Manager A'
        }
    },
    {
        Id: 2,
        CurrQuantity: 30,
        TotalQuantity: 80,
        Room: {
            RoomName: 'Room B',
            LocationAddress: 'Location B',
            Capacity: 150,
            CurrentOccupancy: 80,
            ManagerName: 'Manager B'
        }
    },
    {
        Id: 3,
        CurrQuantity: 45,
        TotalQuantity: 90,
        Room: {
            RoomName: 'Room C',
            LocationAddress: 'Location C',
            Capacity: 180,
            CurrentOccupancy: 130,
            ManagerName: 'Manager C'
        }
    },
    {
        Id: 4,
        CurrQuantity: 60,
        TotalQuantity: 120,
        Room: {
            RoomName: 'Room D',
            LocationAddress: 'Location D',
            Capacity: 250,
            CurrentOccupancy: 200,
            ManagerName: 'Manager D'
        }
    },
    {
        Id: 5,
        CurrQuantity: 20,
        TotalQuantity: 50,
        Room: {
            RoomName: 'Room E',
            LocationAddress: 'Location E',
            Capacity: 100,
            CurrentOccupancy: 60,
            ManagerName: 'Manager E'
        }
    },
    {
        Id: 6,
        CurrQuantity: 80,
        TotalQuantity: 150,
        Room: {
            RoomName: 'Room F',
            LocationAddress: 'Location F',
            Capacity: 300,
            CurrentOccupancy: 200,
            ManagerName: 'Manager F'
        }
    },
    {
        Id: 7,
        CurrQuantity: 70,
        TotalQuantity: 140,
        Room: {
            RoomName: 'Room G',
            LocationAddress: 'Location G',
            Capacity: 280,
            CurrentOccupancy: 210,
            ManagerName: 'Manager G'
        }
    },
    {
        Id: 8,
        CurrQuantity: 90,
        TotalQuantity: 180,
        Room: {
            RoomName: 'Room H',
            LocationAddress: 'Location H',
            Capacity: 350,
            CurrentOccupancy: 260,
            ManagerName: 'Manager H'
        }
    },
    {
        Id: 9,
        CurrQuantity: 25,
        TotalQuantity: 60,
        Room: {
            RoomName: 'Room I',
            LocationAddress: 'Location I',
            Capacity: 120,
            CurrentOccupancy: 80,
            ManagerName: 'Manager I'
        }
    },
    {
        Id: 10,
        CurrQuantity: 40,
        TotalQuantity: 100,
        Room: {
            RoomName: 'Room J',
            LocationAddress: 'Location J',
            Capacity: 200,
            CurrentOccupancy: 120,
            ManagerName: 'Manager J'
        }
    }
];


export const DetailWinePage = () => {
    const [wine, setWine] = useState(null);
    const [wineRooms, setWineRooms] = useState([]);
    const [showWineRooms, setShowWineRooms] = useState(false);
    const { wineId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWine = async () => {
            try {
                throw new Error('API request failed');
            } catch (error) {
                console.error('Failed to fetch wine:', error);
                setWine(mockWine);
            }
        };

        fetchWine();
    }, [wineId]);

    const handleBackToList = () => {
        navigate('/app/wines');
    };

    const toggleWineRoomList = () => {
        if (showWineRooms) {
            setWineRooms([]);
        } else {
            try {
                // Simulate API call
                setWineRooms(mockWineRooms);
            } catch (err) {
                notification.error({
                    message: err.message,
                });
            }
        }
        setShowWineRooms(!showWineRooms);
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
