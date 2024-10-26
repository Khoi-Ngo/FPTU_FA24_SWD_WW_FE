import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, notification } from 'antd';
import '../../styles/WineListStyle.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';
import { deleteWineAPI, fetchAllWineAPI } from '../../services/api-service/WineApiService';

export const WineListPage = () => {
    const [wines, setWines] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentWineId, setCurrentWineId] = useState(null);
    const navigate = useNavigate();

    //#region directly DELETE wine in the list
    const handleDeleteButtonClicked = (wineId) => {
        setCurrentWineId(wineId);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            console.log('currentWineId ', currentWineId)
            await deleteWineAPI(currentWineId);
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
        fetchAllWines();
    };
    //#endregion

    //redirect to create wine page
    const handleCreateButtonClicked = () => {
        navigate("/app/create-wine");
    };
    //redirect to the detail page with id path
    const handleDetailButtonClicked = (record) => {
        navigate(`/app/wines/${record.id}`);
    };
    //redirect to the update wine page
    const handleUpdateButtonClicked = (record) => {
        navigate(`/app/update-wine/${record.id}`);
    };

    //#region fetch wine region
    const fetchAllWines = async () => {
        try {
            const response = await fetchAllWineAPI();
            const activeWines = response.filter(wine => wine.status === 'Active')
            if (activeWines) {
                setWines(activeWines);
            } else {
                throw new Error('API request failed');
            }
            notification.success(
                {
                    message: "Load oke"
                }
            )
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }

    useEffect(() => {
        fetchAllWines();
    }, [])
    //#endregion

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
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        // },
        {
            title: 'Actions',
            key: 'actions',
            render: record => (
                <Space size="middle">
                    <Button type="default" onClick={() => handleUpdateButtonClicked(record)}>Update</Button>
                    <Button danger onClick={() => handleDeleteButtonClicked(record.id)}>Delete</Button>
                    <Button type="link" onClick={() => handleDetailButtonClicked(record)}>View Details</Button>
                </Space>
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

            {/* MODAL CONFIRM */}
            <Modal
                title="Confirm Delete"
                open={isDeleteModalVisible}
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