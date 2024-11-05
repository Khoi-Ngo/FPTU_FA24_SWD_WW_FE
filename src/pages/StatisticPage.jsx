import { useContext, useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Typography, Spin, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '~/components/auth-context'
import { fetchAllWineAPI } from '~/services/api-service/WineApiService'
import { fetchRoomsAPI } from '~/services/api-service/RoomApiService'
import { fetchIORequestApi } from '~/services/api-service/IORequestApiService'

const { Content } = Layout
const { Title } = Typography

const StatisticPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('Overview') // State to track selected menu
    const navigate = useNavigate()
    const { userLogin } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [wines, setWines] = useState(null)
    const [rooms, setRooms] = useState(null)
    const [requests, setRequests] = useState(null)
    const [pendingRequests, setPendingRequests] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
            fetchAllWines()
            fetchAllRooms()
            fetchALLRequest()
            //console.log(rooms.length)
        }, 1000)
    }, [userLogin])

    const handleMenuClick = (menuKey) => {
        setSelectedMenu(menuKey) // Update selected menu
        switch (menuKey) {
            case 'Overview':
                navigate('/app') // Direct to the app base route
                break
            case 'Analytics':
                navigate('/app/analytics') // Correct path for analytics
                break
            case 'Users':
                navigate('/app/users') // Correct path for users
                break
            default:
                break
        }
    }

    //#region Fetch API
    const fetchAllWines = async () => {
        try {
            const response = await fetchAllWineAPI()
            const activeWines = response.filter(wine => wine.status === 'Active')
            if (activeWines) {
                setWines(activeWines)
            } else {
                throw new Error('API request failed')
            }
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }
    const fetchAllRooms = async () => {
        try {
            const response = await fetchRoomsAPI()
            const activeRooms = response.filter(room => room.status === 'Active')
            if (activeRooms) {
                setRooms(activeRooms)
            } else {
                throw new Error('API request failed')
            }
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }
    const fetchALLRequest = async () => {
        try {
            const response = await fetchIORequestApi()
            const finishedRequest = response.filter(request => request.status === 'Done')
            const pendingRequest = response.filter(request => request.status === 'Pending')
            if (finishedRequest) {
                setRequests(finishedRequest)
                setPendingRequests(pendingRequest)
            } else {
                throw new Error('API request failed')
            }
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }
    //#endregion


    // Render content based on selected menu
    // const renderContent = () => {
    //     switch (selectedMenu) {
    //         case 'Overview':
    //             return (
    //                 <Row gutter={[16, 16]}>
    //                     <Col span={8}>
    //                         <Card title="Statistics" bordered={false} style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#ffe3db'}}>
    //                             Content for statistics
    //                         </Card>
    //                     </Col>
    //                     <Col span={8}>
    //                         <Card title="Revenue" bordered={false} style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
    //                             Content for revenue
    //                         </Card>
    //                     </Col>
    //                     <Col span={8}>
    //                         <Card title="User Activity" bordered={false} style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
    //                             Content for user activity
    //                         </Card>
    //                     </Col>
    //                 </Row>
    //             )
    //         case 'Analytics':
    //             return (
    //                 <Card title="Analytics" bordered={false}>
    //                     Analytics content goes here
    //                 </Card>
    //             )
    //         case 'Users':
    //             return (
    //                 <Card title="Users" bordered={false}>
    //                     User list content goes here
    //                 </Card>
    //             )
    //         default:
    //             return null
    //     }
    // }
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout className="site-layout" style={{ background: '#fff' }}>
            <Content style={{ margin: '16px 16px' }}>
                {/* <div className="site-layout-background" style={{ minHeight: '100vh' }}>
                    </div> */}
                {/* {renderContent()} */}
                <Row gutter={[16, 90]} style={{ marginBottom: '20px' }}>
                    <Col span={6} offset={18}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fafaf7' }}>
                            <Title level={2}>Good morning {userLogin?.firstName}</Title>
                            {userLogin?.role}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#ffe3db' }}>
                            <Title level={5}>Total wines</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{wines?.length}</Title>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#e4ecf5' }}>
                            <Title level={5}>Total rooms</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{rooms?.length}</Title>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#ffe3db' }}>
                            <Title level={5}>Total finished requests</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{requests?.length}</Title>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#e4ecf5' }}>
                            <Title level={5}>Total pending requests</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{pendingRequests?.length}</Title>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default StatisticPage
