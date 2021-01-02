import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';

import { message } from 'antd';


const Index = () => {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const successMessage = useSelector(state => state.successMessage);

    const success = () => {
        message.success(successMessage);
      };

    useEffect(async () => {
        if (successMessage) {
            success()
        }
        const res = await axios.get('http://localhost:3000/account/users/me', {withcredentials: true});
        console.log(res);
    }, []);
    return (
        <div>
            {isAuthenticated? 
                'Ich bin eingeloggt':
                'Ich bin nicht eingeloggt'
            }

        </div>
    );
};

export default (Index);