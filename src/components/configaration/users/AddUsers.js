import { Breadcrumb, Col, Form, Input, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import useUsers from '../../../lib/hooks/users/useUsers';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import EmployeeSelect from './EmployeeSelect';
import { useEmployees } from './useEmployees';
import UserRoleSelect from './UserRoleSelect';

const { Option } = Select;

export default function AddUsers() {
  const {
    initFetchEmployees,
    findEmployeeById,
    fetchEmployeeList,
    setEmployee,
  } = useEmployees();

  useEffect(() => {
    (async () => {
      await initFetchEmployees();
    })();
  }, []);

  const {
    onFinish,
    form,
    id,
    handleChange,
    roleData,
    onReset,
    handleResetPassword,
    isResettingPassword,
  } = useUsers();

  const employeeId = Form.useWatch('employeeId', form);

  useEffect(() => {
    if (!employeeId) {
      return;
    }

    const employee = findEmployeeById(Number(employeeId));
    const {
      name,
      email,
      officeMobile: mobile,
      officePhone: phoneNumber,
      designation,
      department,
      section,
    } = employee;

    form.setFieldsValue({
      name,
      email,
      mobile,
      phoneNumber,
      position: designation.name,
      department: department.name,
      section: section.name,
    });
  }, [employeeId]);

  const title = id ? 'User Update' : 'User Add';

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/configurations">
              <i className="fas fa-cog" /> &nbsp;Configurations
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/configurations/users">Users</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          'CONFIGURATION_ADMINISTRATION_USERS_SAVE',
          'CONFIGURATION_ADMINISTRATION_USERS_EDIT',
        ]}
      >
        <ARMCard title={getLinkAndTitle(title, '/configurations/users', false)}>
          <ARMForm
            form={form}
            name="basic"
            labelCol={{
              span: 12,
            }}
            wrapperCol={{
              span: 12,
            }}
            initialValues={{
              remember: true,
              employeeId: null,
              email: null,
            }}
            autoComplete="off"
            style={{
              backgroundColor: '#ffffff',
            }}
            onFinish={onFinish}
            onReset={onReset}
          >
            <Row
              gutter={[6, 6]}
              justify="center"
            >
              <Col
                className="gutter-row"
                lg={12}
                xl={12}
                md={12}
                sm={24}
                xs={24}
              >
                {!id && (
                  <Form.Item
                    label="Employee"
                    name="employeeId"
                    rules={[
                      {
                        required: true,
                        message: 'Please select an employee!',
                      },
                    ]}
                  >
                    <EmployeeSelect
                      placeholder="Select an employee"
                      fetchOptions={fetchEmployeeList}
                      style={{ width: '100%' }}
                      showSearch={true}
                    />
                  </Form.Item>
                )}

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
              </Col>

              <Col
                className="gutter-row"
                lg={12}
                xl={12}
                md={12}
                sm={24}
                xs={24}
              >
                <UserRoleSelect
                  handleChange={handleChange}
                  roles={roleData}
                />

                <Form.Item
                  label="Login"
                  name="login"
                  rules={[
                    {
                      required: true,
                      message: 'Please input login info',
                    },
                    {
                      min: 4,
                      message: 'Minimum 4 character required!',
                    },
                  ]}
                >
                  <Input />
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
              </Col>
              <Col
                className="gutter-row"
                lg={12}
                xl={12}
                md={12}
                sm={24}
                xs={24}
              >
                <Form.Item>
                  <Space>
                    <ARMButton
                      type="primary"
                      htmlType="submit"
                    >
                      {id ? 'Update' : 'Submit'}
                    </ARMButton>

                    <ARMButton
                      onClick={onReset}
                      type="primary"
                      danger
                    >
                      Reset
                    </ARMButton>

                    <ARMButton
                      onClick={handleResetPassword}
                      disabled={isResettingPassword}
                      type="primary"
                    >
                      Reset Password
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </ARMForm>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
