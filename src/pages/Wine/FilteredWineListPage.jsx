import { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, notification } from 'antd'
import '../../styles/WineListStyle.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteWineAPI } from '../../services/api-service/WineApiService'
import useBearStore from '~/services/zustand'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'

function FilteredWineListPage() {
  const wine = useBearStore(state => state.wine)
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentWineId, setCurrentWineId] = useState(null);
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
      title: 'MFD',
      dataIndex: 'mfd',
      key: 'mfd',
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
          <Button type="default" color='primary' variant='solid' onClick={() => handleUpdateButtonClicked(record)}><EditIcon /></Button>
          <Button color='danger' variant='solid' onClick={() => handleDeleteButtonClicked(record.id)}><DeleteIcon /></Button>
          <Button type="default" variant='solid' style={{background: 'orange', color: 'white'}} onClick={() => handleDetailButtonClicked(record)}><ArrowForwardIosIcon /></Button>
        </Space>
      ),
    },
  ]
  useEffect(() => {
    console.log('Filtered wine: ', wine)
}, [])

  const handleDeleteButtonClicked = (wineId) => {
    setCurrentWineId(wineId);
    setIsDeleteModalVisible(true);
};
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
  
  const confirmDelete = async () => {
    try {
        console.log('currentWineId ', currentWineId)
        await deleteWineAPI(currentWineId)
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
    setIsDeleteModalVisible(false)
}
  return (
    <div className="wine-list-container">
      <h1 className="wine-list-title">Wine List</h1>
      <Button
        type="primary"
        className="create-wine-button"
        onClick={handleCreateButtonClicked}
        shape='round'
      >
        <AddIcon /> Add new wine
      </Button>
      <Table
        dataSource={wine}
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
  )
}

export default FilteredWineListPage
