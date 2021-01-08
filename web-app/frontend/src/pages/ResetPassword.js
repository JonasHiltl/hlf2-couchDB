import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMedia } from 'react-media';
import axios from 'axios';

import { forgotPassword } from '../store/actions/auth';
import { Typography, Form, Input, Tooltip, Button, Space, message } from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ReactComponent as EmailIcon } from '../assets/EmailIcon.svg';

const { Title, Text } = Typography;

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const GLOBAL_MEDIA_QUERIES = {
        xs: "(max-width: 480px)",
        sm: "(max-width: 576px)",
        md: "(max-width: 768px)",
        lg: "(max-width: 992px)",
        xl: "(max-width: 1200px)",
        xxl: "(max-width: 1600px)",
    };
    const matches = useMedia({ queries: GLOBAL_MEDIA_QUERIES });
    const spaceXs = matches.xs ? 24 : 24;

    const { email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    var mailformat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEnabled = email.match(mailformat) ;

    const success = message => {
        message.success(message);
    };
    
    const error = message => {
        message.error(message);
    };

    const onSubmit = async () => {
        setLoading(true);
        const res = await axios.put('http://localhost:3000/account/reset-password', {
            email: email,
            withcredentials: true
        });
        if (res.data.success === true) {
            setRequestSent(true);
            message.success(res.data.message);
        } else if (res.data.success === false) {
            message.error(res.data.message);
        }
        setLoading(false);
    };

    return (
        <div>
            { requestSent?
                <div>
                    <Space direction="vertical" size={spaceXs} style={{ width: '100%' }}>
                        <Tooltip title="back to Login">
                            <Link to='/login'>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ArrowLeftOutlined style={{ fontSize: '18px', marginRight: '10px' }}/>
                                    <Title style={{ margin: '0px'}}level={5}>Back</Title>
                                </div>
                            </Link>
                        </Tooltip>
                        <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                            <EmailIcon style={{ height: '90px'}}/>
                        </div>
                        <Title style={{ textAlign: 'center' }}level={2}>Check your Email</Title>
                        <div style={{ textAlign: 'center'}}>
                            <Text >We have sent you your password recovery instructions to your email.</Text>
                        </div>
                    </Space>
                </div>:
                <div>
                    <Space direction="vertical" size={spaceXs} style={{ width: '100%' }}>
                        <Tooltip title="back to Login">
                            <Link to='/login'>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ArrowLeftOutlined style={{ fontSize: '18px', marginRight: '10px' }}/>
                                    <Title style={{ margin: '0px'}}level={5}>Back</Title>
                                </div>
                            </Link>
                        </Tooltip>
                        <Title level={2}>Forgot your Password?</Title>
                        <Text>We'll send a recovery link to your E-mail address.</Text>
                        <Form 
                            onFinish={onSubmit}
                            spellCheck="false"
                            >
                            <Form.Item
                            initialValue={email}
                            name='emailFormItem' 
                            rules={[
                                {
                                type: 'email',
                                message: 'The input is not a valid E-mail!',
                                },
                                {
                                required: true,
                                message: 'Please input your E-mail!',
                                },
                            ]}
                            >
                                <Input 
                                    size="large" 
                                    placeholder='Email'
                                    name='email'
                                    value={email}
                                    onChange={e => onChange(e)}
                                    prefix={<UserOutlined />}
                                />
                            </Form.Item>
                            <Button 
                                type="primary"
                                loading={loading}
                                block
                                disabled={!isEnabled}
                                htmlType="submit">
                                Reset Password
                            </Button>
                        </Form>
                    </Space>
                </div>
            }
        </div>
    );
};

export default ResetPassword;