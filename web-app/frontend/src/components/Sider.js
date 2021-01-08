import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

import NameIcon from './SidebarComps/NameIcon'

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Text, Title } = Typography;

const LeftSider = () => {
    const [collapsed, setCollapsed] = useState(false);    

    const onCollapse = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div>
            <Sider collapsible collapsed={collapsed} theme="light" onCollapse={onCollapse}>
                <NameIcon/>
                <Menu defaultSelectedKeys={['1']} mode="inline" theme="light">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    <Link to='/#'>Option 1</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    <Link to='/#'>option 2</Link>
                </Menu.Item>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    <Link to='/#'>option 3</Link>
                </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout" >
            </Layout>
        </div>
    )
};

export default LeftSider;