import React, { useState } from 'react';
import CommonLayout from '../../layout/CommonLayout';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import { Breadcrumb, Col, Form, Row, Select, Space } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ARMCard from '../../common/ARMCard';
import ARMForm from '../../../lib/common/ARMForm';
import ARMButton from '../../common/buttons/ARMButton';
import TextArea from 'antd/lib/input/TextArea';
import useCS from '../ComparativeStatement/useCS';

const PurchaseOrderReport = () => {
  const { Option } = Select;
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfqShipment, setRfqShipment] = useState([12121]);
  const [form] = Form.useForm();
  const { allQuotations } = useCS();

  console.log('q: ', allQuotations);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onFinish = (value) => {
    console.log('submit', value);
    navigate('/material-management/purchase-order-report-print', {
      state: { value },
    });
  };
  const onReset = () => {
    form.resetFields();
  };
  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <Link to="/material-management">
                <i className="fas fa-shopping-basket" /> &nbsp;Material
                Management
              </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to={'/material-management/purchase-order-report-list'}>
                Purchase Order Report
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <ARMCard title={'Purchase Order Report'}>
          <ARMForm
            {...layout}
            form={form}
            name="basic"
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
                  name="rfq"
                  label="RFQ"
                >
                  <Select
                    placeholder="Select RFQ"
                    allowClear
                  >
                    {allQuotations?.map((data) => (
                      <Option
                        key={data.id}
                        value={data.id}
                      >
                        {data.rfqNo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="tC"
                  label="Terms and Condition"
                >
                  <TextArea
                    style={{ width: '700px' }}
                    rows={8}
                    maxLength={1000}
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
                  wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
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
      </CommonLayout>
    </div>
  );
};

export default PurchaseOrderReport;
