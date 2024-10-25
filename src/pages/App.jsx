import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth-context";
import { Layout, Menu, notification, Spin } from "antd";
import Footer from "../components/Footer";
import { PieChartOutlined, DesktopOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

export const App = () => {
    const { isAppLoading, SetIsAppLoading, setUserLogin } = useContext(AuthContext);
    const [selectedMenu, setSelectedMenu] = useState('Overview');
    const navigate = useNavigate();
    const location = useLocation();
    const delay = (milSeconds) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, milSeconds)
        })
    }
    const handleLogout = async () => {
        try {
            localStorage.removeItem("access_token");
            setUserLogin(
                {
                    email: "",
                    phone: "",
                    firstName: "",
                    lastName: "",
                    username: "",
                    role: "",
                    avatar: "",
                    id: "",
                    status: "",
                }
            )
            notification.success({
                message: "Logout ok"
            });
            navigate("/");
        } catch (error) {
            notification.error({
                message: "Logout fail"
            })
        }
    }
    const getMenuKeyFromPath = (path) => {
        if (path.startsWith('/app/users')) return 'Users';
        if (path.startsWith('/app/profile')) return 'Profile';
        if (path.startsWith('/app/wines')
            || path.startsWith('/app/create-wine')
            || path.startsWith('/app/update-wine')
        ) return 'Wines';
        if (path.startsWith('/app/wine-categories')) return 'WineCates';
        if (path.startsWith('/app/rooms')) return 'Rooms';
        if (path.startsWith('/app/iorequests')) return 'IORequests';
        if (path.startsWith('/app/tasks')) return 'StaffTasks';
        if (path.startsWith('/app/check-requests')
            || path.startsWith('/app/create-check-request')
        ) return 'CheckRequests';
        return 'Overview';
    };

    const handleMenuClick = (menuKey) => {
        setSelectedMenu(menuKey);
        switch (menuKey) {
            case 'Overview':
                navigate('/app');
                break;
            case 'Users':
                navigate('/app/users');
                break;
            case 'Profile':
                navigate('/app/profile');
                break;
            case 'Wines':
                navigate('/app/wines');
                break;
            case 'WineCates':
                navigate('/app/wine-categories');
                break;
            case 'Rooms':
                navigate('/app/rooms');
                break;
            case 'IORequests':
                navigate('/app/iorequests');
                break;
            case 'StaffTasks':
                navigate('/app/tasks');
                break;
            case 'CheckRequests':
                navigate('/app/check-requests')
                break;
            default:
                break;
        }
    };

    const fetchUserInfo = async () => {
        await delay(500);
        SetIsAppLoading(false);
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const currentMenu = getMenuKeyFromPath(location.pathname);
        setSelectedMenu(currentMenu);
    }, [location.pathname]);

    return (
        isAppLoading ? (
            <div style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}>
                <Spin />
            </div>
        ) : (
            <>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider>
                        <div className="logo">Dashboard</div>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Menu
                                theme="dark"
                                selectedKeys={[selectedMenu]}
                                mode="inline"
                                onClick={({ key }) => handleMenuClick(key)}
                                style={{ flex: 1 }}
                            >
                                <Menu.Item key="Profile" icon={<RobotOutlined />}>
                                    Profile
                                </Menu.Item>
                                <Menu.Item key="Overview" icon={<PieChartOutlined />}>
                                    Overview
                                </Menu.Item>
                                <Menu.Item key="Users" icon={<UserOutlined />}>
                                    Users
                                </Menu.Item>
                                <Menu.Item key="Wines" icon={<UserOutlined />}>
                                    Wines
                                </Menu.Item>
                                <Menu.Item key="WineCates" icon={<UserOutlined />}>
                                    Wine Category
                                </Menu.Item>
                                <Menu.Item key="Rooms" icon={<UserOutlined />}>
                                    Room
                                </Menu.Item>
                                <Menu.Item key="IORequests" icon={<UserOutlined />}>
                                    I/O Requests
                                </Menu.Item>
                                <Menu.Item key="StaffTasks" icon={<UserOutlined />}>
                                    Staff-Task
                                </Menu.Item>
                                <Menu.Item key="CheckRequests" icon={<UserOutlined />}>
                                    Check Requests
                                </Menu.Item>
                            </Menu>
                            <Menu
                                theme="dark"
                                mode="inline"
                            >
                                <Menu.Item key="Logout" icon={<UserOutlined />} onClick={handleLogout}>
                                    Logout
                                </Menu.Item>
                            </Menu>
                        </div>
                    </Sider>
                    <Content style={{ margin: '0 ' }}>
                        <div style={{ background: '#fff', minHeight: 360 }}>
                            <Outlet fetchUserInfo={fetchUserInfo} />
                        </div>
                    </Content>
                </Layout >
            </>
        )
    );
}
