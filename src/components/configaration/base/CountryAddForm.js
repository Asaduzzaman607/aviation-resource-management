import React from 'react';
import {Col, Form, Input, Row, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const CountryAddForm = ({form,onFinish,id,onReset}) => {

  return (
    <Row>
      <Col sm={20} md={10}>
        <ARMForm
          {...layout}
          form={form}
          name="country"
          onFinish={onFinish}
          initialValues={{
            isActive: false,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                message: ' Code is required!',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed!',
              },
              {
                max: 255,
                message: 'Maximum 255 characters allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Name is required!',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed!',
              },
              {
                max: 255,
                message: 'Maximum 255 characters allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dialingCode"
            label="Dialing Code"
            rules={[
              {
                required: true,
                message: 'Dialing code is required!',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed!',
              },
              {
                max: 4,
                message: 'Maximum 4 characters allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Space size="small">
              <ARMButton type="primary" htmlType="submit">
                {id ? 'Update' : 'Submit'}
              </ARMButton>
              <ARMButton onClick={onReset} type="primary" danger>
                Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </ARMForm>
      </Col>
    </Row>
  );
};

export default CountryAddForm;