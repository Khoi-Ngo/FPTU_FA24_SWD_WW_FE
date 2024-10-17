import { useContext } from "react";
import { Button, Result } from 'antd';
import { Link } from "react-router-dom";
import { AuthContext } from "./auth-context";

//? maybe the role is int like STAFF ~ 3

export const NonStaffRoutes = (props) => {
    const { userLogin } = useContext(AuthContext);
    if (userLogin && userLogin.id && (userLogin.role !== "STAFF")) {
        return (
            <>
                {props.children};
            </>
        );
    }
    return (

        <Result
            title="ROLE STAFF NOT ALLOWED"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" >
                <Link to="/"><span>Back to login</span></Link>
            </Button>}
        />

    )
}