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
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider>
                <div className="logo">Dashboard</div>
                <Menu
                    theme="dark"
                    selectedKeys={[selectedMenu]} // Set selected keys to reflect current menu
                    mode="inline"
                    onClick={({ key }) => handleMenuClick(key)} // Add click handler here
                >
                    <Menu.Item key="Overview" icon={<PieChartOutlined />}>
                        Overview
                    </Menu.Item>
                    <Menu.Item key="Analytics" icon={<DesktopOutlined />}>
                        Analytics
                    </Menu.Item>
                    <Menu.Item key="Users" icon={<UserOutlined />}>
                        Users
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout className="site-layout">
                <Content style={{ margin: '16px' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MockDashboardPage;
