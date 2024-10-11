import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import '../../styles/WineListStyle.css'; // Import custom styles

const mockWines = [
    {
        id: 1,
        wineName: 'Chardonnay',
        alcoholContent: 13.5,
        bottleSize: '750ml',
        availableStock: 100,
        supplier: 'Wine Supplier A',
    },
    {
        id: 2,
        wineName: 'Merlot',
        alcoholContent: 14.0,
        bottleSize: '750ml',
        availableStock: 80,
        supplier: 'Wine Supplier B',
    },
    {
        id: 3,
        wineName: 'Cabernet Sauvignon',
        alcoholContent: 15.0,
        bottleSize: '750ml',
        availableStock: 60,
        supplier: 'Wine Supplier C',
    },
];

export const WineListPage = () => {
    const [wines, setWines] = useState(mockWines);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentWine, setCurrentWine] = useState(null);
    const [form] = Form.useForm();

    const handleCreateOrUpdate = (values) => {
        if (currentWine) {
            // Update
            setWines((prevWines) =>
                prevWines.map((wine) =>
                    wine.id === currentWine.id ? { ...wine, ...values } : wine
                )
            );
            message.success('Wine updated successfully');
        } else {
            // Create
            const newWine = { id: wines.length + 1, ...values }; // Simple ID assignment
            setWines((prevWines) => [...prevWines, newWine]);
            message.success('Wine created successfully');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = (wineId) => {
        setWines((prevWines) => prevWines.filter((wine) => wine.id !== wineId));
        message.success('Wine deleted successfully');
    };

    const showModal = (wine = null) => {
        setCurrentWine(wine);
        if (wine) {
            form.setFieldsValue(wine);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Wine Name',
            dataIndex: 'wineName',
            key: 'wineName',
        },
        {
            title: 'Alcohol Content',
            dataIndex: 'alcoholContent',
            key: 'alcoholContent',
        },
        {
            title: 'Bottle Size',
            dataIndex: 'bottleSize',
            key: 'bottleSize',
        },
        {
            title: 'Available Stock',
            dataIndex: 'availableStock',
            key: 'availableStock',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button type="default" onClick={() => showModal(record)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                    <Button type="link" onClick={() => showModal(record)}>View Details</Button>
                </div>
            ),
        },
    ];

    return (
        <div className="wine-list-container">
            <h1 className="wine-list-title">Wine List</h1>
            <Button 
                type="primary"
                className="create-wine-button"
                onClick={() => showModal()}
            >
                Create New Wine
            </Button>
            <Table 
                dataSource={wines} 
                columns={columns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }} 
                className="wine-table"
            />
            <Modal
                title={currentWine ? 'Update Wine' : 'Create New Wine'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                className="wine-modal"
            >
                <Form form={form} onFinish={handleCreateOrUpdate}>
                    <Form.Item name="wineName" label="Wine Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="alcoholContent" label="Alcohol Content">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="bottleSize" label="Bottle Size">
                        <Input />
                    </Form.Item>
                    <Form.Item name="availableStock" label="Available Stock">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="supplier" label="Supplier" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="submit-button">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WineListPage;
