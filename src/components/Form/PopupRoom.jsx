import { Button, Form, Input, InputNumber, Modal } from 'antd'
import React, { useState } from 'react'

function PopupRoom({ setIsModalOpen, isModalOpen, setNewRoom, createRoom }) {
  const [form] = Form.useForm();
  const handleSubmit = (e) => {
    createRoom(formData)
    console.log('Form Data:', formData);
    setIsModalOpen(false);
    form.resetFields()
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  const [formData, setFormData] = useState({
    roomName: '',
    locationAddress: '',
    capacity: 0,
    currentOccupancy: 0,
    managerName: '',
    wineRooms: [
      // {
      //   currQuantity: 0,
      //   totalQuantity: 0,
      //   roomId: 0,
      //   wineId: 0
      // }
    ]
  })
  const handleWineRoomChange = (index, e) => {
    const { name, value } = e.target
    const updatedWineRooms = formData.wineRooms.map((wineRoom, i) => i === index ? { ...wineRoom, [name]: value } : wineRoom)
    setFormData((prevData) => ({
      ...prevData,
      wineRooms: updatedWineRooms
    }))
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  console.log(handleCancel);
  return (
    <Modal
      title="Create Room Profile"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null} // Remove default footer to use custom buttons
      width={800} // Set a custom width for the modal
    >
      <Form
        form={form}
        labelCol={{ span: 6 }} // Set label span to 6 (out of 24)
        wrapperCol={{
          flex: 1,
        }}
        labelWrap
        labelAlign="left"
        colon={false}
        layout="horizontal"
        onFinish={handleSubmit}
        initialValues={formData}
        style={{ maxWidth: '100%', padding: '20px' }} // Add padding to the form
      >
        <Form.Item
          label="Room Name"
          name="roomName"
          rules={[{ required: true, message: 'Please input the room name!' }]}
        >
          <Input
            type="text"
            name="roomName"
            value={formData.roomName}
            onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Location Address"
          name="locationAddress"
          rules={[{ required: true, message: 'Please input the location address!' }]}
        >
          <Input
            type="text"
            name="locationAddress"
            value={formData.locationAddress}
            onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[{ required: true, message: 'Please input the capacity!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                capacity: value
              }))
            }
          />
        </Form.Item>

        <Form.Item
          label="Current Occupancy"
          name="currentOccupancy"
          rules={[{ required: true, message: 'Please input the current occupancy!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            type="text"
            name="currentOccupancy"
            value={formData.currentOccupancy}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                currentOccupancy: value
              }))
            }
          />
        </Form.Item>

        <Form.Item
          label="Manager Name"
          name="managerName"
          rules={[{ required: true, message: 'Please input the manager name!' }]}
        >
          <Input
            type="text"
            name="managerName"
            value={formData.managerName}
            onChange={handleChange} />
        </Form.Item>



        <Form.Item wrapperCol={{ span: 24, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PopupRoom