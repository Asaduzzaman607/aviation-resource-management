import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import React from "react";
import ARMButton from "../../common/buttons/ARMButton";
import ARMForm from "../../../lib/common/ARMForm";
import {useTranslation} from "react-i18next";

const layout = {
  labelCol: {
    span: 8,
  }, wrapperCol: {
    span: 16,
  },
};
const {Option} = Select;
const SaveRoom = ({
                    id, offices, onFinish, form, onReset, setShowModal
                  }) => {
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  const {t} = useTranslation();
  return (<div>
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

            rules={[{
              required: true, message: t("store.Rooms.Please input Code !"),
            }, {
              max: t("common.max"), message: t("common.Maximum 255 characters allowed"),
            }, {
              whitespace: true, message: t("common.Only space is not allowed"),
            },]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={t("store.Rooms.Name")}
            name="roomName"
            rules={[{
              max: t("common.max"), message: t("common.Maximum 255 characters allowed"),
            }, {
              whitespace: true, message: t("common.Only space is not allowed"),
            },]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="officeId"
            label={t("store.Rooms.Store")}

            rules={[{
              required: true, message: t("store.Rooms.Please select store !"),
            },]}
          >
            <Select allowClear placeholder={t("store.Rooms.Select a store")}
                    showSearch
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    dropdownRender={(menu) => (<>
                      <Button
                        style={{width: "100%"}}
                        type="primary"
                        onClick={() => setShowModal(true)}
                      >
                        + Add Store
                      </Button>
                      {menu}
                    </>)}>
              {offices?.map((store, key) => (<Option key={key} value={store.id}>
                {store.code}
              </Option>))}
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
  </div>);
};

export default SaveRoom;
