import React, { useState } from 'react';
import { Layout, Menu, Card, Row, Col } from 'antd';
import { PieChartOutlined, DesktopOutlined, UserOutlined } from '@ant-design/icons';
import '../styles/MockDashboardPage.css'; // Importing the external CSS file
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const MockDashboardPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('Overview'); // State to track selected menu
    const navigate = useNavigate();

    const handleMenuClick = (menuKey) => {
        setSelectedMenu(menuKey); // Update selected menu
        switch (menuKey) {
            case 'Overview':
                navigate('/app'); // Direct to the app base route
                break;
            case 'Analytics':
                navigate('/app/analytics'); // Correct path for analytics
                break;
            case 'Users':
                navigate('/app/users'); // Correct path for users
                break;
            case 'Test':
                navigate('/app/test'); // Correct path for users
                break;
            case 'ImportPage':
                navigate('/app/importPage'); // Correct path for users
                break;
            default:
                break;
        }
    };

    // Render content based on selected menu
    const renderContent = () => {
        switch (selectedMenu) {
            case 'Overview':
                return (
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card title="Statistics" bordered={false}>
                                Content for statistics
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Revenue" bordered={false}>
                                Content for revenue
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="User Activity" bordered={false}>
                                Content for user activity
                            </Card>
                        </Col>
                    </Row>
                );
            case 'Analytics':
                return (
                    <Card title="Analytics" bordered={false}>
                        Analytics content goes here
                    </Card>
                );
            case 'Users':
                return (
                    <Card title="Users" bordered={false}>
                        User list content goes here
                    </Card>
                );
            case 'Test':
                return (
                    <Card title="Test" bordered={false}>
                        User list content goes here
                    </Card>
                );
            case 'ImportPage':
                return (
                    <Card title="ImportPage" bordered={false}>
                        User list content goes here
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>


            <Layout className="site-layout">
                <Content >
                    <div className="site-layout-background" style={{ minHeight: 360 }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MockDashboardPage;
