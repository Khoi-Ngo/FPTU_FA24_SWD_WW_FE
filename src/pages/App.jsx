import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth-context";
import { Layout, Spin } from "antd";
import Footer from "../components/Footer";

export const App = () => {
    const { userLogin, setUserLogin, isAppLoading, SetIsAppLoading } = useContext(AuthContext);

    const delay = (milSeconds) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, milSeconds)
        })
    }


    const fetchUserInfo = async () => {
        await delay(500);
        //TODO: fetch user info here
        SetIsAppLoading(false);
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const navigate = useNavigate(); // Initialize navigate


    const handleRedirect = () => {
        navigate('/demo'); // Redirect to the demo page
    };

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
                <Layout style={{ minHeight: '80vh' }}>
                    {/* <Header /> */}
                    <Outlet
                        fetchUserInfo={fetchUserInfo}
                    />
                </Layout>
                <Footer />
            </>
        )
    );
}
