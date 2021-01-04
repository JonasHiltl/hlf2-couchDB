import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { Typography, Form, Tooltip, Input, Button, Space, message } from 'antd';
import { ArrowLeftOutlined,  EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from '@ant-design/icons';
import { resetPassword } from '../store/actions/auth';
import CenterItems from '../containers/CenterItems'

const { Title, Text } = Typography;

const ResetPasswordConfirm = ({ match }) => {
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [messageChanged, setMessageChanged] = useState(0);
    const successMessage = useSelector(state => state.successMessage);
    const errorMessage = useSelector(state => state.errorMessage);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    const isEnabled = new_password === re_new_password && new_password.length > 7

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const success = () => {
        message.success(successMessage);
    };
    
    const error = () => {
        message.error(errorMessage);
    };

    const onSubmit = async () => {
        setLoading(true);
        const resetLink = match.params.token
        const res = await axios.post('http://localhost:3000/account/reset-password/confirm', {
            resetLink: resetLink,
            password: new_password,
            withcredentials: true
        });
        if (res.data.success === true) {
            message.success(res.data.message);
        } else if (res.data.success === false) {
            message.error(res.data.message);
        }
        setRequestSent(true);
        setLoading(false);
    };

    useEffect(() => {
        if (errorMessage) {
            return error();
        }
        if (successMessage && !errorMessage) {
            return success()
        }
    }, [errorMessage ,successMessage, messageChanged]);
    return(
        <CenterItems>
            <div>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    <Tooltip title="back to Login">
                        <Link to='/login'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ArrowLeftOutlined style={{ fontSize: '18px', marginRight: '10px' }}/>
                                <Title style={{ margin: '0px'}}level={5}>Back</Title>
                            </div>
                        </Link>
                    </Tooltip>
                    <Title level={2}>Create new Password</Title>
                    <Text>Please choose your new password</Text>
                    <Form 
                        onFinish={onSubmit}
                        spellcheck="false"
                        >
                        <Form.Item name="newPasswordFormItem" rules={[
                            { 
                            required: true,
                            message: 'Please input your new Password!',
                            },
                            { 
                            min: 8,
                            message:'Minimum 8 characters!',
                            }
                            ]}
                            >
                            <Input.Password
                                size='large'
                                type='password'
                                placeholder='New Password'
                                name='new_password'
                                value={new_password}
                                onChange={e => onChange(e)}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                prefix={<LockOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        <Form.Item name="confirmPasswordFormItem" rules={[
                            { 
                            required: true,
                            message: 'Please confirm your Password!',
                            },
                            { 
                            min: 8,
                            message:'Minimum 8 characters!',
                            }
                            ]}
                            >
                            <Input.Password
                                size='large'
                                type='password'
                                placeholder='Confirm Password'
                                name='re_new_password'
                                value={re_new_password}
                                onChange={e => onChange(e)}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                prefix={<LockOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        <Form.Item>
                            <PasswordStrengthMeter password={new_password}/>
                        </Form.Item>
                        <Button 
                            type="primary"
                            loading={loading}
                            block
                            disabled={!isEnabled}
                            htmlType="submit">
                            Set new Password
                        </Button>
                    </Form>
                </Space>
            </div>
        </CenterItems>
    );
};

export default (ResetPasswordConfirm);