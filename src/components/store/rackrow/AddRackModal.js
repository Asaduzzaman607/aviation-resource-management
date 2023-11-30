import React from 'react';
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {useTranslation} from "react-i18next";

const AddRackModal = ({form,layout,onFinish,setVal,setIsRoomDisabled,offices,rooms,id,onReset,officeId,roomId}) => {
  React.useEffect(() => {
    form.setFieldsValue({
      rackCode:null,
      rackHeight:null,
      rackWidth:null,
      officeId:officeId,
      roomId:roomId,
    });
  }, [officeId,roomId]);

  const { t } = useTranslation();
  return (
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
              max:t("common.Max"),
              message: t("common.Maximum 255 characters allowed")
            }, {
              whitespace: true,
              message:t("common.Only space is not allowed"),
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
            <Select allowClear placeholder={t("store.Racks.Select a store")}  disabled={true} onChange={(e) => {
              setVal(e);
              if (e != '') {
                setIsRoomDisabled(false);
              }
              form.setFieldsValue({...form, roomId: null})

            }}>
              {offices?.map((store, index) => (<Select.Option key={index} value={store.id}>
                {store.code}
              </Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item
            name="roomId"
            label={t("store.Racks.Room")}
            rules={[{
              required: true,message:t("store.Racks.Please select room !")
            },]}
          >
            <Select allowClear placeholder={t("store.Racks.Select a room")} disabled={true}
            >
              {rooms?.map((room, index) => (<Select.Option key={index} value={room.roomId}>
                {room.roomCode}
              </Select.Option>))}

            </Select>
          </Form.Item>

          <Form.Item
            label={t("store.Racks.Height")}
            name="rackHeight"


          >
            <Input type={"number"} style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item
            label={t("store.Racks.Width")}
            name="rackWidth"

          >
            <Input type={"number"} style={{width: "100%"}}/>
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
  );
};

export default AddRackModal;