import React from 'react';
import ARMForm from "../../../lib/common/ARMForm";
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import {useTranslation} from "react-i18next";

const StockRoomForm = ({ id,form, offices, onFinish, onReset,setShowModal }) => {
  const { Option } = Select;
  const { TextArea } = Input;

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  const { t } = useTranslation();

  console.log("Offices=======",offices)
  return (
    <ARMForm
      {...layout}
      form={form}
      name="basic"
      onFinish={onFinish}
      initialValues={{}}
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
            name="stockRoomCode"
            label="Code"
            rules={[
              {
                required: true,
                message: 'Code is required!',
              },
              {
                max: 255,
                message: 'Maximum 255 characters allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="officeId"
            label={t("store.Rooms.Store")}

            rules={[{
              required: true, message:t("store.Rooms.Please select store !"),
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

          <Form.Item
            name="stockRoomNo"
            label="Stock Room No."
            rules={[
              {
                required: true,
                message: 'Stock Room No. required!',
              },
              {
                max: 255,
                message: 'Maximum 255 characters allowed',
              },
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="stockRoomDes"
            label="Description"
            rules={[
              {
                whitespace: true,
                message: 'Only space is not allowed',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Space size="small">
              <ARMButton
                type="primary"
                htmlType="submit"
              >
                {id?"Update":"Submit"}
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
  );
};

export default StockRoomForm;