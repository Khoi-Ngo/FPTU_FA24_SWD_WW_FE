import { useRouteError } from "react-router-dom";
import { Link, NavLink } from 'react-router-dom';
import { Button, Result } from 'antd';


export default function ErrorPage() {
  const error = useRouteError();
 

  return (

    <Result
      status={error.status}
      title="Ooopppps!!!!"
      subTitle={error.statusText || error.message}
      extra={<Button type="primary" >
        <Link to="/"><span>Back to homepage</span></Link>
      </Button>}
    />
  );
}