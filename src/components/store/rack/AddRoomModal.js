import React,{useEffect} from 'react';
import PropTypes from "prop-types";
import {Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {useTranslation} from "react-i18next";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const AddRoomModal = ({
                        id,
                        offices,
                        onFinish,
                        onReset,
                        form,
                        officeId
                      }) => {
  React.useEffect(() => {
    form.setFieldsValue({
      roomCode:null,
      roomName:null,
      officeId:officeId

    });
  }, [officeId]);
  const { t } = useTranslation();

  return (
    <div>
      <Row>
        <Col
          sm={20} md={10}
        >
          <ARMForm
            form={form}
            name="store"
            {...layout}
            initialValues={{}}
            autoComplete="off"
            style={{
              backgroundColor: "#ffffff",
            }}
            onFinish={onFinish}
          >

            <Form.Item
              label={t("store.Rooms.Code")}
              name="roomCode"

              rules={[
                {
                  required: true,
                  message:t("store.Rooms.Please input Code !"),
                },
                {
                  max:t("common.Max"),
                  message: t("common.Maximum 255 characters allowed"),
                },
                {
                  whitespace: true,
                  message:t("common.Only space is not allowed"),
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label={t("store.Rooms.Name")}
              name="roomName"
              rules={[
                {
                  max:t("common.Max"),
                  message: t("common.Maximum 255 characters allowed"),
                },
                {
                  whitespace: true,
                  message:t("common.Only space is not allowed"),
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="officeId"
              label={t("store.Rooms.Store")}
              rules={[
                {
                  required: true,
                  message: t("store.Rooms.Please select store !"),
                },
              ]}
            >
              <Select allowClear placeholder="Select a store" disabled={true} >
                {offices?.map((store, key) => (
                  <Select.Option key={key} value={store.id}>
                    {store.code}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>


            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
              <Space>
                <ARMButton type="primary" htmlType="submit">
                  {id ? t("common.Update") : t("common.Submit")}
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
AddRoomModal.propTypes = {
  onFinish: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
export default AddRoomModal;