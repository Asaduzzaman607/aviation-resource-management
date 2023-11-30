import { useTranslation } from "react-i18next";
import { Form, Input, Space, Row, Col } from "antd";
import { formLayout } from "../../../../lib/constants/form";
import ARMButton from "../../../common/buttons/ARMButton";
import PropTypes from "prop-types";
import ARMForm from "../../../../lib/common/ARMForm";


export default function AddTaskTypeForm({onFinish, form, onReset, id}) {
  const {t} = useTranslation()
  return (
    <ARMForm
      {...formLayout}
      form={form}
      name="taskType"
      onFinish={onFinish}
      initialValues={{
        name: "",
        description: "",
        isActive: false,
      }}
      scrollToFirstError
    >
      <Row>
        <Col sm={20} md={10}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
              {
                max: 255,
                message: t("common.Maximum 255 characters allowed"),
              },
              {
                whitespace: true,
                message: t("common.Only space is not allowed")
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: false,
                message: 'Description is missing',
              },
            ]}
          >
            <Input.TextArea maxLength={255} />
          </Form.Item>

        </Col>
      </Row>

      <Row>
        <Col sm={20} md={10}>
          <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
            <Space>
              <ARMButton size="medium" type="primary" htmlType="submit">
                {id ? t("common.Update") : t("common.Submit")}
              </ARMButton>
              <ARMButton onClick={onReset} size="medium" type="primary" danger>
                Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </ARMForm>
  );
}

AddTaskTypeForm.defaultProps = {
  id: null
}

AddTaskTypeForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  id: PropTypes.any
};
