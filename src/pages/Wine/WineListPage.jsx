import { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, notification, Card, Divider, Typography, Input } from 'antd'
import '../../styles/WineListStyle.css' // Import custom styles
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteWineAPI, fetchAllWineAPI } from '../../services/api-service/WineApiService'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import dayjs from 'dayjs'
import { SearchOutlined } from '@ant-design/icons'

const { Title } = Typography

export const WineListPage = () => {
    const [wines, setWines] = useState(null) //for api
    const [allWines, setAllWines] = useState(null) //for search filter and not using api
    const [searchText, setSearchText] = useState('')
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [currentWineId, setCurrentWineId] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const token = window?.localStorage?.getItem("access_token")
    const authToken = `Bearer ${token}`

    //#region directly DELETE wine in the list
    const handleDeleteButtonClicked = (wineId) => {
        setCurrentWineId(wineId)
        setIsDeleteModalVisible(true)
    }

    const confirmDelete = async () => {
        try {
            console.log('currentWineId ', currentWineId)
            await deleteWineAPI(currentWineId, authToken)
            notification.success({
                message: `Wine deleted successfully`,
                description: `Wine with ID: ${currentWineId} was deleted.`,
            })
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message,
            })
        }
        setIsDeleteModalVisible(false)
        fetchAllWines()
    }
    //#endregion

    //redirect to create wine page
    const handleCreateButtonClicked = () => {
        navigate("/app/create-wine")
    }
    //redirect to the detail page with id path
    const handleDetailButtonClicked = (record) => {
        navigate(`/app/wines/${record.id}`)
    }
    //redirect to the update wine page
    const handleUpdateButtonClicked = (record) => {
        navigate(`/app/update-wine/${record.id}`)
    }
    const handleSearch = (e) => {
        const { value } = e.target
        setSearchText(value)

        // Filter wines based on search text
        const filteredWines = allWines.filter((wine) =>
            wine.wineName.toLowerCase().includes(value.toLowerCase())
        )
        setWines(filteredWines)
    }

    //#region fetch wine region
    const fetchAllWines = async () => {
        try {
            const response = await fetchAllWineAPI(authToken)
            const activeWines = response.filter(wine => wine.status === 'Active')
            if (activeWines) {
                setWines(activeWines)
                setAllWines(activeWines)
            } else {
                throw new Error('API request failed')
            }
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }

    useEffect(() => {
        fetchAllWines()
    }, [location])
    //#endregion

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Wine Name',
            dataIndex: 'wineName',
            key: 'wineName',
            sorter: (a, b) => a.wineName.localeCompare(b.wineName),
        },
        {
            title: 'MFD',
            dataIndex: 'mfd',
            key: 'mfd',
            render: (mfd) => (
                <span>{dayjs(mfd).format('YYYY-MM-DD')}</span>
            ),
            sorter: (a, b) => new Date(b.mfd) - new Date(a.mfd),
        },
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
        {
            title: 'Actions',
            key: 'actions',
            render: record => (
                <Space size="middle">
                    <Button title='Update' type="default" color='primary' variant='solid' onClick={() => handleUpdateButtonClicked(record)}><EditIcon /></Button>
                    <Button title='Delete' color='danger' variant='solid' onClick={() => handleDeleteButtonClicked(record.id)}><DeleteIcon /></Button>
                    <Button title='Details' type="default" variant='solid' style={{ background: 'orange', color: 'white' }} onClick={() => handleDetailButtonClicked(record)}><ArrowForwardIosIcon /></Button>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Card bordered={false}>
                <Title level={2} >Wine List</Title>
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={handleCreateButtonClicked}
                        shape="round"
                    >
                        <AddIcon /> Add new wine
                    </Button>
                    <Space.Compact >
                        <Button shape='round' disabled ><SearchOutlined /></Button>
                        <Input
                            placeholder="Enter wine name"
                            value={searchText}
                            onChange={handleSearch}
                            style={{ borderRadius: '0 100px 100px 0' }}
                        />
                    </Space.Compact>
                </Space>
                <Divider />
                <Table
                    dataSource={wines}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    className="wine-table"
                />
            </Card>

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
    )
}

export default WineListPage
