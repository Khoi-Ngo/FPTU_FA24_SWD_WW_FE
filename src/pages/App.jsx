import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth-context";
import { Layout, Menu, notification, Spin } from "antd";
import Footer from "../components/Footer";
import { PieChartOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { fetchWineCategoriesAPI, getWineByCategoryAPI } from "~/services/api-service/WineApiService";
import useBearStore from "~/services/zustand";

export const App = () => {
    const { isAppLoading, SetIsAppLoading, setUserLogin, userLogin } = useContext(AuthContext);
    const [selectedMenu, setSelectedMenu] = useState('Overview');
    const [wineCategories, setWineCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const filteredWine = useBearStore((state) => state.setWine);

    const delay = (milSeconds) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, milSeconds);
        });
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem("access_token");
            setUserLogin({
                email: "",
                phone: "",
                firstName: "",
                lastName: "",
                username: "",
                role: "",
                avatar: "",
                id: "",
                status: "",
            });
            notification.success({
                message: "Logout successful"
            });
            navigate("/");
        } catch (error) {
            notification.error({
                message: "Logout failed"
            });
        }
    };

    const getMenuKeyFromPath = (path) => {
        if (path.startsWith('/app/users')) return 'Users';
        if (path.startsWith('/app/profile')) return 'Profile';
        if (path.startsWith('/app/wines') || path.startsWith('/app/create-wine') || path.startsWith('/app/update-wine')) return 'Wines';
        if (path.startsWith('/app/wine-categories')) return 'WineCates';
        if (path.startsWith('/app/rooms')) return 'Rooms';
        if (path.startsWith('/app/io-requests')) return 'IORequests';
        if (path.startsWith('/app/tasks')) return 'StaffTasks';
        if (path.startsWith('/app/check-requests') || path.startsWith('/app/create-check-request')) return 'CheckRequests';

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
                navigate('/app/io-requests');
                break;
            case 'StaffTasks':
                navigate('/app/tasks');
                break;
            case 'CheckRequests':
                navigate('/app/check-requests');
                break;
            default:
                break;
        }
    };

    const fetchUserInfo = async () => {
        await delay(500);
        SetIsAppLoading(false);
    };

    const fetchWineCategories = async () => {
        const data = await fetchWineCategoriesAPI();
        if (data) setWineCategories(data);
    };

    const getWineByCategory = async (categoryId) => {
        try {
            const response = await getWineByCategoryAPI(categoryId);
            if (response) {
                const filter = response.wines.filter(wine => wine.status === 'Active');
                filteredWine(filter);
                navigate('/app/filtered-wine');
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            notification.error({
                message: "Failed to load: " + error.message
            });
        }
    };

    const wineCategoryItems = wineCategories.map(category => ({
        key: category.id,
        label: category.categoryName,
        onClick: () => { getWineByCategory(category.id); },
    }));

    const getMenuItems = () => {
        const commonItems = [
            {
                label: 'Profile',
                icon: <RobotOutlined />,
                key: 'Profile'
            },

        ];

        if (userLogin.role === 'ADMIN') {
            return [
                ...commonItems,

                {
                    label: 'Users',
                    icon: <UserOutlined />,
                    key: 'Users'
                },
                {
                    label: 'Overview',
                    icon: <PieChartOutlined />,
                    key: 'Overview'
                },
                {
                    label: 'Logout',
                    icon: <UserOutlined />,
                    key: 'Logout',
                    onClick: handleLogout,
                    danger: true
                }
            ];
        }

        if (userLogin.role === 'MANAGER') {
            return [
                ...commonItems,
                {
                    label: 'Overview',
                    icon: <PieChartOutlined />,
                    key: 'Overview'
                },
                {
                    label: 'Wines',
                    icon: <UserOutlined />,
                    key: 'Wines',
                    children: wineCategoryItems
                },
                {
                    label: 'Wine Category',
                    icon: <UserOutlined />,
                    key: 'WineCates'
                },
                {
                    label: 'Room',
                    icon: <UserOutlined />,
                    key: 'Rooms'
                },
                {
                    label: 'I/O Requests',
                    icon: <UserOutlined />,
                    key: 'IORequests'
                },
                {
                    label: 'Staff-Task',
                    icon: <UserOutlined />,
                    key: 'StaffTasks'
                },
                {
                    label: 'Check Requests',
                    icon: <UserOutlined />,
                    key: 'CheckRequests'
                },
                {
                    label: 'Logout',
                    icon: <UserOutlined />,
                    key: 'Logout',
                    onClick: handleLogout,
                    danger: true
                }
            ];
        }

        if (userLogin.role === 'STAFF') {
            return [
                ...commonItems,
                {
                    label: 'Staff-Task',
                    icon: <UserOutlined />,
                    key: 'StaffTasks'
                },
                {
                    label: 'Logout',
                    icon: <UserOutlined />,
                    key: 'Logout',
                    onClick: handleLogout,
                    danger: true
                }
            ];
        }

        return commonItems; // Default case
    };

    useEffect(() => {
        fetchUserInfo();
        fetchWineCategories();
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
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <div className="logo">Dashboard</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Menu
                            theme="dark"
                            selectedKeys={[selectedMenu]}
                            mode="inline"
                            onClick={({ key }) => handleMenuClick(key)}
                            style={{ flex: 1 }}
                            items={getMenuItems()} // Get menu items based on user role
                        />
                    </div>
                </Sider>
                <Content style={{ margin: '0 ' }}>
                    <div style={{ background: '#fff', minHeight: 360 }}>
                        <Outlet fetchUserInfo={fetchUserInfo} />
                    </div>
                </Content>
            </Layout>
        )
    );
};
