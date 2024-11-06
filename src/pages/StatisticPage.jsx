import { useContext, useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Typography, Spin, notification, Progress, Statistic, Avatar, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '~/components/auth-context'
import { fetchAllWineAPI } from '~/services/api-service/WineApiService'
import { fetchRoomsAPI } from '~/services/api-service/RoomApiService'
import { fetchIORequestApi } from '~/services/api-service/IORequestApiService'
import CountUp from 'react-countup'
import { CheckOutlined, CheckSquareOutlined, HomeOutlined, SunOutlined, WarningOutlined } from '@ant-design/icons'
import { fetchRequestHistoryAPI } from '~/services/api-service/DashboardAPI'
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, Legend, LinearScale, Title as ChartTitle, Tooltip } from 'chart.js'

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend
)

const { Content } = Layout
const { Title } = Typography

const twoColors = {
    '0%': '#108ee9',
    '100%': '#87d068',
}

const formatter = (value) => <CountUp end={value} separator="," />
const currentYear = new Date().getFullYear()

const StatisticPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('Overview') // State to track selected menu
    const navigate = useNavigate()
    const { userLogin } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [wines, setWines] = useState(null)
    const [rooms, setRooms] = useState(null)
    const [requests, setRequests] = useState(null)
    const [pendingRequests, setPendingRequests] = useState(null)
    const [roomProgress, setRoomProgress] = useState({})
    const targetPercentages = {}
    const [currentTime, setCurrentTime] = useState(new Date())
    const [requestHistory, setRequestHistory] = useState([])
    const [months, setMonths] = useState([])
    const [importHistoryData, setImportHistoryData] = useState([])
    const [exportHistoryData, setExportHistoryData] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
            fetchAllWines()
            fetchAllRooms()
            fetchALLRequest()
            fetchRequestHistory(currentYear)
        }, 1000)
    }, [userLogin])

    // useEffect(() => {
    //     console.log('requestHistory3: ', requestHistory)
    //     console.log('months: ', months)
    // }, [requestHistory, months])

    //#region progress bar animation
    useEffect(() => {

        if (rooms) {
            rooms.forEach(room => {
                targetPercentages[room.id] = parseFloat(((room.currentOccupancy / room.capacity) * 100).toFixed(1))
            })
        }
        setRoomProgress(targetPercentages)
    }, [rooms])

    useEffect(() => {
        let animationFrameId

        const animateProgress = () => {
            const updatedProgress = { ...roomProgress }
            let allProgressBarsReachedTarget = true

            for (const roomId in updatedProgress) {
                if (updatedProgress[roomId] < targetPercentages[roomId]) {
                    updatedProgress[roomId] += 1
                    allProgressBarsReachedTarget = false
                } else if (updatedProgress[roomId] > targetPercentages[roomId]) {
                    updatedProgress[roomId] -= 1
                    allProgressBarsReachedTarget = false
                }
            }

            setRoomProgress(updatedProgress)

            if (!allProgressBarsReachedTarget) {
                animationFrameId = requestAnimationFrame(animateProgress)
            }
        }

        animationFrameId = requestAnimationFrame(animateProgress)

        return () => {
            // Clean up animation frame on component unmount
            cancelAnimationFrame(animationFrameId)
        }
    }, [])
    //#endregion

    //#region time
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000) // Update every second

        return () => clearInterval(intervalId) // Cleanup on unmount
    }, [])

    const formattedTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })

    const formattedDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' })

    const greeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) {
            return 'Good morning'
        } else if (hour < 18) {
            return 'Good afternoon'
        } else {
            return 'Good evening'
        }
    }
    //#endregion

    const data = {
        labels: months,
        datasets: [{
            label: 'Total imported requests',
            data: importHistoryData,
            backgroundColor: [
                // 'rgba(255, 99, 132, 0.2)',
                // 'rgba(255, 159, 64, 0.2)',
                // 'rgba(255, 205, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(201, 203, 207, 0.2)'
                '#ff957f',
                // '#1c1c1c',
                // '#a1e3ff',
                // '#f0a89c',
                // '#80e3d5',
            ],
            // borderColor: [
            //     'rgb(255, 99, 132)',
            //     'rgb(255, 159, 64)',
            //     'rgb(255, 205, 86)',
            //     'rgb(75, 192, 192)',
            //     'rgb(54, 162, 235)',
            //     'rgb(153, 102, 255)',
            //     'rgb(201, 203, 207)'
            // ],
            borderWidth: 1,
            borderRadius: 20
        },
        {
            label: 'Total exported requests',
            data: exportHistoryData,
            backgroundColor: [
                //'#ff957f',
                // '#1c1c1c',
                 '#a1e3ff',
                // '#f0a89c',
                // '#80e3d5',
            ],
            borderWidth: 1,
            borderRadius: 20
        }
        ]
    }

    const chartConfig = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    }

    useEffect(() => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const currentMonth = new Date().getMonth() + 1 // getMonth() returns month from 0-11, so we add 1
        const pastMonths = []
        const importHistoryData = []
        const exportHistoryData = []

        for (let i = 4; i >= 0; i--) {
            let month = currentMonth - i
            if (month <= 0) {
                month += 12 // wrap around to previous year
            }
            const monthName = monthNames[month - 1]
            pastMonths.push(monthName)
            const selectedMonth = requestHistory.filter(request => request.month == month)
            //console.log('selectedMonth: ', selectedMonth)
            if (selectedMonth.length > 0) {
                //console.log('importRequestQuantity: ',selectedMonth[0].importRequestQuantity)
                importHistoryData.push(selectedMonth[0].importRequestQuantity)
                exportHistoryData.push(selectedMonth[0].exportRequestQuantity)
            }
            //console.log('importHistoryData: ', importHistoryData)
            setImportHistoryData(importHistoryData)
            setExportHistoryData(exportHistoryData)
        }

        setMonths(pastMonths)
    }, [requestHistory])

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
    const fetchRequestHistory = async (year) => {
        try {
            const response = await fetchRequestHistoryAPI(year)
            if (response) {
                setRequestHistory(response)
            } else {
                throw new Error('API request failed')
            }
        } catch (error) {
            notification.error({
                message: "Fail load" + error
            })
        }
    }
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
        )
    }

    return (
        <Layout className="site-layout" style={{ background: '#fff' }}>
            <Content style={{ margin: '16px 16px' }}>
                {/* <div className="site-layout-background" style={{ minHeight: '100vh' }}>
                    </div> */}
                {/* {renderContent()} */}
                {/* <Row gutter={[16, 90]} style={{ marginBottom: '20px' }}>
                    
                </Row> */}
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }} align="middle">
                    <Col span={4} offset={1}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#ffe3db' }}>
                            {/* <Title level={5}>Total wines</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{wines?.length}</Title> */}
                            <Statistic title="Total wines" value={wines?.length} formatter={formatter} suffix="types" />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#e4ecf5' }}>
                            {/* <Title level={5}>Total rooms</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{rooms?.length}</Title> */}
                            <Statistic title="Total rooms" value={rooms?.length} formatter={formatter} suffix={<HomeOutlined />} />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#ffe3db' }}>
                            {/* <Title level={5}>Total finished requests</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{requests?.length}</Title> */}
                            <Statistic title="Total finished requests" value={requests?.length} formatter={formatter} suffix={<CheckOutlined />} />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#e4ecf5' }}>
                            {/* <Title level={5}>Total pending requests</Title>
                            <Title level={2} style={{ marginTop: '0' }}>{pendingRequests?.length}</Title> */}
                            <Statistic title="Total pending requests" value={pendingRequests?.length} formatter={formatter} suffix={<WarningOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6} offset={1}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#27b5af', color: 'white', borderRadius: '100px 0 100px 0' }}>
                            <Space align="center" size="middle">
                                <Title level={2} style={{ color: 'white', textWrap: 'nowrap' }}>{greeting()} {userLogin?.firstName}</Title>
                                <Avatar
                                    size={64}
                                    src={userLogin?.avatar}
                                    alt="User Avatar"
                                />
                            </Space>
                            <p>{userLogin?.role}</p>
                            <span>{formattedTime}, {formattedDay} <SunOutlined /></span>
                            <Title level={4} style={{ color: 'white' }}>Have A Productive Day Ahead!!</Title>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col span={12}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fcfcfc', overflowY: 'auto', height: '480px' }}>
                            <Title level={5}>Rooms current capacity</Title>
                            {rooms?.map(room => (
                                <div key={room.id} style={{ marginBottom: '16px' }}>
                                    <Typography.Text>{room.roomName}</Typography.Text>
                                    <Progress strokeColor={twoColors} percent={roomProgress[room.id] || 0} />
                                </div>
                            ))}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fcfcfc' }}>
                            <Title level={5}>Request history</Title>
                            <Bar {...chartConfig} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col span={12}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: '#fcfcfc', overflowY: 'auto', height: '400px' }}>
                            <Title level={5}>Total quantity for each wine</Title>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default StatisticPage
