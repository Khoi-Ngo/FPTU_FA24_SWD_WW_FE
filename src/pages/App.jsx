import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth-context";
import { Layout, Menu, Spin } from "antd";
import Footer from "../components/Footer";
import { PieChartOutlined, DesktopOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";


export const App = () => {
    const { userLogin, setUserLogin, isAppLoading, SetIsAppLoading } = useContext(AuthContext);
    const [selectedMenu, setSelectedMenu] = useState('Overview'); // State to track selected menu
    const navigate = useNavigate();



    const location = useLocation();


    const delay = (milSeconds) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, milSeconds)
        })
    }

    const getMenuKeyFromPath = (path) => {
        if (path.startsWith('/app/users')) return 'Users';
        if (path.startsWith('/app/profile')) return 'Profile';
        if (path.startsWith('/app/wines')
            || path.startsWith('/app/create-wine')
            || path.startsWith('/app/update-wine')
        ) return 'Wines';
        if (path.startsWith('/app/wine-cates')) return 'WineCates';
        if (path.startsWith('/app/rooms')) return 'Rooms';
        if (path.startsWith('/app/io-requests')) return 'IORequests';
        if (path.startsWith('/app/tasks')) return 'StaffTasks';

        return 'Overview'; // Default to 'Overview'
    };


    const handleMenuClick = (menuKey) => {
        setSelectedMenu(menuKey); // Update selected menu
        switch (menuKey) {
            case 'Overview':
                navigate('/app'); // Direct to the app base route
                break;
            case 'Users':
                navigate('/app/users'); // Correct path for users
                break;
            case 'Profile':
                navigate('/app/profile');
                break;
            case 'Wines':
                navigate('/app/wines');
                break;
            case 'WineCates':
                navigate('/app/wine-cates');
                break;
            case 'Rooms':
                navigate('/app/rooms');
                break;
            case 'IORequests':
                navigate('/app/io-requests');
                break;
            case 'StaffTasks':
                navigate('/app/tasks');
                break;
            default:
                break;
        }
    };



    const fetchUserInfo = async () => {
        await delay(500);
        //TODO: fetch user info here
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

                    <Sider >
                        <div className="logo">Dashboard</div>
                        <Menu
                            theme="dark"
                            selectedKeys={[selectedMenu]} // Set selected keys to reflect current menu
                            mode="inline"
                            onClick={({ key }) => handleMenuClick(key)} // Add click handler here
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
                                I/O Requests </Menu.Item>
                            <Menu.Item key="StaffTasks" icon={<UserOutlined />}>
                                Staff-Task
                            </Menu.Item>
                        </Menu>
                    </Sider >
                    {/* <Outlet fetchUserInfo={fetchUserInfo} /> */}
                    <Content style={{ margin: '0 ' }}>
                        <div style={{ background: '#fff', minHeight: 360 }}>
                            <Outlet fetchUserInfo={fetchUserInfo} />
                        </div>
                    </Content>
                </Layout>
                {/* <Footer /> */}
            </>
        )
    );
}
