import React from 'react';
import { Button, Layout, Menu, Space } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export const TaskHome = () => {
  return (

        
        <Content style={{ padding: '50px', textAlign: 'center', minHeight: '100vh'}}>
          <Space direction="horizontal" size="large">
            <Button type="primary" style={{ width: '200px', height: '80px', fontSize: '20px' }}>
              <Link to="/io-request">IO Request</Link>
            </Button>
            <Button type="primary" style={{ width: '200px', height: '80px', fontSize: '20px' }}>
              <Link to="/app/check-request-details">Inventory Check</Link>
            </Button>
          </Space>
        </Content>

  
  );
};

export default TaskHome;
