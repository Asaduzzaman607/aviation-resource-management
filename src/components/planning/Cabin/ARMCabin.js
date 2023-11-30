import { Form, Input } from 'antd';
import { t } from 'i18next';
import React from 'react';
import ARMForm from '../../../lib/common/ARMForm';
import ARMButton from '../../common/buttons/ARMButton';
import { formLayout as layout } from '../../../lib/constants/layout';

const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  

const ARMCabin = ({ id, form, onFinish, onReset }) => {
    return (
        <ARMForm {...layout} form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                  name={["code"]}
                  label={t("planning.Cabins.Cabin Code")}
                  rules={[
                    {
                      required: true,
                    },
                    {
                      max: 1,
                      message: t("planning.Cabins.Cabin code should not be more than 1 character"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={["title"]}
                  label={t("planning.Cabins.Title")}
                  rules={[
                    {
                      required: true,
                    },
                    {
                      whitespace: true,
                      message: t("common.Only space is not allowed")
                    },
                    {
                      max: 255,
                      message: t("common.Maximum 255 characters allowed"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <ARMButton type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>{" "}
                  <ARMButton onClick={onReset} type="primary" danger>
                    {t("common.Reset")}
                  </ARMButton>
                </Form.Item>
              </ARMForm>
    );
};

export default ARMCabin;