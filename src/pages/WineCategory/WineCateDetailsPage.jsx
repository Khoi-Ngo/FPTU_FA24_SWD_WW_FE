import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Table, Divider } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/WineCateDetailsPage.css'; // Thêm file CSS cho trang này

const { Title } = Typography;

const WineCateDetailsPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategoryDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://winewarehousesystem.azurewebsites.net/api/v1/wine-categories/${id}/wines`);
            setCategory(response.data);
        } catch (error) {
            console.error('Failed to fetch category details.', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
    }

    if (!category) {
        return <p>No details found</p>;
    }

    const columns = [
        {
            title: 'Wine ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Wine Name',
            dataIndex: 'wineName',
            key: 'wineName',
        },
        {
            title: 'Available Stock',
            dataIndex: 'availableStock',
            key: 'availableStock',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: 'Manufactured Date',
            dataIndex: 'mfd',
            key: 'mfd',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Import Price (VND)',
            dataIndex: 'importPrice',
            key: 'importPrice',
        },
        {
            title: 'Export Price (VND)',
            dataIndex: 'exportPrice',
            key: 'exportPrice',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={status === 'Active' ? 'wine-status-active' : 'wine-status-inactive'}>
                    {status}
                </span>
            ),
        },
    ];

    return (
        <div className="container">
            <Card title="Wine Category Details" bordered={false} className="card">
                <Title level={3} className="category-title">Category Information</Title>
                <div className="category-details">
                    <p><strong>ID:</strong> {category.id}</p>
                    <p><strong>Category Name:</strong> {category.categoryName}</p>
                </div>

                <Divider />

                <Title level={4} className="wines-title">Wines in this Category</Title>
                <Table
                    columns={columns}
                    dataSource={category.wines.map((wine, index) => ({ key: index, ...wine }))}
                    pagination={false}
                    bordered
                    className="table-background"
                />
            </Card>
        </div>
    );
};

export default WineCateDetailsPage;
