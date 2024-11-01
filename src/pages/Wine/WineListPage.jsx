import { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, notification } from 'antd'
import '../../styles/WineListStyle.css' // Import custom styles
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteWineAPI, fetchAllWineAPI } from '../../services/api-service/WineApiService'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import Title from 'antd/es/skeleton/Title'

export const WineListPage = () => {
    const [wines, setWines] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentWineId, setCurrentWineId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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
            // notification.success(
            //     {
            //         message: "Load oke"
            //     }
            // )
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }

    useEffect(() => {
        fetchAllWines();
    }, [location])
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
        // {
        //     title: 'Available Stock',
        //     dataIndex: 'availableStock',
        //     key: 'availableStock',
        // },
        {
            title: 'MFD',
            dataIndex: 'mfd',
            key: 'mfd',
        },
        // {
        //     title: 'Supplier',
        //     dataIndex: 'supplier',
        //     key: 'supplier',
        // },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => (
                <img
                    src={text}
                    alt="wine"
                    style={{ width: 100, height: 100, borderRadius: '5%' }}
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
                    <Button type="default" color='primary' variant='solid' onClick={() => handleUpdateButtonClicked(record)}><EditIcon /></Button>
                    <Button color='danger' variant='solid' onClick={() => handleDeleteButtonClicked(record.id)}><DeleteIcon /></Button>
                    <Button type="default" variant='solid' style={{ background: 'orange', color: 'white' }} onClick={() => handleDetailButtonClicked(record)}><ArrowForwardIosIcon /></Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="wine-list-container">
            <Title level={2} className="wine-list-title" >Wine List</Title>
            <Button
                type="primary"
                className="create-wine-button"
                onClick={handleCreateButtonClicked}
                shape="round"
            >
                <AddIcon /> Add new wine
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