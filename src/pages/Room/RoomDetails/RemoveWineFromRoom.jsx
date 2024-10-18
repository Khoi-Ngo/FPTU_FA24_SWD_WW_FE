import { Button } from 'antd'
import React from 'react'

function RemoveWineFromRoom({ setIsModalOpen, data, removeWineFromRoom }) {
  const handleDelete = () => {
    removeWineFromRoom(data.id)
    setIsModalOpen(false)
  }
  return (
    <div>
      <p>Are you sure to remove {data.wineName}?</p>
      <Button type="primary" onClick={() => handleDelete()}>
        Delete
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={() => setIsModalOpen(false)}>
        Cancel
      </Button>
    </div>
  )
}

export default RemoveWineFromRoom
