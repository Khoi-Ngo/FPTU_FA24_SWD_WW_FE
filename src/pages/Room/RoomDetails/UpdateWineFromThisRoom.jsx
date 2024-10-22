import React from 'react'
import { Button, Form, Input, InputNumber } from 'antd'
import { useEffect, useState } from 'react'
function UpdateWineFromThisRoom({ setIsModalOpen, updateRoomDetails, data, isModalOpen, setModalAction }) {
  const [form] = Form.useForm()
  const handleSubmit = (e) => {
    console.log('formData id: ', formData.id)
    updateRoomDetails(formData.id, formData)
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
    capacity: 0,
    currentOccupancy: 0,
    managerName: '',
    wineRooms: []
  })
  const handleCancle = () => {
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
    <div>UpdateWineFromThisRoom</div>
  )
}

export default UpdateWineFromThisRoom