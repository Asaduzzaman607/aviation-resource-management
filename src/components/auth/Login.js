import { LockOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Row } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {
  default as currentAppVersion,
  default as packageJson,
} from '../../../package.json';
import ARMForm from '../../lib/common/ARMForm';
import { notifyError, notifySuccess } from '../../lib/common/notifications';
import { setMenu } from '../../reducers/menu.reducers';
import { setUser } from '../../reducers/user.reducers';
import User from '../../service/UserService';
import ARMCard from '../common/ARMCard';
import logInBackgroundImage from '../images/logInBackgroundImage1.jpg';
import logo from '../images/logo.svg';
import EmptyLayout from '../layout/EmptyLayout';

export default function Login() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);

  if (isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const onFinish = (values) => {
    setLoading(true);
    User.signin(values)
      .then((response) => {
        localStorage.setItem('userId', `${response.data.id}`);
        localStorage.setItem('token', `${response.data.token}`);
        localStorage.setItem('refreshToken', `${response.data.refreshToken}`);
        localStorage.setItem('currentAppVersion', currentAppVersion.version);

        console.log('login data', response.data);
        console.log('currentAppVersion: ', currentAppVersion.version);

        setLoading(false);
        dispatch(setUser(response.data));
        dispatch(setMenu({ key: '' }));
        notifySuccess('Successfully login');
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        notifyError('Username or password invalid');
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <EmptyLayout>
      <Row
        justify="center"
        align="middle"
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${logInBackgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
          }}
        ></div>
        <ARMCard
          style={{
            zIndex: 999,
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-40px',
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: '200px',
                height: '200px',
                marginTop: '-40px',
                marginBottom: '-70px',
              }}
            />
          </div>
          <Divider>
            <h2>Log In</h2>
          </Divider>
          <ARMForm
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div>
              <Form.Item
                label="Username"
                name="login"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 15,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  padding: '0 30px',
                  borderRadius: '17px',
                  marginLeft: '-20px',
                }}
              >
                <LockOutlined />
                Login
              </Button>
            </Form.Item>
          </ARMForm>
        </ARMCard>
      </Row>
      <footer className={'versionCustom'}> v{packageJson.version}</footer>
    </EmptyLayout>
  );
}
