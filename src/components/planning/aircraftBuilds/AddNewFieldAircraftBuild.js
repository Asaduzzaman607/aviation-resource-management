import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import PropTypes from "prop-types";
import { Option } from "antd/lib/mentions";
import { DoubleLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import moment from "moment";
import { boolean } from "yup/lib/locale";
import styled from "styled-components";

const AntdFormItem = styled(Form.Item)`
  .ant-col-16 {
    max-width: 100%;
  }
`;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AddNewFieldAircraftBuild = ({ formData, onFinish, onReset }) => {
  const { t } = useTranslation();
  const today = moment(new Date(), "YYYY-MM-DD");


  return (
    <div>
      <Row>
        <Col span={20}>
          <ARMForm
            {...layout}
            form={formData}
            name="New Aircraft Build"
            onFinish={onFinish}
            scrollToFirstError
            initialValues={{
              outDate: today,
              aircraftOutHour: "",
              aircraftOutCycle: "",
              outRefMessage: "",
              removalReason: "",
              checkLowerPart:false
            }}
          >
            <Form.Item
              name="outDate"
              label="Out Date"
              rules={[
                {
                  required: true,
                  message: "Please input out date",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }}  format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              name="aircraftOutHour"
              label="Aircraft out hour"
              rules={[
                {
                  required: true,
                  message: "Please input aircraft out hour",
                },
              ]}
            >
              <Input
                maxLength={9}
                type="number"
                onKeyDown={(e) => {
                  e.key === "-" && e.preventDefault();
                }}
              />
            </Form.Item>

            <Form.Item
              name="aircraftOutCycle"
              label="Aircraft out cycle"
              rules={[
                {
                  required: true,
                  message: "Please input aircraft out cycle",
                },
              ]}
            >
              <Input
                maxLength={9}
                type="number"
                onKeyDown={(e) => {
                  e.key === "-" && e.preventDefault();
                }}
              />
            </Form.Item>

            <Form.Item
              name="outRefMessage"
              label="Output Reference Message"
              rules={[
                {
                  required: false,
                  message: "Please input output reference message",
                },
                {
                  max: 255,
                  message: "Maximum 255 characters allowed!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="removalReason"
              label="Removal Reason"
              rules={[
                {
                  required: false,
                  message: "Please input removal reason",
                },
                {
                  max: 255,
                  message: "Maximum 255 characters allowed!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <AntdFormItem>
              <Form.Item
                name="checkLowerPart"
                valuePropName="checked"
                style={{
                  marginLeft:"180px",
                  marginBottom:"2px"
                }}
                rules={[
                  {
                    type: boolean,
                  },
                ]}
              >
                <Checkbox>Inactive all immediate lower part ( If available )</Checkbox>
              </Form.Item>
            </AntdFormItem>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Space size="small">
                <ARMButton type="primary" htmlType="submit">
                  {t("common.Submit")}
                </ARMButton>
                <ARMButton onClick={onReset} type="primary" danger>
                  {t("common.Reset")}
                </ARMButton>
              </Space>
            </Form.Item>
          </ARMForm>
        </Col>
      </Row>
    </div>
  );
};

AddNewFieldAircraftBuild.propTypes = {
  form: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
  // id: PropTypes.number,
  onReset: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

export default AddNewFieldAircraftBuild;
