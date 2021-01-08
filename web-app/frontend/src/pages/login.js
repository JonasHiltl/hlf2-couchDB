import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMedia } from 'react-media';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';

import { Form, Input, Button, Checkbox, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { login } from '../store/actions/auth';


const { Text, Title  } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const successMessage = useSelector(state => state.successMessage);
  const errorMessage = useSelector(state => state.errorMessage);
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
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
  
  const handleCheckbox = e => {
      setFormData(({ rememberMe, ...formData }) =>
      ({ ...formData, rememberMe: !rememberMe })
      );
  };

  const { email, password, rememberMe } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isEnabled = email.length > 0 && password.length > 7

  const confirmMessage = Cookies.get('confirmMessage');
  const confirmationMessage = () => {
    message.success(confirmMessage);
  };

  const success = (message) => {
    message.success(message);
  };
  const error = (message) => {
    message.success(message);
  };

  const warning = () => {
    message.warning('You are already logged in');
  };

  const onSubmit = async () => {
    if (isAuthenticated === false) {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/account/login', {
            email: email,
            password: password,
            withcredentials: true
      });
      if (res.data.success === true) {
        message.success(res.data.message);
      } else if (res.data.success === false) {
        message.error(res.data.message);
      }
      setLoading(false);
    } else {
      warning()
    }
  }

  useEffect(() => {
    if(confirmMessage) {
      confirmationMessage();
    }
  }, [])

  //if (isAuthenticated)
  //  return <Redirect to='/' />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'space-between'}}>
      <Space direction="vertical" size={spaceXs} >
        <Title>EHR</Title>
        <Title level={2}>Log in to your account</Title>
        <Form 
          onFinish={onSubmit}
          initialValues={{
            remember: true,
          }}
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
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={e => onChange(e)}
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item initialValue={password} name="passwordFormItem" rules={[
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox onChange={e => handleCheckbox(e)} name="rememberMe" value={rememberMe}>Remember me</Checkbox>
            </Form.Item>
            <Form.Item>
              <Text>Don't have an account?<Link to='/register'> Register</Link></Text>
            </Form.Item>
          </div>
          <Button 
            type="primary"
            loading={loading}
            block
            disabled={!isEnabled}
            htmlType="submit">
            Login
          </Button>
        </Form>
        <Text>Forgot your Password?<Link to='/reset-password'> Reset Password</Link></Text>
      </Space>
    </div>
  );
};

export default Login;