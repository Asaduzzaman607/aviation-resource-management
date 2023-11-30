import { Breadcrumb, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import CommonLayout from '../../layout/CommonLayout';
import { useSection } from './useSection';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const SectionAdd = () => {
  const { id, form, onFinish, onReset } = useSection();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-users" />
            <Link to="/employees">&nbsp; employees</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/employees/sections">&nbsp;Sections</Link>
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
            id ? 'Update Sections' : 'Add Sections',
            '/employees/sections'
          )}
        >
          <ARMForm
            {...layout}
            form={form}
            name="sections"
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
                  />
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
  );
};

export default SectionAdd;
