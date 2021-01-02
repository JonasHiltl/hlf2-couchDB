import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMedia } from 'react-media';

import { Form, Input, Button, Space, Typography, Tooltip, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
//import { signup } from '../store/actions/auth';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { ReactComponent as EmailIcon } from '../assets/EmailIcon.svg';
import { register } from '../store/actions/auth'

const { Text, Title  } = Typography;

const SignUp = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [emailSend, setEmailSend] = useState(false);
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        re_password: '',
        terms: false
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
    const spaceXs = matches.xs ? 0 : 24;

    const { firstName, lastName, email, password, re_password, terms } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    var mailformat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const buttonIsEnabled = email.match(mailformat) && password.length > 7 && password === re_password && firstName.length > 0 && lastName.length > 0 && terms === true;

    const successMessage = (responseMessage) => {
        message.success(responseMessage);
    };
    
    const errorMessage = (responseMessage) => {
        message.error(responseMessage);
    };

    const serverErrorMessage = (errorMessage) => {
        message.error(errorMessage);
    };

    const onSubmit = () => {
        setLoading(true);
        dispatch(register(firstName, lastName, email, password));
        setLoading(false);
        setEmailSend(true)
      }
  
    const handleCheckbox = e => {
        setFormData(({ terms, ...formData }) =>
          ({ ...formData, terms: !terms })
        );
      };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between'}}>
            { emailSend?
                <Space direction="vertical" size={30} style={{ width: '100%' }}>
                    <Space direction="vertical" size={45} style={{ width: '100%' }}>
                        <Tooltip title="back to Login">
                            <Link to='/login'>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ArrowLeftOutlined style={{ fontSize: '18px', marginRight: '10px' }}/>
                                    <Title style={{ margin: '0px'}}level={5}>Back</Title>
                                </div>
                            </Link>
                        </Tooltip>
                        <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                            {<EmailIcon style={{ height: '90px'}}/>}
                        </div>
                    </Space>
                    <Title style={{ textAlign: 'center' }}level={2}>Please activate your Account</Title>
                    <div style={{ textAlign: 'center'}}>
                        <Text >We have sent you your email activation link to your email.</Text>
                    </div>
                </Space>:
                <Space 
                    direction="vertical"
                    size={spaceXs} 
                    style={{ width: '100%' }}
                >
                    <Title>EHR</Title>
                    <Title level={2}>Create your account</Title>
                    <Form 
                        onFinish={onSubmit}
                        spellcheck="false"
                        >
                        <div style={{ display: 'flex', width: '100%' }}>
                            <Space style={{ width: '100%', justifyContent: 'space-between'}}>
                                <Form.Item
                                    name='firstNameFormItem'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your first Name!',
                                        },
                                    ]}
                                    >
                                    <Input 
                                        size="large" 
                                        placeholder='first Name'
                                        name='firstName'
                                        autoComplete='given-name'
                                        value={firstName}
                                        onChange={e => onChange(e)}
                                        prefix={<UserOutlined />}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name='lastNameFormItem'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your last Name!',
                                        },
                                    ]}
                                    >
                                    <Input 
                                        size="large" 
                                        placeholder='last Name'
                                        autoComplete='family-name'
                                        name='lastName'
                                        value={lastName}
                                        onChange={e => onChange(e)}
                                    />
                                </Form.Item>
                            </Space>
                        </div>
                        <Form.Item
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
                                type='email'
                                autoComplete='email'
                                placeholder='Email'
                                name='email'
                                value={email}
                                onChange={e => onChange(e)}
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>
                        <Form.Item 
                            name="passwordFormItem" 
                            rules={[
                                { 
                                    required: true,
                                    message: 'Please input your Password!',
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
                                placeholder='Password'
                                name='password'
                                value={password}
                                onChange={e => onChange(e)}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                prefix={<LockOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        <Form.Item 
                            name="confirmPasswordFormItem" 
                            rules={[
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
                                    name='re_password'
                                    value={re_password}
                                    onChange={e => onChange(e)}
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                />
                            </Form.Item>
                        <Form.Item>
                            <PasswordStrengthMeter password={password}/>
                        </Form.Item>
                        <Form.Item name="terms" valuePropName="checked">
                            <Checkbox name="terms" onChange={e => handleCheckbox(e)} value={terms}>I accept the <Link to='!#'>Terms of service</Link> and privacy policy</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                type="primary"
                                loading={loading}
                                block
                                disabled={!buttonIsEnabled}
                                htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Text>Alredy have an account?<Link to='/login'> Login</Link></Text>
                        </Form.Item>
                    </Form>
                </Space>
        }
        </div>
        
    );
};

export default (SignUp);