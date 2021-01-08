import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';

import LeftSider from '../components/Sider'
import { Layout } from 'antd';

const Index = () => {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const user = useSelector(state => state.user);
      
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <LeftSider/>
                {isAuthenticated? 
                    `Hallo ${user.firstName}, du bist eingeloggt`:
                    'Ich bin nicht eingeloggt'
                }
        </Layout>
    );
};

export default Index;