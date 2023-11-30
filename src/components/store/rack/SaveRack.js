import React from 'react';
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {useTranslation} from "react-i18next";


const SaveRack = ({
                    id,
                    layout,
                    offices,
                    rooms,
                    onFinish,
                    form,
                    onReset,
                    setShowModal,
                    isRoomDisabled,
                    setRoomModal
                  }) => {
  const {Option} = Select;

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const {t} = useTranslation();

  return (<div>
    <Row>
      <Col sm={20} md={10}>
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
            label={t("store.Racks.Code")}
            name="rackCode"

            rules={[{
              required: true, message: t("store.Racks.Please input Code !"),
            }, {
              max: t("common.Max"),
              message: t("common.Maximum 255 characters allowed")
            }, {
              whitespace: true,
              message: t("common.Only space is not allowed"),
            },]}
          >
            <Input/>
          </Form.Item>


          <Form.Item
            name="officeId"
            label={t("store.Racks.Store")}

            rules={[{
              required: true, message: t("store.Racks.Please select store !"),
            }]}
          >
            <Select placeholder={t("store.Racks.Select a store")}
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearch}
                    onChange={(e) => {
                      onChange()
                      form.setFieldsValue({...form, roomId: null})
                    }}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    dropdownRender={(menu) => (
                      <>
                        <Button
                          style={{width: "100%"}}
                          type="primary"
                          onClick={() => setShowModal(true)}
                        >
                          + Add Store
                        </Button>
                        {menu}
                      </>
                    )}>
              {offices.map((store, index) => (<Option key={index} value={store.id}>
                {store.code}
              </Option>))}
            </Select>
          </Form.Item>


          <Form.Item
            name="roomId"
            label={t("store.Racks.Room")}
            rules={[{
              required: true, message: t("store.Racks.Please select room !")
            },]}
          >
            <Select allowClear placeholder={t("store.Racks.Select a room")} disabled={isRoomDisabled}

                    showSearch
                    optionFilterProp="children"

                    onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                    dropdownRender={(menu) => (<>
                      <Button
                        style={{width: "100%"}}
                        type="primary"
                        onClick={() => setRoomModal(true)}
                      >
                        + Add Rooms
                      </Button>
                      {menu}
                    </>)}
            >
              {rooms?.map((room, index) => (<Option key={index} value={room.roomId}>
                {room.roomCode}
              </Option>))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("store.Racks.Height")}
            name="rackHeight"
          >
            <Input min={0} type={"number"} style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item
            label={t("store.Racks.Width")}
            name="rackWidth"

          >
            <Input  min={0} type={"number"} style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
            <Space>
              <ARMButton type="primary" htmlType="submit">
                {id ? t("common.Update") : t("common.Submit")}
              </ARMButton>
              <ARMButton
                onClick={onReset}

                type="primary"
                danger
              >
                {t("common.Reset")}
              </ARMButton>
            </Space>
          </Form.Item>
        </ARMForm>
      </Col>
    </Row>
  </div>);
};

export default SaveRack;