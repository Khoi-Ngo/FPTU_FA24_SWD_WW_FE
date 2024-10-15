import { Button, Form, Input, InputNumber } from 'antd'
import { useEffect, useState } from 'react'

function CreateRoomForm({ setIsModalOpen, createRoom, updateRoom, data, modalAction }) {
  const [form] = Form.useForm();
  const handleSubmit = (e) => {
    if (modalAction === 'create') {
      createRoom(formData)
      console.log('Form Data:', formData);
      setIsModalOpen(false)
      form.resetFields()
    }else{
      console.log("formData id: ",formData.id)
      updateRoom(formData.id, formData)
      setIsModalOpen(false)
      form.resetFields()
    }
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
  useEffect(() => {
    console.log("update data: " + data)
    if (data) {
      setFormData(data)
      form.setFieldsValue(data);
    }
  }, [data, form])
  return (
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
        <Button style={{ marginLeft: 8 }} onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateRoomForm
