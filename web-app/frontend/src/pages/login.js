import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMedia } from 'react-media';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

import { Form, Input, Button, Checkbox, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { login } from '../store/actions/auth';


const { Text, Title  } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(Cookies.get('confirmMessage'));
  const successMessage = useSelector(state => state.successMessage);
  const errorMessage = useSelector(state => state.errorMessage);
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const dispatch = useDispatch();

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

  const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: true
  });

  const handleCheckbox = e => {
      setFormData(({ rememberMe, ...formData }) =>
      ({ ...formData, rememberMe: !rememberMe })
      );
  };

  const { email, password, rememberMe } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isEnabled = email.length > 0 && password.length > 7

  const confirmationMessage = (confirmMessage) => {
    message.success(confirmMessage);
  };

  const success = () => {
    message.success(successMessage);
  };

  const error = () => {
    message.error(errorMessage);
  };

  const warning = () => {
    message.warning('You are already logged in');
  };

  const onSubmit = () => {
    if (isAuthenticated === false) {
      setLoading(true);
      dispatch(login(email, password));
      setLoading(false);
      if (errorMessage) {
        return error();
      }
      if (successMessage && !errorMessage.length > 2) {
        return success()
      }
    } else {
      warning()
    }
  }

  useEffect(() => {
    if (confirmMessage) {
      confirmationMessage(confirmMessage)
    }
  }, []);

  if (isAuthenticated)
    return <Redirect to='/' />;

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
        <Text>Forgot your Password?<Link to='/reset_password'> Reset Password</Link></Text>
      </Space>
    </div>
  );
};

export default (Login);