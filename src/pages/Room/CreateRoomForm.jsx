import { Button, Form, Input, InputNumber } from 'antd'
import { useEffect, useState } from 'react'

function CreateRoomForm({ setIsModalOpen, createRoom, isModalOpen, setModalAction }) {
  const [form] = Form.useForm()
  const handleSubmit = (e) => {
    createRoom(formData)
    console.log('Form Data:', formData)
    setIsModalOpen(false)
    clearForm()

  }
  const clearForm = () => {
    if (isModalOpen == false) {
      form.resetFields()
      setModalAction('')
      console.log('clear form')
    }
  }
  const [formData, setFormData] = useState({
    roomName: '',
    locationAddress: '',
    capacity: 0
  })
  const handleCancel = () => {
    setIsModalOpen(false)
    clearForm()
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  return (
    <Form
      form={form}
      labelCol={{ span: 6 }} // Set label span to 6 (out of 24)
      wrapperCol={{
        flex: 1
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

      <Form.Item wrapperCol={{ span: 24, offset: 6 }}>
        <Button type="primary" color='primary' shape='round' htmlType="submit">
          Submit
        </Button>
        <Button style={{ marginLeft: 8 }} shape='round' onClick={() => handleCancel()}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateRoomForm
