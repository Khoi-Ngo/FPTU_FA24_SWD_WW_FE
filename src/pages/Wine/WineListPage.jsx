import React, { useState } from 'react';
import { Table, Button, Modal, notification } from 'antd';
import '../../styles/WineListStyle.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';

export const WineListPage = () => {
    const [wines, setWines] = useState(mockWines);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentWineId, setCurrentWineId] = useState(null);
    const navigate = useNavigate();

    const handleDeleteButtonClicked = (wineId) => {
        setCurrentWineId(wineId);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        try {
            // TODO: call API to delete and reload page
            setWines((prevWines) => prevWines.filter((wine) => wine.id !== currentWineId));
            notification.success({
                message: `Wine deleted successfully`,
                description: `Wine with ID: ${currentWineId} was deleted.`,
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message,
            });
        }
        setIsDeleteModalVisible(false);
    };

    const handleCreateButtonClicked = () => {
        navigate("/app/create-wine");
    };

    const handleDetailButtonClicked = (record) => {
        navigate(`/app/wines/${record.id}`);
    };

    const handleUpdateButtonClicked = (record) => {
        navigate(`/app/update-wine/${record.id}`);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Wine Name',
            dataIndex: 'wineName',
            key: 'wineName',
        },
        {
            title: 'Available Stock',
            dataIndex: 'availableStock',
            key: 'availableStock',
        },
        {
            title: 'MFD',
            dataIndex: 'mfd',
            key: 'mfd',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Image',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            render: (text) => (
                <img
                    src={text}
                    alt="wine"
                    style={{ width: 50, height: 50, borderRadius: '5%' }}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button type="default" onClick={() => handleUpdateButtonClicked(record)}>Update</Button>
                    <Button danger onClick={() => handleDeleteButtonClicked(record.id)}>Delete</Button>
                    <Button type="link" onClick={() => handleDetailButtonClicked(record)}>View Details</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="wine-list-container">
            <h1 className="wine-list-title">Wine List</h1>
            <Button
                type="primary"
                className="create-wine-button"
                onClick={handleCreateButtonClicked}
            >
                Create New Wine
            </Button>
            <Table
                dataSource={wines}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                className="wine-table"
            />
            <Modal
                title="Confirm Delete"
                visible={isDeleteModalVisible}
                onOk={confirmDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to delete this wine?</p>
            </Modal>
        </div>
    );
};

export default WineListPage;

// MOCK DATA BELOW
const mockWines = [
    {
        id: 1,
        wineName: 'Chardonnay',
        availableStock: 100,
        mfd: '2024-01-01',
        supplier: 'Wine Supplier A',
        imgUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
        status: 'Available',
    },
    {
        id: 2,
        wineName: 'Merlot',
        availableStock: 80,
        mfd: '2024-02-01',
        supplier: 'Wine Supplier B',
        imgUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
        status: 'Available',
    },
    {
        id: 3,
        wineName: 'Cabernet Sauvignon',
        availableStock: 60,
        mfd: '2024-03-01',
        supplier: 'Wine Supplier C',
        imgUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
        status: 'Out of Stock',
    },
    {
        id: 4,
        wineName: 'Zinfandel',
        availableStock: 50,
        mfd: '2024-04-01',
        supplier: 'Wine Supplier D',
        imgUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
        status: 'Available',
    },
    {
        id: 5,
        wineName: 'Pinot Noir',
        availableStock: 75,
        mfd: '2024-05-01',
        supplier: 'Wine Supplier E',
        imgUrl: 'https://minuman.com/cdn/shop/files/B_G-CUVEE-SPECIALE-ROUGE-SWEET-WINE.jpg?v=1700117745',
        status: 'Available',
    },
];
