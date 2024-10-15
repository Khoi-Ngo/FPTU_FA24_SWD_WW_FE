import { Button } from 'antd'

function DeleteRoom({setIsModalOpen, data, deleteRoom}) {
  const handleDelete = () =>{
    deleteRoom(data.id)
    console.log("deleteFromDeletePage " + data.id)
    setIsModalOpen(false)
  }
  return (
    <div>
      <p>Are you sure to delete this room?</p>
      <Button type="primary" onClick={() => handleDelete()}>
          Delete
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
    </div>
  )
}

export default DeleteRoom
