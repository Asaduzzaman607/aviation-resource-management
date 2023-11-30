import { Breadcrumb, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import ARMForm from '../../../lib/common/ARMForm';
import {
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import { useParamsId } from '../../../lib/hooks/common';
import { removeUser } from '../../../reducers/user.reducers';
import { clearReduxData } from '../../../resetPersist';
import UsersService from '../../../service/UsersService';
import store from '../../../store';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import { resetState } from '../../../reducers/paginate.reducers';

const { Option } = Select;

export interface User {
  id: number;
  login: string;
  roleId: number;
  roleName: string;
  name: string;
  email: string;
  phoneNumber: string;
  mobile: string;
  position: string;
  department: string;
  section: string;
  createdAt: string;
  isActive: boolean;
}

export default function Profile() {
  const userId = useParamsId('userId');
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordForm] = Form.useForm();
  const [loginNameForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const handleLogOut = async () => {
    try {
      await UsersService.logOut();
      clearReduxData();
      dispatch(resetState());
      dispatch(removeUser({}));
      navigate('/login');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const { data } = await UsersService.getSingleUser(userId);
      setUser({ ...data });
      loginNameForm.setFieldsValue({ login: data?.login });
      profileForm.setFieldsValue({ ...data });
    })();
  }, [userId]);

  const onFinish = async (values: any) => {
    await UsersService.changePassword(values, userId);
    notifySuccess('Password updated successfully');
    await handleLogOut();
  };

  const onFinishFailed = (error: any) => {
    notifyResponseError(error);
  };

  const handleLoginChangeSubmit = async (values: any) => {
    await UsersService.changeLogin(values, userId);
    notifySuccess('Login name updated successfully');
    await handleLogOut();
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/configurations">
              <i className="fas fa-cog" /> &nbsp;Configurations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>User Profile</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title="User Profile">
        <Row>
          <Col span={12}>
            <ARMForm
              form={loginNameForm}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={handleLoginChangeSubmit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Login Name"
                name="login"
                rules={[
                  {
                    required: true,
                    message: 'Login name is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <ARMButton
                  type="primary"
                  htmlType="submit"
                >
                  Update Login Name
                </ARMButton>
              </Form.Item>
            </ARMForm>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={12}>
            <ARMForm
              form={profileForm}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={() => null}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phoneNumber"
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Mobile"
                name="mobile"
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Designation"
                name="position"
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Department"
                name="department"
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Section"
                name="section"
              >
                <Input readOnly />
              </Form.Item>
            </ARMForm>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={12}>
            <ARMForm
              form={passwordForm}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Current Password"
                name="previousPassword"
                rules={[
                  {
                    required: true,
                    message: 'Current Password is required',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: 'Password is required!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const password = getFieldValue('newPassword');

                      if (password !== value) {
                        return Promise.reject(
                          new Error("Password doesn't match!")
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <ARMButton
                  type="primary"
                  htmlType="submit"
                >
                  Change Password
                </ARMButton>
              </Form.Item>
            </ARMForm>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
}
