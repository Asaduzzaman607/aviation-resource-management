import { Breadcrumb, Col, Form, Input, Row, Space } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';
import { useEmployee } from './useEmployee';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { TextArea } = Input;

const EmployeeAdd = () => {
  const { id, form, onFinish, onReset, loading } = useEmployee();

  const [dept, setDept] = useState();
  const [section, setSection] = useState();

  return (
    <>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-users" />
              <Link to="/employees">&nbsp; employees</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/employees/employee">&nbsp;Employees</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <Permission
          permission={[
            'MATERIAL_MANAGEMENT_QUOTE_REQUEST_QUOTATION_SAVE',
            'MATERIAL_MANAGEMENT_QUOTE_REQUEST_QUOTATION_EDIT',
          ]}
        >
          <ARMCard
            title={getLinkAndTitle(
              id ? 'Update Employee' : 'Add Employee',
              '/employees/employee'
            )}
          >
            <ARMForm
              {...layout}
              form={form}
              name="employee"
              initialValues={{}}
              onFinish={onFinish}
              autoComplete="off"
              style={{
                backgroundColor: '#ffffff',
              }}
            >
              <Row>
                <Col
                  sm={20}
                  md={10}
                >
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      {
                        required: true,
                        message: 'Name is required',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="departmentId"
                    label="Department"
                    rules={[
                      {
                        required: true,
                        message: 'Department is required!',
                      },
                    ]}
                  >
                    <DebounceSelect
                      mapper={(v) => ({
                        label: v.name,
                        value: v.id,
                      })}
                      showSearch
                      placeholder="--- Select Department ---"
                      type="multi"
                      url={`/department/search?page=1&size=20`}
                      onChange={(e) => setDept(e)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="sectionId"
                    label="Section"
                    rules={[
                      {
                        required: true,
                        message: 'Section is required!',
                      },
                    ]}
                  >
                    <DebounceSelect
                      mapper={(v) => ({
                        label: v.name,
                        value: v.id,
                      })}
                      showSearch
                      placeholder="--- Select Section ---"
                      type="multi"
                      url={`/section/search?page=1&size=20`}
                      params={{ id: dept }}
                      onChange={(e) => setSection(e)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="designationId"
                    label="Designation"
                    rules={[
                      {
                        required: true,
                        message: 'Designation is required!',
                      },
                    ]}
                  >
                    <DebounceSelect
                      mapper={(v) => ({
                        label: v.name,
                        value: v.id,
                      })}
                      showSearch
                      placeholder="--- Select Designation ---"
                      type="multi"
                      url={`/designation/search?page=1&size=20`}
                      params={{ id: section }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="code"
                    label="Code"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="fatherName"
                    label="Father Name"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="motherName"
                    label="Mother Name"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="nationalId"
                    label="National ID"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="passport"
                    label="Passport"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="presentAddress"
                    label="Present Address"
                  >
                    <TextArea />
                  </Form.Item>
                </Col>

                <Col
                  sm={20}
                  md={10}
                >
                  <Form.Item
                    name="activationCode"
                    label="Activation Code"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: 'Email is required!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="officePhone"
                    label="Office Phone"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="officeMobile"
                    label="Office Mobile"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="residentPhone"
                    label="Resident Phone"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="residentMobile"
                    label="Resident Mobile"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="bloodGroup"
                    label="Blood Group"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="permanentAddress"
                    label="Permanent Address"
                  >
                    <TextArea rows={5} />
                  </Form.Item>
                </Col>
              </Row>

              <Row style={{ marginLeft: '85px' }}>
                <Col
                  sm={20}
                  md={10}
                >
                  <Form.Item
                    style={{ marginTop: '10px' }}
                    wrapperCol={{ ...layout.wrapperCol }}
                  >
                    <Space size="small">
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
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </ARMForm>
          </ARMCard>
        </Permission>
      </CommonLayout>
    </>
  );
};

export default EmployeeAdd;
