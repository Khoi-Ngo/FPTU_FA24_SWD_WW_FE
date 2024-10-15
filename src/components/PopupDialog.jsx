import { Modal } from 'antd'

function PopupDialog({ title, content,isModalOpen}) {
  return (
    <Modal
      open={isModalOpen}
      title={title}
      footer={null}
    >
      {content}
    </ Modal>
  )
}

export default PopupDialog
