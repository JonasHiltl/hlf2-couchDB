import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';

import { message } from 'antd';

const Index = () => {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const user = useSelector(state => state.user);
      
    return (
        <div>
            {isAuthenticated? 
                `Hallo ${user.firstName}, du bist eingeloggt`:
                'Ich bin nicht eingeloggt'
            }

        </div>
    );
};

export default (Index);