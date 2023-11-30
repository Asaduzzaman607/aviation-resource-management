import { Breadcrumb, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import { useDepartment } from './useDepartment';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const DepartmentAdd = () => {
  const { id, form, onFinish, onReset } = useDepartment();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-users" />
            <Link to="/employees">&nbsp; employees</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/employees/departments">&nbsp;Departments</Link>
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
            id ? 'Update Departments' : 'Add Departments',
            '/employees/departments'
          )}
        >
          <ARMForm
            {...layout}
            form={form}
            name="departments"
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
                  name="companyId"
                  label="Company"
                  rules={[
                    {
                      required: true,
                      message: 'Company is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="code"
                  label="Code"
                  rules={[
                    {
                      required: true,
                      message: 'Code is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="info"
                  label="Info"
                >
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  style={{ marginTop: '10px' }}
                  wrapperCol={{ ...layout.wrapperCol,offset:8}}
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
  );
};

export default DepartmentAdd;
